import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { pdfToPng } = require('pdf-to-png-converter');
const Tesseract = require('tesseract.js');

/**
 * Heuristically parses plain text from a resume into a structured resumeData object.
 */
export const parseResumeText = (text) => {
  const resumeData = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      github: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    languages: []
  };

  if (!text) return resumeData;

  // Split text into lines and trim whitespace
  const lines = text.split('\n').map(l => l.trim());

  // 1. Extract contact details from the whole text using regexes
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-_]+/i;
  const githubRegex = /github\.com\/[a-zA-Z0-9-_]+/i;
  const urlRegex = /https?:\/\/(?!www\.linkedin|linkedin|github|www\.github)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*/i;

  for (const line of lines) {
    if (!resumeData.personalInfo.email) {
      const match = line.match(emailRegex);
      if (match) resumeData.personalInfo.email = match[0];
    }
    if (!resumeData.personalInfo.phone) {
      const match = line.match(phoneRegex);
      if (match) resumeData.personalInfo.phone = match[0];
    }
    if (!resumeData.personalInfo.linkedin) {
      const match = line.match(linkedinRegex);
      if (match) {
        resumeData.personalInfo.linkedin = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
      }
    }
    if (!resumeData.personalInfo.github) {
      const match = line.match(githubRegex);
      if (match) {
        resumeData.personalInfo.github = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
      }
    }
    if (!resumeData.personalInfo.portfolio) {
      const match = line.match(urlRegex);
      if (match) resumeData.personalInfo.portfolio = match[0];
    }
  }

  // Full Name heuristic: Find the first non-empty line of length 3-40 that contains no contact-info keywords or digits
  const nameCandidateLines = lines
    .filter(l => l.length >= 3 && l.length <= 40)
    .filter(l => !l.includes('@') && !l.toLowerCase().includes('http') && !l.toLowerCase().includes('.com') && !l.toLowerCase().includes('github') && !l.toLowerCase().includes('linkedin') && !/\d/.test(l));

  if (nameCandidateLines.length > 0) {
    resumeData.personalInfo.fullName = nameCandidateLines[0];
  }

  // Location heuristic: Check top 15 lines for common address/location pattern
  const locationRegex = /^[a-zA-Z\s]+,\s*[a-zA-Z\s]{2,}(?:\s+\d{5})?$/;
  const topLines = lines.slice(0, 15);
  for (const line of topLines) {
    if (line.includes('@') || line.toLowerCase().includes('http') || line === resumeData.personalInfo.fullName) continue;
    if (locationRegex.test(line) || /^[a-zA-Z\s]+,\s*[a-zA-Z\s]{2,}$/.test(line)) {
      resumeData.personalInfo.location = line;
      break;
    }
  }

  if (!resumeData.personalInfo.location) {
    for (const line of topLines) {
      if (line.includes('@') || line.toLowerCase().includes('http') || line === resumeData.personalInfo.fullName) continue;
      if (line.toLowerCase().includes('location:') || line.toLowerCase().includes('address:')) {
        resumeData.personalInfo.location = line.replace(/location:|address:/i, '').trim();
        break;
      }
    }
  }

  // 2. Parse text into sections based on headings
  let currentSection = '';
  const sectionContent = {
    summary: [],
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    languages: []
  };

  const headings = {
    summary: /^(?:summary|professional\s+summary|about\s+me|objective|profile)$/i,
    skills: /^(?:skills|technical\s+skills|areas\s+of\s+expertise|core\s+competencies|technologies)$/i,
    experience: /^(?:experience|professional\s+experience|work\s+experience|employment\s+history|internship|internships)$/i,
    projects: /^(?:projects|personal\s+projects|academic\s+projects|key\s+projects)$/i,
    education: /^(?:education|academic\s+background|academic\s+credentials|qualifications)$/i,
    certifications: /^(?:certifications|certificates|licensures|licensing)$/i,
    languages: /^(?:languages)$/i
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let matchedSection = null;
    for (const [sectionKey, regex] of Object.entries(headings)) {
      if (regex.test(line)) {
        matchedSection = sectionKey;
        break;
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
      continue;
    }

    if (currentSection) {
      sectionContent[currentSection].push(line);
    }
  }

  // Process Summary
  resumeData.summary = sectionContent.summary.join(' ');

  // Process Skills (split by common delimiters: comma, semicolon, bullet points, pipes)
  const allSkills = [];
  sectionContent.skills.forEach(skillLine => {
    const parts = skillLine.split(/[;,|•\t•\*-]|\s{3,}/).map(p => p.trim()).filter(p => p.length > 0);
    allSkills.push(...parts);
  });
  const cleanSkills = [...new Set(allSkills)].filter(s => s.length > 1 && s.length < 40 && !s.toLowerCase().includes('skills'));
  if (cleanSkills.length > 0) {
    resumeData.skills.push({
      category: 'Technical Skills',
      items: cleanSkills
    });
  }

  // Process Languages
  const allLanguages = [];
  sectionContent.languages.forEach(langLine => {
    const parts = langLine.split(/[;,|•\t•\*-]|\s{3,}/).map(p => p.trim()).filter(p => p.length > 0);
    allLanguages.push(...parts);
  });
  resumeData.languages = [...new Set(allLanguages)].filter(l => l.length > 1 && l.length < 30);

  // Process Certifications
  sectionContent.certifications.forEach(certLine => {
    const cleanCert = certLine.replace(/^[•\*-]\s*/, '').trim();
    if (cleanCert) {
      const yearMatch = cleanCert.match(/\b(19|20)\d{2}\b/);
      const date = yearMatch ? yearMatch[0] : '';
      
      let name = cleanCert;
      let issuer = '';
      
      const parts = cleanCert.split(/,|\bby\b|\bfrom\b/i).map(p => p.trim());
      if (parts.length > 1) {
        name = parts[0];
        issuer = parts[1].replace(/\b(19|20)\d{2}\b/, '').trim();
      }
      
      resumeData.certifications.push({
        name: name || cleanCert,
        issuer: issuer || '',
        date: date || '',
        link: ''
      });
    }
  });

  // Process Education
  let currentEdu = null;
  sectionContent.education.forEach(eduLine => {
    const cleanLine = eduLine.replace(/^[•\*-]\s*/, '').trim();
    if (!cleanLine) return;

    const degreeKeywords = /bachelor|master|phd|diploma|associate|b\.s\.|b\.a\.|m\.s\.|m\.a\.|degree|btech|mtech|b\.tech|m\.tech|hsc|ssc/i;
    const instKeywords = /university|college|school|institute|academy/i;
    const yearMatch = cleanLine.match(/\b(19|20)\d{2}\b/g);

    const isDegree = degreeKeywords.test(cleanLine);
    const isInst = instKeywords.test(cleanLine);

    if (isDegree || isInst || yearMatch) {
      if (currentEdu && (isDegree || (isInst && !currentEdu.institution))) {
        resumeData.education.push(currentEdu);
        currentEdu = null;
      }

      if (!currentEdu) {
        currentEdu = { degree: '', institution: '', location: '', startYear: '', endYear: '', percentage: '' };
      }

      if (yearMatch) {
        if (yearMatch.length > 1) {
          currentEdu.startYear = yearMatch[0];
          currentEdu.endYear = yearMatch[1];
        } else {
          currentEdu.endYear = yearMatch[0];
        }
      }

      if (isInst) {
        const parts = cleanLine.split(/,|\s-\s/).map(p => p.trim());
        const instPart = parts.find(p => instKeywords.test(p));
        currentEdu.institution = instPart || cleanLine;
        
        const otherParts = parts.filter(p => p !== instPart);
        if (otherParts.length > 0 && !currentEdu.degree) {
          currentEdu.degree = otherParts[0].replace(/\b(19|20)\d{2}\b/, '').trim();
        }
      } else if (isDegree) {
        currentEdu.degree = cleanLine.replace(/\b(19|20)\d{2}\b/, '').trim();
      } else {
        currentEdu.institution = cleanLine.replace(/\b(19|20)\d{2}\b/, '').trim();
      }
    } else {
      if (currentEdu) {
        if (cleanLine.toLowerCase().includes('gpa') || cleanLine.includes('%') || cleanLine.toLowerCase().includes('cgpa') || cleanLine.toLowerCase().includes('percentage')) {
          currentEdu.percentage = cleanLine;
        } else if (cleanLine.length < 30) {
          currentEdu.location = cleanLine;
        }
      }
    }
  });
  if (currentEdu) {
    resumeData.education.push(currentEdu);
  }

  // Process Experience
  let currentExp = null;
  sectionContent.experience.forEach(expLine => {
    const cleanLine = expLine.trim();
    if (!cleanLine) return;

    const isBullet = /^[•\*-]/.test(cleanLine);
    const dateMatch = cleanLine.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Present)\b|\b(19|20)\d{2}\b/gi);

    if (!isBullet && (dateMatch || cleanLine.includes('|') || cleanLine.includes(' - ') || cleanLine.split(' ').length < 8)) {
      if (currentExp) {
        resumeData.experience.push(currentExp);
        currentExp = null;
      }

      currentExp = {
        company: '',
        role: '',
        location: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: ''
      };

      if (dateMatch) {
        if (cleanLine.toLowerCase().includes('present')) {
          currentExp.currentlyWorking = true;
          currentExp.endDate = 'Present';
        }
        
        const parts = cleanLine.split(/to|-|–/i).map(p => p.trim());
        if (parts.length > 1) {
          const startMatches = parts[0].match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*(19|20)\d{2}\b/i);
          const endMatches = parts[1].match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Present)?\s*(19|20)\d{2}\b/i);
          
          if (startMatches) currentExp.startDate = startMatches[0];
          if (endMatches) currentExp.endDate = endMatches[0];
        } else if (dateMatch.length > 1) {
          currentExp.startDate = dateMatch[0];
          currentExp.endDate = dateMatch[1];
        } else {
          currentExp.endDate = dateMatch[0];
        }
      }

      const headerParts = cleanLine
        .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Present)\b/gi, '')
        .replace(/\b(19|20)\d{2}\b/g, '')
        .split(/[|,\-]/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

      if (headerParts.length > 1) {
        currentExp.role = headerParts[0];
        currentExp.company = headerParts[1];
        if (headerParts.length > 2) {
          currentExp.location = headerParts[2];
        }
      } else if (headerParts.length > 0) {
        currentExp.role = headerParts[0];
      }
    } else {
      if (currentExp) {
        const descLine = cleanLine.replace(/^[•\*-]\s*/, '').trim();
        if (currentExp.description) {
          currentExp.description += '\n• ' + descLine;
        } else {
          currentExp.description = '• ' + descLine;
        }
      }
    }
  });
  if (currentExp) {
    resumeData.experience.push(currentExp);
  }

  // Process Projects
  let currentProj = null;
  sectionContent.projects.forEach(projLine => {
    const cleanLine = projLine.trim();
    if (!cleanLine) return;

    const isBullet = /^[•\*-]/.test(cleanLine);

    if (!isBullet && (cleanLine.includes('|') || cleanLine.includes(' - ') || cleanLine.split(' ').length < 8)) {
      if (currentProj) {
        resumeData.projects.push(currentProj);
        currentProj = null;
      }

      currentProj = {
        title: '',
        techStack: [],
        description: '',
        github: '',
        liveDemo: ''
      };

      const gitMatch = cleanLine.match(/github\.com\/[a-zA-Z0-9-_/]+/i);
      if (gitMatch) {
        currentProj.github = gitMatch[0].startsWith('http') ? gitMatch[0] : `https://${gitMatch[0]}`;
      }

      const cleanHeader = cleanLine.replace(/https?:\/\/[^\s]+/g, '');
      const parts = cleanHeader.split(/[|\-]/).map(p => p.trim()).filter(p => p.length > 0);

      if (parts.length > 0) {
        currentProj.title = parts[0];
      }
      if (parts.length > 1) {
        currentProj.techStack = parts[1].split(/,+/).map(t => t.trim()).filter(t => t.length > 0);
      }
    } else {
      if (currentProj) {
        const descLine = cleanLine.replace(/^[•\*-]\s*/, '').trim();
        if (!currentProj.github) {
          const gitMatch = cleanLine.match(/github\.com\/[a-zA-Z0-9-_/]+/i);
          if (gitMatch) {
            currentProj.github = gitMatch[0].startsWith('http') ? gitMatch[0] : `https://${gitMatch[0]}`;
          }
        }
        if (currentProj.description) {
          currentProj.description += '\n• ' + descLine;
        } else {
          currentProj.description = '• ' + descLine;
        }
      }
    }
  });
  if (currentProj) {
    resumeData.projects.push(currentProj);
  }

  return resumeData;
};

/**
 * Extracts raw text from the file (PDF or DOCX) and parses it.
 */
export const parseResumeFile = async (filePath, mimeType, fileName = 'unknown') => {
  let text = '';

  if (mimeType === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    
    // Try standard pdf-parse first
    try {
      const pdfData = await pdf(dataBuffer);
      text = pdfData.text || '';
    } catch (parseErr) {
      console.warn(`[Resume Parse Warning] Standard PDF parsing failed for ${fileName}:`, parseErr.message);
      text = '';
    }

    // Fallback to OCR if extracted text is missing or too short (e.g. less than 100 characters)
    if (!text || text.trim().length < 100) {
      console.log(`[Resume Parse OCR] Text layer too short (${text.trim().length} chars). Running OCR on ${fileName}...`);
      try {
        // Convert PDF buffer to PNG buffers in memory
        const pngPages = await pdfToPng(dataBuffer, {
          viewportScale: 2.0 // Good resolution for OCR
        });

        console.log(`[Resume Parse OCR] Converted ${pngPages.length} PDF pages to images. Processing OCR...`);

        let ocrText = '';
        for (const page of pngPages) {
          console.log(`[Resume Parse OCR] OCR processing page ${page.pageNumber}...`);
          const ocrResult = await Tesseract.recognize(page.content, 'eng');
          ocrText += (ocrResult.data.text || '') + '\n';
        }

        text = ocrText;
        console.log(`[Resume Parse OCR] OCR complete. Extracted text length: ${text.length}`);
      } catch (ocrErr) {
        console.error(`[Resume Parse OCR Error] OCR failed for ${fileName}:`, ocrErr);
        // Do not crash, let the empty check below catch it
      }
    }

  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    text = result.value || '';
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }

  // Console logs only for safe debugging
  console.log(`[Resume Parse Debug] File Name: ${fileName}, Mime Type: ${mimeType}, Extracted Text Length: ${text.length}`);

  if (!text || text.trim().length === 0) {
    throw new Error('Could not read text from this PDF. Please upload a text-based PDF or DOCX.');
  }

  return parseResumeText(text);
};
