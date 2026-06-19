// atsScoring.js: Evaluates resume content quality and calculates scores and suggestions for ATS optimization.

const ACTION_VERBS = [
  'designed', 'developed', 'implemented', 'integrated', 'optimized', 
  'collaborated', 'improved', 'built', 'created', 'managed', 'tested', 'debugged'
];

const ATS_KEYWORDS = [
  'react.js', 'react', 'node.js', 'node', 'express.js', 'express', 'mongodb', 'mongodb atlas', 
  'mysql', 'javascript', 'typescript', 'python', 'java', 'git', 'github', 'rest api', 'apis',
  'jwt authentication', 'socket.io', 'google maps api', 'qr code integration', 'tailwind css',
  'bootstrap', 'html5', 'css3', 'cloud', 'microsoft azure', 'google cloud platform', 'aws'
];

export const calculateAtsScore = (resume) => {
  if (!resume) {
    return {
      overallScore: 0,
      subScores: {
        contact: 0,
        summary: 0,
        skills: 0,
        experience: 0,
        projects: 0,
        education: 0,
        certifications: 0,
        formatting: 0
      },
      missingKeywords: [],
      suggestions: ['Please start entering your resume details to calculate the score.']
    };
  }

  const suggestions = [];
  const missingKeywords = [];

  // Extract fields safely
  const personalInfo = resume.personalInfo || {};
  const links = resume.links || {};
  const summary = resume.summary || '';
  const skills = Array.isArray(resume.skills) 
    ? (resume.skills.length > 0 && typeof resume.skills[0] === 'string' 
        ? resume.skills 
        : resume.skills.reduce((acc, curr) => acc.concat(curr.items || []), []))
    : [];
  const cleanSkills = skills.map(s => s && s.trim()).filter(Boolean);
  const experience = resume.experience || [];
  const projects = resume.projects || [];
  const education = resume.education || [];
  const certifications = resume.certifications || [];

  // 1. Contact Info (Max 10)
  let contactScore = 0;
  if (personalInfo.fullName && personalInfo.fullName.trim()) contactScore += 2;
  else suggestions.push('Add your full name to the personal info section.');

  if (personalInfo.email && personalInfo.email.trim()) contactScore += 2;
  else suggestions.push('Add your email address so recruiters can contact you.');

  if (personalInfo.phone && personalInfo.phone.trim()) contactScore += 2;
  else suggestions.push('Add your phone number for recruiter calls.');

  if (personalInfo.location && personalInfo.location.trim()) contactScore += 2;
  else suggestions.push('Add your city and state/country location.');

  const hasLink = (links.github && links.github.trim()) || 
                  (links.linkedin && links.linkedin.trim()) || 
                  (links.portfolio && links.portfolio.trim()) ||
                  (personalInfo.github && personalInfo.github.trim()) ||
                  (personalInfo.linkedin && personalInfo.linkedin.trim()) ||
                  (personalInfo.portfolio && personalInfo.portfolio.trim());
  if (hasLink) contactScore += 2;
  else suggestions.push('Include a professional link (LinkedIn, GitHub, or Portfolio).');

  // 2. Professional Summary (Max 15)
  let summaryScore = 0;
  if (summary && summary.trim()) {
    summaryScore += 5;
    if (summary.trim().length >= 100) summaryScore += 5;
    else suggestions.push('Make your professional summary longer (minimum 100 characters).');

    if (summary.trim().length >= 150) summaryScore += 5;
  } else {
    suggestions.push('Add a professional summary to highlight your core values.');
  }

  // 3. Technical Skills (Max 20)
  let skillsScore = 0;
  if (cleanSkills.length > 0) {
    if (cleanSkills.length >= 12) skillsScore = 20;
    else if (cleanSkills.length >= 8) skillsScore = 15;
    else if (cleanSkills.length >= 4) skillsScore = 10;
    else skillsScore = 5;

    if (cleanSkills.length < 8) {
      suggestions.push('Add more technical skills to optimize for recruiter matching.');
    }
  } else {
    suggestions.push('Add technical and professional skills.');
  }

  // 4. Experience (Max 15)
  let experienceScore = 0;
  const validExp = experience.filter(exp => exp.company || exp.role);
  if (validExp.length > 0) {
    experienceScore += 5;

    // Bullets check
    let totalBullets = 0;
    let actionVerbCount = 0;
    validExp.forEach(exp => {
      const bullets = Array.isArray(exp.description)
        ? exp.description
        : (typeof exp.description === 'string' ? exp.description.split('\n').filter(Boolean) : []);
      const cleanBullets = bullets.map(b => b && b.trim()).filter(Boolean);
      totalBullets += cleanBullets.length;

      cleanBullets.forEach(b => {
        const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
        if (ACTION_VERBS.includes(firstWord)) {
          actionVerbCount++;
        }
      });
    });

    if (totalBullets >= 3) {
      experienceScore += 5;
    } else {
      suggestions.push('Write at least 3 detailed bullet points describing your achievements.');
    }

    if (actionVerbCount > 0) {
      experienceScore += 5;
    } else {
      suggestions.push('Begin experience bullets with strong action verbs (e.g. "Developed", "Optimized", "Designed").');
    }
  } else {
    suggestions.push('Add work experience or internship projects.');
  }

  // 5. Projects (Max 20)
  let projectsScore = 0;
  const validProj = projects.filter(p => p.title);
  if (validProj.length > 0) {
    projectsScore += 5;

    const hasStack = validProj.some(p => p.techStack && p.techStack.length > 0);
    if (hasStack) projectsScore += 5;
    else suggestions.push('Add a Tech Stack to your project listings.');

    const hasLinks = validProj.some(p => p.github || p.liveDemo);
    if (hasLinks) projectsScore += 5;
    else suggestions.push('Add GitHub or Live Demo links to showcase your projects.');

    const hasDesc = validProj.some(p => p.description && p.description.trim().length >= 50);
    if (hasDesc) projectsScore += 5;
    else suggestions.push('Write comprehensive descriptions for your projects.');
  } else {
    suggestions.push('Add at least 3 key projects to show practical skills.');
  }

  // 6. Education (Max 10)
  let educationScore = 0;
  const validEdu = education.filter(edu => edu.institution || edu.degree);
  if (validEdu.length > 0) {
    educationScore += 3;
    const hasDegree = validEdu.some(edu => edu.degree);
    const hasInst = validEdu.some(edu => edu.institution);
    if (hasDegree && hasInst) educationScore += 3;

    const hasLoc = validEdu.some(edu => edu.location && edu.location.trim());
    if (hasLoc) educationScore += 2;
    else suggestions.push('Provide a location (city/state) for your academic education.');

    const hasYearScore = validEdu.some(edu => edu.endYear && edu.percentage);
    if (hasYearScore) educationScore += 2;
    else suggestions.push('Add graduation year and scores/CGPA to your education.');
  } else {
    suggestions.push('Include your education background.');
  }

  // 7. Certifications (Max 5)
  let certScore = 0;
  const validCert = certifications.filter(c => c.name);
  if (validCert.length > 0) {
    certScore = 5;
  } else {
    suggestions.push('Include professional certifications or online training credentials.');
  }

  // 8. Formatting (Max 5)
  let formattingScore = 5;
  if (!personalInfo.fullName || !personalInfo.email) {
    formattingScore -= 2;
  }
  if (experience.length === 0 && projects.length === 0) {
    formattingScore -= 2;
  }

  const overallScore = contactScore + summaryScore + skillsScore + experienceScore + projectsScore + educationScore + certScore + formattingScore;

  // ATS Keyword analysis
  const lowerSkills = cleanSkills.map(s => s.toLowerCase());
  const allResumeText = `${summary} ${cleanSkills.join(' ')} ${experience.map(e => e.company + ' ' + e.role + ' ' + (Array.isArray(e.description) ? e.description.join(' ') : e.description)).join(' ')} ${projects.map(p => p.title + ' ' + (Array.isArray(p.techStack) ? p.techStack.join(' ') : p.techStack) + ' ' + p.description).join(' ')}`.toLowerCase();

  ATS_KEYWORDS.forEach(keyword => {
    if (!allResumeText.includes(keyword)) {
      missingKeywords.push(keyword);
    }
  });

  return {
    overallScore: Math.min(overallScore, 100),
    subScores: {
      contact: contactScore,
      summary: summaryScore,
      skills: skillsScore,
      experience: experienceScore,
      projects: projectsScore,
      education: educationScore,
      certifications: certScore,
      formatting: formattingScore
    },
    missingKeywords: missingKeywords.slice(0, 10), // Return top 10 missing
    suggestions: suggestions.length > 0 ? suggestions : ['Your resume looks exceptionally competitive and recruiter ready!']
  };
};

export default calculateAtsScore;
