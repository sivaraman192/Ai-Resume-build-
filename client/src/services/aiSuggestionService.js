// aiSuggestionService.js: Scans resume data and provides detailed quality recommendations.

const ACTION_VERBS = [
  'designed', 'developed', 'implemented', 'integrated', 'optimized', 
  'collaborated', 'improved', 'built', 'created', 'managed', 'tested', 'debugged'
];

export const aiSuggestionService = {
  getQualitySuggestions: (resumeData) => {
    const suggestions = [];

    if (!resumeData) {
      return ['Please enter resume data to receive suggestions.'];
    }

    const personalInfo = resumeData.personalInfo || {};
    const summary = resumeData.summary || '';
    const skills = Array.isArray(resumeData.skills)
      ? (resumeData.skills.length > 0 && typeof resumeData.skills[0] === 'string'
          ? resumeData.skills
          : resumeData.skills.reduce((acc, curr) => acc.concat(curr.items || []), []))
      : [];
    const cleanSkills = skills.map(s => s && s.trim().toLowerCase()).filter(Boolean);
    const experience = resumeData.experience || [];
    const projects = resumeData.projects || [];
    const education = resumeData.education || [];
    const certifications = resumeData.certifications || [];

    // 1. Technical Skills Recommendations
    if (cleanSkills.length === 0) {
      suggestions.push({
        id: 'skills_missing',
        category: 'Skills',
        text: 'Add critical technical skills to pass ATS screenings. Include languages, frameworks, and tools.',
        severity: 'high'
      });
    } else {
      const missingCore = [];
      if (!cleanSkills.includes('rest api') && !cleanSkills.includes('apis')) {
        missingCore.push('REST API');
      }
      if (!cleanSkills.includes('jwt authentication') && !cleanSkills.includes('jwt auth')) {
        missingCore.push('JWT Authentication');
      }
      if (!cleanSkills.includes('mongodb atlas') && !cleanSkills.includes('mongodb')) {
        missingCore.push('MongoDB Atlas');
      }
      if (!cleanSkills.includes('git') && !cleanSkills.includes('github')) {
        missingCore.push('Git & GitHub');
      }

      if (missingCore.length > 0) {
        suggestions.push({
          id: 'skills_core_missing',
          category: 'Skills',
          text: `Consider adding core skills: ${missingCore.join(', ')} to boost job description matches.`,
          severity: 'medium'
        });
      }
    }

    // 2. Summary Quality Suggestions
    if (!summary || summary.trim().length === 0) {
      suggestions.push({
        id: 'summary_missing',
        category: 'Summary',
        text: 'Write a professional career summary. Make it action-oriented and mention key frameworks.',
        severity: 'high'
      });
    } else if (summary.trim().length < 100) {
      suggestions.push({
        id: 'summary_short',
        category: 'Summary',
        text: 'Expand your professional summary. A length of 100-150 characters is optimal for ATS systems.',
        severity: 'medium'
      });
    } else {
      const summaryLower = summary.toLowerCase();
      if (!summaryLower.includes('development') && !summaryLower.includes('developer') && !summaryLower.includes('engineer')) {
        suggestions.push({
          id: 'summary_role',
          category: 'Summary',
          text: 'Improve professional summary by explicitly stating your target role (e.g. "Full Stack Developer").',
          severity: 'medium'
        });
      }
    }

    // 3. Experience Action Verbs & Achievements Metrics Check
    if (experience.length === 0 || !experience.some(e => e.company || e.role)) {
      suggestions.push({
        id: 'experience_missing',
        category: 'Experience',
        text: 'Add work experience or internships to demonstrate engineering achievements.',
        severity: 'high'
      });
    } else {
      let missingVerbs = false;
      let missingMetrics = false;
      let bulletsCount = 0;

      experience.forEach(exp => {
        const bullets = Array.isArray(exp.description)
          ? exp.description
          : (typeof exp.description === 'string' ? exp.description.split('\n').filter(Boolean) : []);
        
        const cleanBullets = bullets.map(b => b && b.trim()).filter(Boolean);
        bulletsCount += cleanBullets.length;

        cleanBullets.forEach(b => {
          // Check action verbs
          const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
          if (!ACTION_VERBS.includes(firstWord)) {
            missingVerbs = true;
          }

          // Check metrics (numbers, %, $)
          const hasNum = /[0-9]+%|[0-9]+\s*(?:percent|users|times|multiplier|x|k|m|million)/i.test(b) || /\$[0-9]+/i.test(b);
          if (!hasNum) {
            missingMetrics = true;
          }
        });
      });

      if (bulletsCount === 0) {
        suggestions.push({
          id: 'experience_bullets_missing',
          category: 'Experience',
          text: 'Add bullet point descriptions for each work experience detailing your tasks and wins.',
          severity: 'high'
        });
      } else {
        if (missingVerbs) {
          suggestions.push({
            id: 'experience_action_verbs',
            category: 'Experience',
            text: 'Ensure bullet points start with strong action verbs (e.g. "Designed", "Developed", "Optimized", "Built").',
            severity: 'medium'
          });
        }
        if (missingMetrics) {
          suggestions.push({
            id: 'experience_metrics',
            category: 'Experience',
            text: 'Add measurable achievements. Quantify your impact (e.g. "improved loading speed by 25%", "reduced API latency by 40%").',
            severity: 'medium'
          });
        }
      }
    }

    // 4. Projects Suggestions
    const validProjects = projects.filter(p => p.title && p.title.trim());
    if (validProjects.length === 0) {
      suggestions.push({
        id: 'projects_missing',
        category: 'Projects',
        text: 'Add at least 3 software engineering projects to demonstrate your practical technical expertise.',
        severity: 'high'
      });
    } else {
      if (validProjects.length < 3) {
        suggestions.push({
          id: 'projects_count',
          category: 'Projects',
          text: `You have ${validProjects.length} projects. Add at least 3 projects to fully showcase your range.`,
          severity: 'medium'
        });
      }

      const projectsMissingLinks = validProjects.filter(p => !p.github && !p.liveDemo);
      if (projectsMissingLinks.length > 0) {
        suggestions.push({
          id: 'projects_links',
          category: 'Projects',
          text: `Add GitHub or Live Demo links for: ${projectsMissingLinks.map(p => `"${p.title}"`).join(', ')}.`,
          severity: 'medium'
        });
      }
    }

    // 5. Certifications Suggestions
    const validCerts = certifications.filter(c => c.name && c.name.trim());
    if (validCerts.length === 0) {
      suggestions.push({
        id: 'certifications_missing',
        category: 'Certifications',
        text: 'Add professional certifications or credentials to demonstrate continuous learning.',
        severity: 'low'
      });
    }

    // 6. Contact Links
    if (!personalInfo.github && !personalInfo.linkedin && !links.github && !links.linkedin) {
      suggestions.push({
        id: 'contact_links',
        category: 'Contact',
        text: 'Add your LinkedIn and GitHub profile links to your personal information header.',
        severity: 'high'
      });
    }

    return suggestions;
  }
};

export default aiSuggestionService;
