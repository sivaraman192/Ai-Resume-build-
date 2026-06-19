// exportDocx.js: Direct Microsoft Word DOCX generator using docx and file-saver.
import { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { groupSkills } from './groupSkills.js';

/**
 * Direct download of Microsoft Word (.docx) file containing the resume data.
 * Does not show a print dialog, generating the document structure directly.
 * 
 * @param {Object} resumeData The data to populate in the resume.
 */
export const exportResumeDocx = (resumeData) => {
  if (!resumeData) return;

  const personalInfo = resumeData.personalInfo || {};
  const links = resumeData.links || {};
  const summary = resumeData.summary || '';
  const education = resumeData.education || [];
  const skills = resumeData.skills || [];
  const projects = resumeData.projects || [];
  const experience = resumeData.experience || [];
  const certifications = resumeData.certifications || [];
  const languages = resumeData.languages || [];

  const children = [];

  // Helper to add section headings with bottom borders
  const addSectionHeader = (title) => {
    children.push(new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          font: "Arial",
          size: 22, // 11pt
          color: "0F172A",
        })
      ],
      spacing: { before: 160, after: 120 }, // Spacing after divider: 120 twips
      border: {
        bottom: {
          color: "808080",
          space: 1,
          style: BorderStyle.SINGLE,
          value: BorderStyle.SINGLE, // Fallback for various docx library versions
          size: 6,
        }
      }
    }));
  };

  // Helper to add double column lines (Role left / Date right) using Tab Stops
  const addDoubleColumnLine = (leftText, rightText, options = {}) => {
    children.push(new Paragraph({
      tabStops: [
        {
          type: "right",
          position: 10400, // Standard width for A4 printable zone
        }
      ],
      children: [
        new TextRun({
          text: leftText,
          bold: !!options.leftBold,
          italic: !!options.leftItalic,
          font: "Arial",
          size: options.fontSize || 19, // ~9.5pt
          color: "1E293B",
        }),
        new TextRun({
          text: `\t${rightText}`,
          bold: !!options.rightBold,
          italic: !!options.rightItalic,
          font: "Arial",
          size: options.fontSize || 19,
          color: "475569",
        })
      ],
      spacing: { before: options.spaceBefore || 0, after: options.spaceAfter || 0 }
    }));
  };

  // Helper to add standard text paragraphs
  const addParagraph = (text, options = {}) => {
    children.push(new Paragraph({
      children: [
        new TextRun({
          text: text,
          bold: !!options.bold,
          italic: !!options.italic,
          font: "Arial",
          size: options.fontSize || 19, // ~9.5pt
          color: "1E293B",
        })
      ],
      alignment: options.align === 'center' ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { before: options.spaceBefore || 0, after: options.spaceAfter || 80 }, // margin-bottom: 4px (~80 dxa)
      lineSpacing: { before: 0, after: 0, line: 270 } // line-height: 1.35 (~270 dxa)
    }));
  };

  // Helper to add custom formatted bullet points
  const addBulletPoint = (text) => {
    children.push(new Paragraph({
      children: [
        new TextRun({
          text: `•  ${text}`,
          font: "Arial",
          size: 18, // 9pt
          color: "334155",
        })
      ],
      indent: { left: 288, hanging: 144 },
      spacing: { before: 0, after: 40 }, // margin-bottom: 2px (~40 dxa)
      lineSpacing: { line: 244 } // line-height: 1.22 (~244 dxa)
    }));
  };

  // --- HEADER SECTION ---
  // Full Name
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: (personalInfo.fullName || 'Your Name').toUpperCase(),
        bold: true,
        font: "Arial",
        size: 36, // 18pt
        color: "0F172A",
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 }
  }));

  // Contact line 1
  const email = personalInfo.email || '';
  const phone = personalInfo.phone || '';
  const location = personalInfo.location || '';
  const contactParts = [];
  if (email) contactParts.push(email);
  if (phone) contactParts.push(phone);
  if (location) contactParts.push(location);

  if (contactParts.length > 0) {
    children.push(new Paragraph({
      children: [
        new TextRun({
          text: contactParts.join('   |   '),
          font: "Arial",
          size: 18, // 9pt
          color: "475569",
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 }
    }));
  }

  // Contact line 2 (Links)
  const github = links.github || personalInfo.github || '';
  const linkedin = links.linkedin || personalInfo.linkedin || '';
  const portfolio = links.portfolio || personalInfo.portfolio || '';
  const linkParts = [];
  if (github) linkParts.push(github.replace(/https?:\/\/(www\.)?/, ''));
  if (linkedin) linkParts.push(linkedin.replace(/https?:\/\/(www\.)?/, ''));
  if (portfolio) linkParts.push(portfolio.replace(/https?:\/\/(www\.)?/, ''));

  if (linkParts.length > 0) {
    children.push(new Paragraph({
      children: [
        new TextRun({
          text: linkParts.join('   |   '),
          font: "Arial",
          size: 18, // 9pt
          color: "475569",
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 }
    }));
  }

  // Header separator space
  children.push(new Paragraph({
    spacing: { before: 0, after: 160 } // bottom margin: 8px (~160 dxa)
  }));

  // --- SUMMARY SECTION ---
  if (summary && summary.trim()) {
    addSectionHeader('Professional Summary');
    addParagraph(summary, { fontSize: 19, spaceAfter: 80 });
  }

  // --- EXPERIENCE SECTION ---
  const hasExperience = experience.some(exp => exp.company || exp.role);
  if (hasExperience) {
    addSectionHeader('Professional Experience');
    experience.forEach((exp) => {
      if (!exp.company && !exp.role) return;

      const roleText = exp.role || '';
      const dateText = `${exp.startDate || ''} – ${exp.currentlyWorking ? 'Present' : (exp.endDate || '')}`;
      const companyText = exp.company || '';
      const locationText = exp.location || '';

      addDoubleColumnLine(roleText, dateText, { fontSize: 19, leftBold: true, rightBold: true, spaceAfter: 20 });
      addDoubleColumnLine(companyText, locationText, { fontSize: 18, leftItalic: true, spaceAfter: 60 });

      const bullets = Array.isArray(exp.description)
        ? exp.description
        : (typeof exp.description === 'string' ? exp.description.split('\n').filter(Boolean) : []);

      bullets.forEach((bullet) => {
        addBulletPoint(bullet.replace(/^[•\-\*]\s*/, ''));
      });

      // Experience item spacer
      children.push(new Paragraph({ spacing: { before: 0, after: 120 } })); // 6px spacer
    });
  }

  // --- EDUCATION SECTION ---
  const hasEducation = education.some(edu => edu.institution || edu.degree);
  if (hasEducation) {
    addSectionHeader('Education');
    education.forEach((edu) => {
      if (!edu.institution && !edu.degree) return;

      const degreeText = `${edu.degree || ''}${edu.fieldOfStudy ? ' in ' + edu.fieldOfStudy : ''}`;
      const dateText = `${edu.startDate || ''} – ${edu.currentlyStudying ? 'Present' : (edu.endDate || '')}`;
      const instText = edu.institution || '';
      const gradeText = edu.grade ? `GPA/Score: ${edu.grade}` : '';

      addDoubleColumnLine(degreeText, dateText, { fontSize: 19, leftBold: true, rightBold: true, spaceAfter: 20 });
      if (instText || gradeText) {
        addDoubleColumnLine(instText, gradeText, { fontSize: 18, leftItalic: true, spaceAfter: 60 });
      }

      // Education item spacer
      children.push(new Paragraph({ spacing: { before: 0, after: 120 } })); // 6px spacer
    });
  }

  // --- PROJECTS SECTION ---
  const hasProjects = projects.some(proj => proj.title);
  if (hasProjects) {
    addSectionHeader('Key Projects');
    projects.forEach((proj) => {
      if (!proj.title) return;

      const titleText = proj.title;
      const dateText = proj.startDate ? `${proj.startDate} – ${proj.currentlyWorking ? 'Present' : (proj.endDate || '')}` : '';

      addDoubleColumnLine(titleText, dateText, { fontSize: 19, leftBold: true, rightBold: true, spaceAfter: 20 });

      const bullets = Array.isArray(proj.description)
        ? proj.description
        : (typeof proj.description === 'string' ? proj.description.split('\n').filter(Boolean) : []);

      bullets.forEach((bullet) => {
        addBulletPoint(bullet.replace(/^[•\-\*]\s*/, ''));
      });

      // Project item spacer
      children.push(new Paragraph({ spacing: { before: 0, after: 120 } })); // 6px spacer
    });
  }

  // --- TECHNICAL SKILLS SECTION ---
  const hasSkills = skills.some(s => s && s.trim() !== '');
  if (hasSkills) {
    addSectionHeader('Technical Skills');
    const grouped = groupSkills(skills);
    Object.entries(grouped).forEach(([category, list]) => {
      if (list.length === 0) return;
      const skillText = `${category}: ${list.join(', ')}`;
      addParagraph(skillText, { fontSize: 18, spaceAfter: 60 });
    });
  }

  // --- CERTIFICATIONS SECTION ---
  const hasCertifications = certifications.some(c => c.name);
  if (hasCertifications) {
    addSectionHeader('Certifications');
    certifications.forEach((cert) => {
      if (!cert.name) return;
      const certText = `${cert.name}${cert.issuer ? ' — ' + cert.issuer : ''}`;
      const dateText = cert.date || '';
      addDoubleColumnLine(certText, dateText, { fontSize: 18, spaceAfter: 40 });
    });
  }

  // --- LANGUAGES SECTION ---
  const hasLanguages = languages.some(l => l && l.trim() !== '');
  if (hasLanguages) {
    addSectionHeader('Languages');
    const langText = languages.filter(l => l && l.trim() !== '').join(', ');
    if (langText) {
      addParagraph(langText, { fontSize: 18, spaceAfter: 60 });
    }
  }

  // Generate document A4 layout with margins
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 567, // 10mm margins in dxa
              bottom: 567,
              left: 567,
              right: 567,
            }
          }
        },
        children: children
      }
    ]
  });

  // Pack the document into a blob and download via file-saver
  Packer.toBlob(doc).then((blob) => {
    const exportFilename = personalInfo.fullName 
      ? `${personalInfo.fullName.trim().replace(/\s+/g, '_')}_Resume.docx` 
      : 'Sivaraman_M_Resume.docx';
    saveAs(blob, exportFilename);
  }).catch((err) => {
    console.error('Word export failed:', err);
    alert('Word document export failed.');
  });
};

export default exportResumeDocx;
