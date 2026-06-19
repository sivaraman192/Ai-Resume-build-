// pdfExport.js: High-fidelity print-based PDF export preserving selectable text and word-spacing.
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Fallback to legacy html2canvas/jsPDF export if printing fails or is blocked.
 */
const exportToPDFFallback = async (elementId, filename) => {
  console.warn('Falling back to html2canvas PDF generation...');
  const element = document.getElementById(elementId) || document.getElementById('resume-preview');
  if (!element) {
    console.error(`Preview element not found in DOM`);
    return;
  }

  let originalBoxShadow = '';
  let originalBorder = '';

  try {
    originalBoxShadow = element.style.boxShadow;
    originalBorder = element.style.border;
    element.style.boxShadow = 'none';
    element.style.border = 'none';

    const options = {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId) || clonedDoc.getElementById('resume-preview');
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'unset';
          if (clonedElement.parentElement) {
            clonedElement.parentElement.style.transform = 'none';
            clonedElement.parentElement.style.transformOrigin = 'unset';
          }
        }
      }
    };

    const canvas = await html2canvas(element, options);
    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight * 1.35) {
      const scaleFactor = Math.min(1, pageHeight / imgHeight);
      const finalHeight = imgHeight * scaleFactor;
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, finalHeight);
    } else {
      const scaleFactor = Math.min(1, (pageHeight * 2) / imgHeight);
      const finalHeight = imgHeight * scaleFactor;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, finalHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, -pageHeight, imgWidth, finalHeight);
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Fallback PDF generation failed:', error);
    alert('Failed to generate PDF fallback: ' + error.message);
  } finally {
    if (element) {
      element.style.boxShadow = originalBoxShadow;
      element.style.border = originalBorder;
    }
  }
};

/**
 * Primary High-fidelity PDF export via browser Print dialog.
 * Opens a hidden iframe, copies active document stylesheets, injects A4 print overrides,
 * and calls native window.print() to allow saving as clean, selectable, non-distorted PDF.
 */
export const exportToPDF = (elementId = 'resume-a4-document', filename = 'resume.pdf') => {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId) || document.getElementById('resume-preview');
    if (!element) {
      console.error(`Preview element not found in DOM`);
      alert('Preview element not found. Please make sure the preview is visible.');
      resolve();
      return;
    }

    // Create a hidden print iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';

    // Hook onload to trigger the print sequence when styles and structure are loaded
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          resolve();
        } catch (printError) {
          console.error('Print trigger failed, executing image-based fallback:', printError);
          exportToPDFFallback(elementId, filename).then(resolve);
        } finally {
          // Safe delayed cleanup to avoid breaking the printing process
          setTimeout(() => {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          }, 2000);
        }
      }, 500); // Allow styles, fonts, and inline assets to settle
    };

    // Grab all stylesheet rules to ensure styling transfers perfectly
    let stylesHTML = '';
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => {
      stylesHTML += el.outerHTML;
    });

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename.replace('.pdf', '')}</title>
          ${stylesHTML}
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            
            body {
              margin: 0;
              padding: 0;
              background: white !important;
              color: black !important;
              font-family: Arial, Georgia, "Times New Roman", serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            /* Reset container dimensions for standard A4 printing */
            #resume-preview,
            .resume-preview,
            .resume-page,
            #resume-a4-document,
            .a4-container {
              width: 100% !important;
              max-width: 190mm !important;
              min-height: auto !important;
              margin: 0 auto !important;
              padding: 0 !important;
              background: white !important;
              box-shadow: none !important;
              transform: none !important;
              zoom: 1 !important;
              border: none !important;
            }
            
            /* Prevent word compression, spacing distortion, and letter collisions */
            * {
              letter-spacing: normal !important;
              word-spacing: normal !important;
              text-rendering: geometricPrecision !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }
            
            p, li, span, div {
              white-space: normal;
              line-height: 1.35;
            }
            
            section,
            .resume-section {
              margin-bottom: 12px !important;
              break-inside: avoid !important;
            }
            
            h2, h3,
            .section-title {
              padding-bottom: 4px !important;
              margin-bottom: 5px !important;
              line-height: 1.25 !important;
            }
            
            hr,
            .section-divider {
              margin-top: 3px !important;
              margin-bottom: 9px !important;
            }
            
            li {
              margin-bottom: 3px !important;
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `);
    doc.close();
  });
};

export default exportToPDF;
