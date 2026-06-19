import Resume from '../models/Resume.js';

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
  try {
    const { title, template } = req.body;

    const resume = new Resume({
      userId: req.user._id,
      title: title || 'My Resume',
      template: template || 'modern',
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        github: '',
        linkedin: '',
        portfolio: '',
        photo: '',
      },
      summary: '',
      education: [],
      skills: [],
      projects: [],
      experience: [],
      certifications: [],
      languages: [],
      resumeScore: 0,
    });

    const createdResume = await resume.save();
    res.status(201).json(createdResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user resumes
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resume by ID
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (resume) {
      // Check if user owns the resume
      if (resume.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to access this resume' });
      }
      res.json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (resume) {
      // Check ownership
      if (resume.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to update this resume' });
      }

      // Create snapshot of current data before updating
      const snapshot = {
        title: resume.title,
        template: resume.template,
        personalInfo: resume.personalInfo,
        summary: resume.summary,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
        experience: resume.experience,
        certifications: resume.certifications,
        languages: resume.languages,
        resumeScore: resume.resumeScore
      };

      if (!resume.versions) {
        resume.versions = [];
      }

      // Prevent exact duplicate snapshots in quick succession
      let isDifferent = true;
      if (resume.versions.length > 0) {
        const lastVersion = resume.versions[resume.versions.length - 1];
        if (
          lastVersion.data.title === resume.title &&
          lastVersion.data.summary === resume.summary &&
          JSON.stringify(lastVersion.data.personalInfo) === JSON.stringify(resume.personalInfo) &&
          JSON.stringify(lastVersion.data.skills) === JSON.stringify(resume.skills) &&
          JSON.stringify(lastVersion.data.projects) === JSON.stringify(resume.projects) &&
          JSON.stringify(lastVersion.data.experience) === JSON.stringify(resume.experience) &&
          JSON.stringify(lastVersion.data.education) === JSON.stringify(resume.education)
        ) {
          isDifferent = false;
        }
      }

      if (isDifferent) {
        resume.versions.push({
          savedAt: new Date(),
          data: snapshot
        });
        // Keep at most 15 versions
        if (resume.versions.length > 15) {
          resume.versions.shift();
        }
      }

      // Update fields
      resume.title = req.body.title ?? resume.title;
      resume.template = req.body.template ?? resume.template;
      resume.personalInfo = req.body.personalInfo ?? resume.personalInfo;
      resume.summary = req.body.summary ?? resume.summary;
      resume.education = req.body.education ?? resume.education;
      resume.skills = req.body.skills ?? resume.skills;
      resume.projects = req.body.projects ?? resume.projects;
      resume.experience = req.body.experience ?? resume.experience;
      resume.certifications = req.body.certifications ?? resume.certifications;
      resume.languages = req.body.languages ?? resume.languages;
      resume.resumeScore = req.body.resumeScore ?? resume.resumeScore;

      const updatedResume = await resume.save();
      res.json(updatedResume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Restore a resume version
// @route   POST /api/resumes/:id/restore
// @access  Private
export const restoreVersion = async (req, res) => {
  try {
    const { versionId } = req.body;
    if (!versionId) {
      return res.status(400).json({ message: 'Version ID is required' });
    }

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this resume' });
    }

    const version = resume.versions.find(v => v._id.toString() === versionId.toString());

    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }

    // Save a snapshot of the current state as a version before restoring
    const currentSnapshot = {
      title: resume.title,
      template: resume.template,
      personalInfo: resume.personalInfo,
      summary: resume.summary,
      education: resume.education,
      skills: resume.skills,
      projects: resume.projects,
      experience: resume.experience,
      certifications: resume.certifications,
      languages: resume.languages,
      resumeScore: resume.resumeScore
    };

    resume.versions.push({
      savedAt: new Date(),
      data: currentSnapshot
    });

    // Restore fields from the chosen version
    const restoreData = version.data;
    resume.title = restoreData.title ?? resume.title;
    resume.template = restoreData.template ?? resume.template;
    resume.personalInfo = restoreData.personalInfo ?? resume.personalInfo;
    resume.summary = restoreData.summary ?? resume.summary;
    resume.education = restoreData.education ?? resume.education;
    resume.skills = restoreData.skills ?? resume.skills;
    resume.projects = restoreData.projects ?? resume.projects;
    resume.experience = restoreData.experience ?? resume.experience;
    resume.certifications = restoreData.certifications ?? resume.certifications;
    resume.languages = restoreData.languages ?? resume.languages;
    resume.resumeScore = restoreData.resumeScore ?? resume.resumeScore;

    if (resume.versions.length > 15) {
      resume.versions.shift();
    }

    const updatedResume = await resume.save();
    res.json(updatedResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (resume) {
      // Check ownership
      if (resume.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to delete this resume' });
      }

      await Resume.deleteOne({ _id: req.params.id });
      res.json({ message: 'Resume removed' });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
