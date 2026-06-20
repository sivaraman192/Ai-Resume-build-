// exportPdf.js: High-fidelity DOM capture PDF generator using html2canvas & jsPDF.
// Renders the exact ResumePreview element with 100% style, spacing, order, and links.
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * High-fidelity PDF export of the resume preview DOM element.
 * 
 * @param {Object} resumeData The data to populate in the resume.
 * @param {String} selectedTemplate The current selected layout template.
 */
export const exportResumePdf = async (resumeData, selectedTemplate = 'modern') => {
  if (!resumeData) return;

  const elementId = 'resume-a4-document';
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Preview element #${elementId} not found in DOM`);
    alert('Resume preview element not found. Please make sure the preview is visible.');
    return;
  }

  // Backup original styling parameters
  const originalBoxShadow = element.style.boxShadow;
  const originalBorder = element.style.border;

  try {
    // Temporarily clear shadows/borders for clean print image
    element.style.boxShadow = 'none';
    element.style.border = 'none';

    const options = {
      scale: 3, // High resolution scale to prevent blurry text
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      // Explicitly specify layout bounds
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.ownerDocument.defaultView.innerWidth,
      windowHeight: element.ownerDocument.defaultView.innerHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Reset viewport scales and responsive CSS transforms
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'unset';
          clonedElement.style.width = '210mm';
          clonedElement.style.minHeight = '297mm';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.border = 'none';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '0';

          const container = clonedElement.querySelector('.a4-container');
          if (container) {
            container.style.width = '210mm';
            container.style.minHeight = '297mm';
            container.style.boxShadow = 'none';
            container.style.border = 'none';
            container.style.margin = '0 auto';
          }

          // Reset all parents' scales to ensure full size rendering
          let parent = clonedElement.parentElement;
          while (parent) {
            parent.style.transform = 'none';
            parent.style.transformOrigin = 'unset';
            parent = parent.parentElement;
          }
        }
      }
    };

    const canvas = await html2canvas(element, options);
    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    // Standard A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Create A4 PDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate canvas scale height
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Draw first page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Draw subsequent pages if resume height exceeds A4 bounds
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    const personalInfo = resumeData.personalInfo || {};
    const exportFilename = personalInfo.fullName 
      ? `${personalInfo.fullName.trim().replace(/\s+/g, '_')}_Resume.pdf` 
      : 'Sivaraman_M_Resume.pdf';

    pdf.save(exportFilename);
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('Failed to generate PDF document: ' + error.message);
  } finally {
    // Restore layout styles
    if (element) {
      element.style.boxShadow = originalBoxShadow;
      element.style.border = originalBorder;
    }
  }
};

export default exportResumePdf;
