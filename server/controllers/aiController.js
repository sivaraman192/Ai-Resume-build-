// Simulated delay for premium feel when using Mock AI
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Call Gemini API if available, otherwise fallback to mock data
const callGemini = async (prompt, fallbackResponse) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    await delay(800); // Mimic network delay for realism
    return fallbackResponse;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API error, falling back:', errText);
      return fallbackResponse;
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (resultText) {
      return resultText.trim();
    }
    return fallbackResponse;
  } catch (error) {
    console.error('Gemini fetch exception:', error);
    return fallbackResponse;
  }
};

// @desc    Generate summary from skills and role
// @route   POST /api/ai/summary
// @access  Private
export const generateSummary = async (req, res) => {
  try {
    const { role, skills } = req.body;
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const skillsStr = Array.isArray(skills) ? skills.join(', ') : skills || '';
    const mockResponse = `Results-driven Full Stack Developer with hands-on experience in building scalable web applications using React.js, Node.js, Express.js, and MongoDB. Experienced in developing responsive user interfaces, RESTful APIs, and database-driven applications. Passionate about delivering innovative software solutions and solving real-world business problems.`;

    const text = await callGemini(prompt, mockResponse);
    res.json({ summary: text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Improve career objective
// @route   POST /api/ai/objective
// @access  Private
export const improveObjective = async (req, res) => {
  try {
    const { objective, role } = req.body;
    if (!objective) {
      return res.status(400).json({ message: 'Current objective is required' });
    }

    const prompt = `Rewrite the following career objective for a ${role || 'professional'} to make it more professional, impactful, and tailored to recruiters: "${objective}". Do not include conversational filler or quotes in your output.`;

    const mockResponse = `To secure a challenging role as a ${role || 'Software Engineer'} where I can leverage my technical aptitude, problem-solving abilities, and passion for innovation to build high-performance applications while contributing to the overall growth and success of the organization.`;

    const text = await callGemini(prompt, mockResponse);
    res.json({ objective: text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suggest skills based on role
// @route   POST /api/ai/skills
// @access  Private
export const suggestSkills = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const prompt = `For a professional role of "${role}", provide a list of relevant skills categorized into Frontend, Backend, Database, Tools & Others. Respond ONLY with a valid JSON array of objects, where each object has a "category" (string) and "items" (array of strings). Do not include markdown code block syntax.`;

    // Setup fallback skills list based on matched role keywords
    let mockSkills = [
      { category: 'Web Development', items: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS'] },
      { category: 'Backend Development', items: ['Node.js', 'Express.js', 'Spring Boot'] },
      { category: 'Databases', items: ['MongoDB', 'MySQL', 'MongoDB Atlas'] },
      { category: 'Programming Languages', items: ['JavaScript', 'Python', 'Java'] },
      { category: 'Tools & Platforms', items: ['Git', 'GitHub', 'VS Code', 'Postman'] },
      { category: 'APIs & Technologies', items: ['REST API', 'JWT Authentication', 'Socket.io', 'Google Maps API'] },
      { category: 'Cloud', items: ['Microsoft Azure', 'Google Cloud Platform', 'AWS'] }
    ];

    const roleLower = role.toLowerCase();
    if (roleLower.includes('frontend')) {
      mockSkills = [
        { category: 'Web Development', items: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite'] },
        { category: 'Programming Languages', items: ['JavaScript', 'TypeScript'] },
        { category: 'Tools & Platforms', items: ['Git', 'GitHub', 'VS Code', 'Postman'] },
        { category: 'APIs & Technologies', items: ['REST API', 'Socket.io'] }
      ];
    } else if (roleLower.includes('backend')) {
      mockSkills = [
        { category: 'Backend Development', items: ['Node.js', 'Express.js', 'Spring Boot'] },
        { category: 'Databases', items: ['MongoDB', 'MySQL', 'MongoDB Atlas'] },
        { category: 'Programming Languages', items: ['JavaScript', 'Python', 'Java'] },
        { category: 'Tools & Platforms', items: ['Git', 'GitHub', 'VS Code', 'Postman'] }
      ];
    }

    const apiResponse = await callGemini(prompt, JSON.stringify(mockSkills));
    try {
      // Safely parse JSON output. Clean markdown wrapper if AI outputs it.
      let jsonString = apiResponse;
      if (jsonString.includes('```')) {
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      }
      const parsed = JSON.parse(jsonString);
      res.json({ skills: parsed });
    } catch (parseError) {
      console.warn('Failed to parse Gemini response for skills, returning mock:', parseError);
      res.json({ skills: mockSkills });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rewrite project description
// @route   POST /api/ai/project-description
// @access  Private
export const rewriteProjectDescription = async (req, res) => {
  try {
    const { title, techStack, description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Project description is required' });
    }

    const prompt = `Rewrite the following description for a project named "${title || 'My Project'}" built using ${
      Array.isArray(techStack) ? techStack.join(', ') : techStack || 'modern technologies'
    }: "${description}". Rewrite it into 3 clean, professional bullet points starting with strong action verbs (e.g., Developed, Designed, Engineered, Optimized). Return the bullet points separated by newline. No other conversational introductory or concluding text.`;

    const mockResponse = `• Designed and developed frontend client components, improving UI performance and load times by 30%.
• Optimized REST APIs and MongoDB Atlas database schema queries to minimize server processing delay.
• Integrated JWT Authentication and Socket.io to support secure real-time message communications.`;

    const text = await callGemini(prompt, mockResponse);
    res.json({ description: text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate score and suggest keywords
// @route   POST /api/ai/resume-score
// @access  Private
export const scoreResume = async (req, res) => {
  try {
    const { resume } = req.body;
    if (!resume) {
      return res.status(400).json({ message: 'Resume data is required' });
    }

    // Determine basic score in backend
    let score = 0;
    const tips = [];
    const keywords = [];

    // Basic scoring algorithm
    if (resume.personalInfo?.fullName) score += 15;
    else tips.push('Add your full name to make a strong personal brand.');

    if (resume.personalInfo?.email && resume.personalInfo?.phone) score += 15;
    else tips.push('Add both email and phone number for contact accessibility.');

    if (resume.summary) score += 10;
    else tips.push('Write a professional career summary or objective.');

    if (resume.education && resume.education.length > 0) score += 15;
    else tips.push('Include your academic background / graduation details.');

    if (resume.skills && resume.skills.length > 0) {
      score += 15;
      // Gather some keyword items to check
      resume.skills.forEach(s => {
        if (s.items) keywords.push(...s.items);
      });
    } else {
      tips.push('Add at least one technical or professional skill category.');
    }

    if (resume.projects && resume.projects.length > 0) score += 15;
    else tips.push('Add projects to showcase your practical application of skills.');

    if (resume.experience && resume.experience.length > 0) score += 15;
    else tips.push('Include professional experience or internship projects.');

    // Normalize score
    if (score > 100) score = 100;

    // Default suggestions based on profile title / content
    const titleLower = (resume.title || '').toLowerCase();
    let suggestedKeywords = ['Agile', 'Git', 'Problem Solving', 'Team Collaboration'];
    
    if (titleLower.includes('web') || titleLower.includes('react') || titleLower.includes('frontend')) {
      suggestedKeywords = ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST API', 'Vite', 'Web Performance'];
    } else if (titleLower.includes('backend') || titleLower.includes('node')) {
      suggestedKeywords = ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT Token', 'SQL', 'Docker', 'MVC Architecture'];
    } else if (titleLower.includes('data') || titleLower.includes('python')) {
      suggestedKeywords = ['Python', 'SQL', 'Data Analytics', 'Pandas', 'Machine Learning', 'Data Visualization'];
    }

    // AI suggestions if key exists
    const prompt = `Analyze this resume title: "${resume.title}" and summary: "${resume.summary}". Return a comma-separated list of 8 high-impact technical keywords and industry terms that this candidate should include to pass ATS scans. Return ONLY the comma-separated keywords.`;
    const apiResponse = await callGemini(prompt, suggestedKeywords.join(', '));
    const processedKeywords = apiResponse
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    res.json({
      score: score || 30, // Minimum baseline
      tips: tips.length > 0 ? tips : ['Your resume looks highly complete! Consider adding more certifications or project details.'],
      suggestedKeywords: processedKeywords.length > 0 ? processedKeywords : suggestedKeywords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
