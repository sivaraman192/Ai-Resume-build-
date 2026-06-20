// exportPdf.js: High-fidelity DOM capture PDF generator using html2canvas & jsPDF with clickable link annotation fallback.
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
      scale: 3, // High quality scale
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Reset viewport scales and responsive CSS transforms
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'unset';
          clonedElement.style.width = '794px';
          clonedElement.style.minHeight = '1123px';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.border = 'none';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '0';

          const container = clonedElement.querySelector('.resume-page') || clonedElement.querySelector('.a4-container');
          if (container) {
            container.style.width = '794px';
            container.style.minHeight = '1123px';
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
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'pt', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Draw first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Draw subsequent pages if resume height exceeds A4 bounds
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // --- Clickable Links Fix ---
    // Calculate scale factor from browser pixel coordinates to PDF point coordinates
    const elementRect = element.getBoundingClientRect();
    const scale = pdfWidth / elementRect.width;

    // Query all anchors inside the element
    const links = element.querySelectorAll('a[href]');
    links.forEach((linkEl) => {
      const href = linkEl.getAttribute('href');
      if (!href || href.trim() === '' || href.startsWith('#')) return;

      // Auto-prefix https:// if URL does not start with http
      let url = href.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }

      const linkRect = linkEl.getBoundingClientRect();
      const linkX = (linkRect.left - elementRect.left) * scale;
      const linkY = (linkRect.top - elementRect.top) * scale;
      const linkWidth = linkRect.width * scale;
      const linkHeight = linkRect.height * scale;

      // Find which page this link lands on
      const pageNumber = Math.floor(linkY / pdfHeight) + 1;
      const linkYOnPage = linkY - ((pageNumber - 1) * pdfHeight);

      // Add clickable annotation to corresponding page if it exists
      const totalPages = pdf.internal.getNumberOfPages();
      if (pageNumber <= totalPages) {
        pdf.setPage(pageNumber);
        pdf.link(linkX, linkYOnPage, linkWidth, linkHeight, { url });
      }
    });

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
