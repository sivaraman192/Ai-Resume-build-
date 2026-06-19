import api from './api.js';
import { calculateAtsScore } from '../utils/atsScoring.js';

// Fallback mocks if server API is not configured or fails
const mockAiService = {
  generateSummary: (role, skills) => {
    return `Results-driven Full Stack Developer with hands-on experience in building scalable web applications using React.js, Node.js, Express.js, and MongoDB. Experienced in developing responsive user interfaces, RESTful APIs, and database-driven applications. Passionate about delivering innovative software solutions and solving real-world business problems.`;
  },

  improveObjective: (objective, role) => {
    return `To secure a challenging position as a Full Stack Developer where I can leverage my experience in modern application development using React.js and Node.js, write clean testable code, and contribute to innovative engineering projects.`;
  },

  suggestSkills: (role = '') => {
    const cleanRole = role.toLowerCase();
    if (cleanRole.includes('frontend') || cleanRole.includes('react') || cleanRole.includes('ui')) {
      return ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Bootstrap', 'Tailwind CSS', 'Git', 'GitHub', 'Responsive Design'];
    }
    if (cleanRole.includes('backend') || cleanRole.includes('node') || cleanRole.includes('api')) {
      return ['Node.js', 'Express.js', 'MongoDB', 'MySQL', 'REST API', 'Git', 'Docker', 'AWS', 'TypeScript'];
    }
    return ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Tailwind CSS', 'REST API', 'Git', 'AWS'];
  },

  rewriteProjectDescription: (title, techStack, description) => {
    const stack = Array.isArray(techStack) ? techStack.join(', ') : (techStack || 'modern tools');
    return `• Designed and developed the "${title || 'Application Platform'}" using ${stack}.\n• Optimized system database architecture, reducing retrieval latency times by 35%.\n• Integrated REST APIs and secure authentication middleware to protect user endpoints.`;
  },

  generateExperienceBullets: (role = 'Software Developer', company = 'Technology Solutions') => {
    return [
      `Designed and implemented responsive web interfaces as a ${role} at ${company}, improving rendering speed and usability by 25%.`,
      `Developed and optimized RESTful APIs and backend microservices using Node.js and Express.js, reducing database latency by 40%.`,
      `Integrated secure payment processing gateways and third-party services, raising checkout conversions by 15%.`,
      `Collaborated with cross-functional engineering teams to build, test, and deploy cloud infrastructure on AWS.`
    ];
  }
};

export const aiService = {
  generateSummary: async (role, skills) => {
    try {
      const response = await api.post('/ai/summary', { role, skills });
      return response.summary || response.data?.summary || response;
    } catch (err) {
      console.warn('AI Summary API failed, using mock data:', err);
      return mockAiService.generateSummary(role, skills);
    }
  },

  improveObjective: async (objective, role) => {
    try {
      const response = await api.post('/ai/objective', { objective, role });
      return response.objective || response.data?.objective || response;
    } catch (err) {
      console.warn('AI Objective API failed, using mock data:', err);
      return mockAiService.improveObjective(objective, role);
    }
  },

  suggestSkills: async (role) => {
    try {
      const response = await api.post('/ai/skills', { role });
      return response.skills || response.data?.skills || response;
    } catch (err) {
      console.warn('AI Skills Suggestion API failed, using mock data:', err);
      return mockAiService.suggestSkills(role);
    }
  },

  rewriteProjectDescription: async (title, techStack, description) => {
    try {
      const response = await api.post('/ai/project-description', { title, techStack, description });
      return response.description || response.data?.description || response;
    } catch (err) {
      console.warn('AI Project Rewrite API failed, using mock data:', err);
      return mockAiService.rewriteProjectDescription(title, techStack, description);
    }
  },

  generateExperienceBullets: async (role, company) => {
    try {
      const response = await api.post('/ai/experience-bullets', { role, company });
      return response.bullets || response.data?.bullets || response;
    } catch (err) {
      console.warn('AI Experience Bullets API failed, using mock data:', err);
      return mockAiService.generateExperienceBullets(role, company);
    }
  },

  scoreResume: async (resume) => {
    try {
      const response = await api.post('/ai/resume-score', { resume });
      return response.data || response;
    } catch (err) {
      console.warn('AI Resume Score API failed, calculating score on client side:', err);
      const calcResult = calculateAtsScore(resume);
      const suggestedKeywords = ['Agile', 'Git', 'REST API', 'Unit Testing', 'CI/CD'];
      
      let skillsArray = [];
      if (resume?.skills) {
        if (Array.isArray(resume.skills) && typeof resume.skills[0] === 'string') {
          skillsArray = resume.skills;
        } else if (Array.isArray(resume.skills)) {
          skillsArray = resume.skills.reduce((acc, curr) => acc.concat(curr.items || []), []);
        }
      }

      const lowerSkills = skillsArray.map(s => s?.toLowerCase());
      if (lowerSkills.includes('react.js') || lowerSkills.includes('react')) {
        suggestedKeywords.push('Redux', 'Next.js', 'TypeScript', 'Tailwind CSS');
      }
      if (lowerSkills.includes('python')) {
        suggestedKeywords.push('Django', 'Flask', 'Pandas', 'NumPy');
      }
      if (lowerSkills.includes('node.js') || lowerSkills.includes('node')) {
        suggestedKeywords.push('Express.js', 'REST API', 'JWT Authentication');
      }

      return {
        score: calcResult.overallScore,
        tips: calcResult.suggestions,
        suggestedKeywords: Array.from(new Set(suggestedKeywords)).slice(0, 8)
      };
    }
  },
};

export default aiService;
