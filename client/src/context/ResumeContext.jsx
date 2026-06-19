import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import resumeService from '../services/resumeService.js';
import defaultResumeData from '../data/defaultResumeData.js';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'
  const [error, setError] = useState(null);

  const autoSaveTimeoutRef = useRef(null);
  const isFirstMountOrFetch = useRef(true);

  // Map backend format to frontend defaultResumeData format
  const toBackendSubdocument = (item) => {
    if (!item) return item;
    const result = { ...item };
    if (item._id) {
      result._id = item._id;
    } else if (item.id && item.id.length === 24) {
      result._id = item.id;
    }
    delete result.id;
    return result;
  };

  const mergeSavedResume = (localResume, savedResume) => {
    if (!localResume || !savedResume) return localResume || mapBackendToFrontend(savedResume);

    const mappedSaved = mapBackendToFrontend(savedResume);

    return {
      ...localResume,
      _id: mappedSaved._id,
      resumeScore: mappedSaved.resumeScore,
      education: (localResume.education || []).map((item, idx) => {
        const savedItem = mappedSaved.education?.[idx];
        return {
          ...item,
          id: savedItem?.id || item.id,
          _id: savedItem?._id || item._id,
        };
      }),
      experience: (localResume.experience || []).map((item, idx) => {
        const savedItem = mappedSaved.experience?.[idx];
        return {
          ...item,
          id: savedItem?.id || item.id,
          _id: savedItem?._id || item._id,
        };
      }),
      projects: (localResume.projects || []).map((item, idx) => {
        const savedItem = mappedSaved.projects?.[idx];
        return {
          ...item,
          id: savedItem?.id || item.id,
          _id: savedItem?._id || item._id,
        };
      }),
      certifications: (localResume.certifications || []).map((item, idx) => {
        const savedItem = mappedSaved.certifications?.[idx];
        return {
          ...item,
          id: savedItem?.id || item.id,
          _id: savedItem?._id || item._id,
        };
      }),
    };
  };

  // Map backend format to frontend defaultResumeData format
  const mapBackendToFrontend = (resume) => {
    if (!resume) return null;

    const links = {
      github: resume.personalInfo?.github || '',
      linkedin: resume.personalInfo?.linkedin || '',
      portfolio: resume.personalInfo?.portfolio || '',
    };

    let skills = [];
    if (resume.skills && resume.skills.length > 0) {
      const allItems = resume.skills.flatMap(s => s.items || []);
      skills = allItems.filter(s => s && s.trim() !== '');
    }

    const education = resume.education && resume.education.length > 0 
      ? resume.education.map(edu => ({
          id: edu.id || edu._id || crypto.randomUUID(),
          degree: edu.degree || '',
          institution: edu.institution || '',
          location: edu.location || '',
          startYear: edu.startYear || '',
          endYear: edu.endYear || '',
          percentage: edu.percentage || ''
        }))
      : [];

    const projects = resume.projects && resume.projects.length > 0 
      ? resume.projects.map(p => ({
          id: p.id || p._id || crypto.randomUUID(),
          title: p.title || '',
          techStack: Array.isArray(p.techStack) 
            ? p.techStack 
            : (typeof p.techStack === 'string' ? p.techStack.split(',').map(s => s.trim()).filter(s => s !== '') : []),
          description: p.description || '',
          github: p.github || '',
          liveDemo: p.liveDemo || ''
        }))
      : [];

    const experience = resume.experience && resume.experience.length > 0 
      ? resume.experience.map(e => ({
          id: e.id || e._id || crypto.randomUUID(),
          company: e.company || '',
          role: e.role || '',
          location: e.location || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          currentlyWorking: e.currentlyWorking || false,
          description: typeof e.description === 'string'
            ? e.description.split('\n').map(s => s.trim()).filter(s => s !== '')
            : (Array.isArray(e.description) ? e.description : [])
        }))
      : [];

    const certifications = resume.certifications && resume.certifications.length > 0 
      ? resume.certifications.map(c => ({
          id: c.id || c._id || crypto.randomUUID(),
          name: c.name || '',
          issuer: c.issuer || '',
          date: c.date || '',
          link: c.link || ''
        }))
      : [];

    const languages = resume.languages && resume.languages.length > 0 
      ? resume.languages.filter(l => l && l.trim() !== '') 
      : [];

    return {
      ...resume,
      personalInfo: {
        fullName: resume.personalInfo?.fullName || "",
        email: resume.personalInfo?.email || "",
        phone: resume.personalInfo?.phone || "",
        location: resume.personalInfo?.location || "",
        photo: resume.personalInfo?.photo || "",
      },
      links,
      summary: resume.summary || "",
      education,
      skills,
      projects,
      experience,
      certifications,
      languages,
    };
  };

  // Map frontend format back to backend mongoose schema shape
  const mapFrontendToBackend = (resume) => {
    if (!resume) return null;

    const personalInfo = {
      fullName: resume.personalInfo?.fullName || '',
      email: resume.personalInfo?.email || '',
      phone: resume.personalInfo?.phone || '',
      location: resume.personalInfo?.location || '',
      photo: resume.personalInfo?.photo || '',
      github: resume.links?.github || resume.personalInfo?.github || '',
      linkedin: resume.links?.linkedin || resume.personalInfo?.linkedin || '',
      portfolio: resume.links?.portfolio || resume.personalInfo?.portfolio || '',
    };

    const formattedSkills = [
      {
        category: 'Skills',
        items: Array.isArray(resume.skills) ? resume.skills.filter(s => s && s.trim() !== '') : []
      }
    ];

    const education = Array.isArray(resume.education) 
      ? resume.education.filter(e => e.institution || e.degree).map(toBackendSubdocument) 
      : [];

    const projects = Array.isArray(resume.projects) 
      ? resume.projects.filter(p => p.title).map(p => {
          const mapped = toBackendSubdocument(p);
          mapped.techStack = Array.isArray(p.techStack) ? p.techStack.filter(s => s && s.trim() !== '') : [];
          return mapped;
        })
      : [];

    const experience = Array.isArray(resume.experience) 
      ? resume.experience.filter(e => e.company || e.role).map(e => {
          const mapped = toBackendSubdocument(e);
          mapped.currentlyWorking = !!e.currentlyWorking;
          mapped.description = Array.isArray(e.description)
            ? e.description.filter(s => s && s.trim() !== '').join('\n')
            : (e.description || '')
          return mapped;
        })
      : [];

    const certifications = Array.isArray(resume.certifications) 
      ? resume.certifications.filter(c => c.name).map(toBackendSubdocument) 
      : [];

    const languages = Array.isArray(resume.languages) 
      ? resume.languages.filter(l => l && l.trim() !== '') 
      : [];

    return {
      ...resume,
      personalInfo,
      skills: formattedSkills,
      education,
      projects,
      experience,
      certifications,
      languages,
    };
  };

  // Fetch all resumes for current user
  const fetchResumes = async () => {
    setLoading(true);
    try {
      const data = await resumeService.getAllResumes();
      setResumes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single resume and set as current
  const fetchResumeById = async (id) => {
    setLoading(true);
    try {
      const data = await resumeService.getResumeById(id);
      const mapped = mapBackendToFrontend(data);
      setCurrentResume(mapped);
      isFirstMountOrFetch.current = true; // Block auto-save trigger on first load
      setError(null);
      return mapped;
    } catch (err) {
      setError(err.message || 'Failed to fetch resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize a new unsaved resume locally
  const initializeNewUnsavedResume = (templateName = 'modern') => {
    const initialized = {
      ...defaultResumeData,
      title: `My ${templateName.toUpperCase()} Resume`,
      template: templateName,
    };
    setCurrentResume(initialized);
    isFirstMountOrFetch.current = true; // Block auto-save on initial set
    setError(null);
  };

  // Save/Persist data to database
  const saveResumeData = async (resumeToSave) => {
    if (!resumeToSave) return;
    setSaveStatus('saving');
    try {
      const backendPayload = mapFrontendToBackend(resumeToSave);
      let updated;
      
      if (!resumeToSave._id) {
        // Create new record
        const created = await resumeService.createResume(
          backendPayload.title || 'My Resume',
          backendPayload.template || 'modern'
        );
        // Merge frontend values with backend ID
        const merged = { ...backendPayload, _id: created._id };
        updated = await resumeService.updateResume(created._id, merged);
        window.history.replaceState(null, '', `/builder/${created._id}?template=${created.template}`);
      } else {
        // Update existing record
        updated = await resumeService.updateResume(resumeToSave._id, backendPayload);
      }

      const mappedUpdated = mapBackendToFrontend(updated);

      setResumes((prev) => {
        const exists = prev.some((r) => r._id === mappedUpdated._id);
        if (exists) {
          return prev.map((r) => (r._id === mappedUpdated._id ? { ...r, title: mappedUpdated.title, resumeScore: mappedUpdated.resumeScore } : r));
        } else {
          return [mappedUpdated, ...prev];
        }
      });

      setCurrentResume((prev) => mergeSavedResume(prev, updated));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return updated;
    } catch (err) {
      console.error('Error auto-saving:', err);
      setSaveStatus('error');
      setError(err.message || 'Auto-save failed');
    }
  };

  // Debounced auto-save effect
  useEffect(() => {
    if (isFirstMountOrFetch.current) {
      isFirstMountOrFetch.current = false;
      return;
    }

    if (!currentResume) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setSaveStatus('saving');
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveResumeData(currentResume);
    }, 2000); // 2 second debounce

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [currentResume]);

  // Create a new resume directly
  const createNewResume = async (title, template = 'modern') => {
    setLoading(true);
    try {
      const newResume = await resumeService.createResume(title, template);
      const mapped = mapBackendToFrontend(newResume);
      setResumes((prev) => [mapped, ...prev]);
      setCurrentResume(mapped);
      isFirstMountOrFetch.current = true;
      return mapped;
    } catch (err) {
      setError(err.message || 'Failed to create resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a resume
  const deleteResume = async (id) => {
    try {
      await resumeService.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      if (currentResume && currentResume._id === id) {
        setCurrentResume(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete resume');
      throw err;
    }
  };

  const updatePersonalInfo = (info) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        personalInfo: { ...(prev.personalInfo || {}), ...info },
      };
    });
  };

  const updateSummary = (summaryText) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        summary: summaryText,
      };
    });
  };

  const updateSection = (sectionName, items) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [sectionName]: items,
      };
    });
  };

  const updateTemplate = (templateName) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        template: templateName,
      };
    });
  };

  const updateTitle = (newTitle) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        title: newTitle,
      };
    });
  };

  const value = {
    resumes,
    currentResume,
    loading,
    saveStatus,
    error,
    fetchResumes,
    fetchResumeById,
    createNewResume,
    initializeNewUnsavedResume,
    deleteResume,
    updatePersonalInfo,
    updateSummary,
    updateSection,
    updateTemplate,
    updateTitle,
    setCurrentResume,
    manualSave: (data) => saveResumeData(data || currentResume),
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export default ResumeContext;
