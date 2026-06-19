// jobMatch.js: Analyzes overlap between a resume and a job description.

const TECH_KEYWORDS = [
  'react.js', 'react', 'node.js', 'node', 'express.js', 'express', 'mongodb', 'mongodb atlas', 
  'mysql', 'javascript', 'typescript', 'python', 'java', 'git', 'github', 'rest api', 'apis',
  'jwt authentication', 'socket.io', 'google maps api', 'qr code integration', 'tailwind css',
  'bootstrap', 'html5', 'css3', 'cloud', 'microsoft azure', 'google cloud platform', 'aws',
  'redux', 'next.js', 'firebase', 'postman', 'docker', 'django', 'flask', 'pandas', 'numpy',
  'anaconda', 'figma', 'ui design', 'problem solving', 'api integration', 'full stack development',
  'responsive web development', 'postgresql', 'sql', 'c++', 'c#', 'go', 'vue.js', 'angular',
  'kubernetes', 'agile', 'scrum', 'ci/cd', 'devops', 'web performance', 'testing', 'jest'
];

export const analyzeJobMatch = (resumeData, jobDescription) => {
  if (!resumeData || !jobDescription || !jobDescription.trim()) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: ['Please provide a job description to run the ATS scan.']
    };
  }

  const normalizedJd = jobDescription.toLowerCase();
  
  // Extract technical keywords mentioned in the Job Description
  const jdKeywords = TECH_KEYWORDS.filter(keyword => {
    // Escape special chars for regex
    const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9+#.])` + escaped + `($|[^a-zA-Z0-9+#.])`, 'i');
    return regex.test(normalizedJd);
  });

  if (jdKeywords.length === 0) {
    return {
      score: 50, // Default baseline if JD is generic
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: ['The job description is generic. Try adding tech stack keywords like React, Node, or REST APIs.']
    };
  }

  // Gather all resume text
  const personalInfo = resumeData.personalInfo || {};
  const summary = resumeData.summary || '';
  const skills = Array.isArray(resumeData.skills) 
    ? (resumeData.skills.length > 0 && typeof resumeData.skills[0] === 'string' 
        ? resumeData.skills 
        : resumeData.skills.reduce((acc, curr) => acc.concat(curr.items || []), []))
    : [];
  const cleanSkills = skills.map(s => s && s.trim()).filter(Boolean);
  const experience = resumeData.experience || [];
  const projects = resumeData.projects || [];
  
  const experienceText = experience.map(exp => {
    const descStr = Array.isArray(exp.description) ? exp.description.join(' ') : exp.description;
    return `${exp.company} ${exp.role} ${descStr}`;
  }).join(' ');

  const projectsText = projects.map(p => {
    const descStr = Array.isArray(p.description) ? p.description.join(' ') : p.description;
    const stackStr = Array.isArray(p.techStack) ? p.techStack.join(' ') : p.techStack;
    return `${p.title} ${stackStr} ${descStr}`;
  }).join(' ');

  const fullResumeText = `${summary} ${cleanSkills.join(' ')} ${experienceText} ${projectsText}`.toLowerCase();

  // Compute matched and missing keywords
  const matchedKeywords = [];
  const missingKeywords = [];

  jdKeywords.forEach(keyword => {
    const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9+#.])` + escaped + `($|[^a-zA-Z0-9+#.])`, 'i');
    if (regex.test(fullResumeText)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const score = Math.round((matchedKeywords.length / jdKeywords.length) * 100);

  // Generate suggestions based on missing keywords
  const suggestions = [];
  missingKeywords.forEach(kw => {
    const capitalizedKw = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    suggestions.push(`Add "${capitalizedKw}" to Technical Skills or mention it in project descriptions.`);
  });

  if (suggestions.length === 0) {
    suggestions.push('Excellent! Your resume fully aligns with the job description keywords.');
  }

  return {
    score,
    matchedKeywords,
    missingKeywords,
    suggestions: suggestions.slice(0, 5) // Return top 5 suggestions
  };
};

export default analyzeJobMatch;
