// exportPdf.js: Direct text-based PDF generator using jsPDF to avoid word spacing bugs and print dialogs.
import { jsPDF } from 'jspdf';
import { groupSkills } from './groupSkills.js';

/**
 * Direct download of ATS-friendly PDF with compact spacing.
 * Does not use html2canvas, preserving selectable text and letter/word spacing.
 * 
 * @param {Object} resumeData The data to populate in the resume.
 * @param {String} selectedTemplate The current selected layout template.
 */
export const exportResumePdf = (resumeData, selectedTemplate = 'modern') => {
  if (!resumeData) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const personalInfo = resumeData.personalInfo || {};
  const links = resumeData.links || {};
  const summary = resumeData.summary || '';
  const education = resumeData.education || [];
  const skills = resumeData.skills || [];
  const projects = resumeData.projects || [];
  const experience = resumeData.experience || [];
  const certifications = resumeData.certifications || [];
  const languages = resumeData.languages || [];

  // Determine font family for ATS styling
  const fontFamily = selectedTemplate === 'ats' ? 'Times' : 'Helvetica';

  // Constants
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 40; // ~14mm
  const contentWidth = pageWidth - (marginX * 2);

  let y = 40;

  // Check page boundaries and insert page break if needed
  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 40) {
      doc.addPage();
      y = 40;
      return true;
    }
    return false;
  };

  // Helper to add wrapped text block
  const addWrappedText = (text, options = {}) => {
    const fontSize = options.fontSize || 9.5;
    const isBold = options.isBold || false;
    const isItalic = options.isItalic || false;
    const align = options.align || 'left';
    const lineSpacing = options.lineSpacing || 1.28;
    const marginB = options.marginB !== undefined ? options.marginB : 4;
    const color = options.color || [30, 41, 59];

    let fontStyle = 'normal';
    if (isBold && isItalic) fontStyle = 'bolditalic';
    else if (isBold) fontStyle = 'bold';
    else if (isItalic) fontStyle = 'italic';

    doc.setFont(fontFamily, fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * lineSpacing;
    const totalHeight = lines.length * lineHeight;

    checkPageBreak(totalHeight + marginB);

    lines.forEach((line, index) => {
      let x = marginX;
      if (align === 'center') {
        x = pageWidth / 2;
      } else if (align === 'right') {
        x = pageWidth - marginX;
      }
      doc.text(line, x, y + (index * lineHeight) + fontSize, { align });
    });

    y += totalHeight + marginB;
  };

  // Helper to add two columns (e.g. role left, date right)
  const addDoubleColumnText = (leftText, rightText, options = {}) => {
    const fontSize = options.fontSize || 9.5;
    const leftBold = options.leftBold || false;
    const leftItalic = options.leftItalic || false;
    const rightBold = options.rightBold || false;
    const rightItalic = options.rightItalic || false;
    const marginB = options.marginB !== undefined ? options.marginB : 4;

    const lineHeight = fontSize * 1.25;
    checkPageBreak(lineHeight + marginB);

    // Left block
    let leftStyle = 'normal';
    if (leftBold && leftItalic) leftStyle = 'bolditalic';
    else if (leftBold) leftStyle = 'bold';
    else if (leftItalic) leftStyle = 'italic';

    doc.setFont(fontFamily, leftStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(15, 23, 42);
    doc.text(leftText, marginX, y + fontSize);

    // Right block
    let rightStyle = 'normal';
    if (rightBold && rightItalic) rightStyle = 'bolditalic';
    else if (rightBold) rightStyle = 'bold';
    else if (rightItalic) rightStyle = 'italic';

    doc.setFont(fontFamily, rightStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(71, 85, 105);
    doc.text(rightText, pageWidth - marginX, y + fontSize, { align: 'right' });

    y += lineHeight + marginB;
  };

  // Helper to add custom formatted bullet points
  const addBulletPoint = (text, options = {}) => {
    const fontSize = options.fontSize || 9;
    const lineSpacing = options.lineSpacing || 1.22;
    const marginB = options.marginB !== undefined ? options.marginB : 2;
    const indent = 15;
    const bulletSize = 5;

    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(51, 65, 85);

    const bulletChar = '•';
    const bulletContentWidth = contentWidth - indent;
    const lines = doc.splitTextToSize(text, bulletContentWidth);
    const lineHeight = fontSize * lineSpacing;
    const totalHeight = lines.length * lineHeight;

    checkPageBreak(totalHeight + marginB);

    doc.text(bulletChar, marginX + bulletSize, y + fontSize);

    lines.forEach((line, index) => {
      doc.text(line, marginX + indent, y + (index * lineHeight) + fontSize);
    });

    y += totalHeight + marginB;
  };

  // Helper to render section headings
  const addSectionHeader = (title) => {
    // Spacing fix: Section heading: font-size 11, margin-top 8px, margin-bottom 4px. Divider margin-bottom 5px
    y += 8;

    checkPageBreak(12 + 4 + 2 + 5);

    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), marginX, y + 11);

    y += 11 + 4;

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(1);
    doc.line(marginX, y, pageWidth - marginX, y);

    y += 5;
  };

  // --- HEADER DRAWING ---
  // Name
  doc.setFont(fontFamily, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  const fullName = personalInfo.fullName || 'Your Name';
  doc.text(fullName.toUpperCase(), pageWidth / 2, y + 18, { align: 'center' });
  y += 18 + 4;

  // Contact line items
  const email = personalInfo.email || '';
  const phone = personalInfo.phone || '';
  const location = personalInfo.location || '';

  const contactParts = [];
  if (email) contactParts.push(email);
  if (phone) contactParts.push(phone);
  if (location) contactParts.push(location);

  const github = links.github || personalInfo.github || '';
  const linkedin = links.linkedin || personalInfo.linkedin || '';
  const portfolio = links.portfolio || personalInfo.portfolio || '';

  const linkParts = [];
  if (github) linkParts.push(github.replace(/https?:\/\/(www\.)?/, ''));
  if (linkedin) linkParts.push(linkedin.replace(/https?:\/\/(www\.)?/, ''));
  if (portfolio) linkParts.push(portfolio.replace(/https?:\/\/(www\.)?/, ''));

  // Line 1: Contact
  if (contactParts.length > 0) {
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const contactText = contactParts.join('   |   ');
    doc.text(contactText, pageWidth / 2, y + 9, { align: 'center' });
    y += 9 + 3;
  }

  // Line 2: Links
  if (linkParts.length > 0) {
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const linksText = linkParts.join('   |   ');
    doc.text(linksText, pageWidth / 2, y + 9, { align: 'center' });
    y += 9 + 3;
  }

  y += 8; // Header bottom margin: 8px

  // --- SUMMARY ---
  if (summary && summary.trim()) {
    addSectionHeader('Professional Summary');
    addWrappedText(summary, { fontSize: 9.5, lineSpacing: 1.28, marginB: 4 });
  }

  // --- EXPERIENCE ---
  const hasExperience = experience.some(exp => exp.company || exp.role);
  if (hasExperience) {
    addSectionHeader('Professional Experience');
    experience.forEach((exp) => {
      if (!exp.company && !exp.role) return;

      const roleText = exp.role || '';
      const dateText = `${exp.startDate || ''} – ${exp.currentlyWorking ? 'Present' : (exp.endDate || '')}`;
      const companyText = exp.company || '';
      const locationText = exp.location || '';

      addDoubleColumnText(roleText, dateText, { fontSize: 9.5, leftBold: true, rightBold: true, marginB: 1 });
      addDoubleColumnText(companyText, locationText, { fontSize: 9, leftItalic: true, marginB: 3 });

      const bullets = Array.isArray(exp.description)
        ? exp.description
        : (typeof exp.description === 'string' ? exp.description.split('\n').filter(Boolean) : []);

      bullets.forEach((bullet) => {
        const cleanBullet = bullet.replace(/^[•\-\*]\s*/, '');
        addBulletPoint(cleanBullet, { fontSize: 9, lineSpacing: 1.22, marginB: 2 });
      });

      y += 6; // Experience item margin-bottom: 6px
    });
  }

  // --- EDUCATION ---
  const hasEducation = education.some(edu => edu.institution || edu.degree);
  if (hasEducation) {
    addSectionHeader('Education');
    education.forEach((edu) => {
      if (!edu.institution && !edu.degree) return;

      const degreeText = `${edu.degree || ''}${edu.fieldOfStudy ? ' in ' + edu.fieldOfStudy : ''}`;
      const dateText = `${edu.startDate || ''} – ${edu.currentlyStudying ? 'Present' : (edu.endDate || '')}`;
      const instText = edu.institution || '';
      const gradeText = edu.grade ? `GPA/Score: ${edu.grade}` : '';

      addDoubleColumnText(degreeText, dateText, { fontSize: 9.5, leftBold: true, rightBold: true, marginB: 1 });
      if (instText || gradeText) {
        addDoubleColumnText(instText, gradeText, { fontSize: 9, leftItalic: true, marginB: 3 });
      }

      y += 6; // Education item margin-bottom: 6px
    });
  }

  // --- PROJECTS ---
  const hasProjects = projects.some(proj => proj.title);
  if (hasProjects) {
    addSectionHeader('Key Projects');
    projects.forEach((proj) => {
      if (!proj.title) return;

      const titleText = proj.title;
      const dateText = proj.startDate ? `${proj.startDate} – ${proj.currentlyWorking ? 'Present' : (proj.endDate || '')}` : '';

      addDoubleColumnText(titleText, dateText, { fontSize: 9.5, leftBold: true, rightBold: true, marginB: 1 });

      const bullets = Array.isArray(proj.description)
        ? proj.description
        : (typeof proj.description === 'string' ? proj.description.split('\n').filter(Boolean) : []);

      bullets.forEach((bullet) => {
        const cleanBullet = bullet.replace(/^[•\-\*]\s*/, '');
        addBulletPoint(cleanBullet, { fontSize: 9, lineSpacing: 1.22, marginB: 2 });
      });

      y += 6; // Project item margin-bottom: 6px
    });
  }

  // --- SKILLS ---
  const hasSkills = skills.some(s => s && s.trim() !== '');
  if (hasSkills) {
    addSectionHeader('Technical Skills');
    const grouped = groupSkills(skills);
    Object.entries(grouped).forEach(([category, list]) => {
      if (list.length === 0) return;
      const skillLine = `${category}: ${list.join(', ')}`;
      addWrappedText(skillLine, { fontSize: 9, lineSpacing: 1.25, marginB: 3 });
    });
  }

  // --- CERTIFICATIONS ---
  const hasCertifications = certifications.some(c => c.name);
  if (hasCertifications) {
    addSectionHeader('Certifications');
    certifications.forEach((cert) => {
      if (!cert.name) return;
      const certText = `${cert.name}${cert.issuer ? ' — ' + cert.issuer : ''}`;
      const dateText = cert.date || '';
      addDoubleColumnText(certText, dateText, { fontSize: 9, leftBold: false, marginB: 2 });
    });
  }

  // --- LANGUAGES ---
  const hasLanguages = languages.some(l => l && l.trim() !== '');
  if (hasLanguages) {
    addSectionHeader('Languages');
    const langText = languages.filter(l => l && l.trim() !== '').join(', ');
    if (langText) {
      addWrappedText(langText, { fontSize: 9, lineSpacing: 1.25, marginB: 3 });
    }
  }

  // Use correct name formatting requested
  const exportFilename = personalInfo.fullName 
    ? `${personalInfo.fullName.trim().replace(/\s+/g, '_')}_Resume.pdf` 
    : 'Sivaraman_M_Resume.pdf';

  doc.save(exportFilename);
};

export default exportResumePdf;
