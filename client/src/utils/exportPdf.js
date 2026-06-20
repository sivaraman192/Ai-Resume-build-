// exportPdf.js: High-fidelity DOM capture PDF generator using html2canvas & jsPDF.
// Employs smart vertical layout pagination for ATS-friendly single-column layouts to prevent broken blocks.
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

  const isAts = selectedTemplate === 'ats';

  if (isAts) {
    // --- SMART DOM PAGINATION FOR ATS SINGLE-COLUMN LAYOUTS ---
    const sandbox = document.createElement('div');
    sandbox.style.position = 'absolute';
    sandbox.style.left = '0';
    sandbox.style.top = '0';
    sandbox.style.width = '794px';
    sandbox.style.zIndex = '-9999';
    sandbox.style.opacity = '0.01';
    sandbox.style.pointerEvents = 'none';
    document.body.appendChild(sandbox);

    const createPageElement = () => {
      const page = document.createElement('div');
      page.className = 'resume-page';
      page.style.width = '794px';
      page.style.height = '1123px';
      page.style.maxHeight = '1123px';
      page.style.overflow = 'hidden';
      page.style.boxSizing = 'border-box';
      page.style.backgroundColor = '#ffffff';
      page.style.position = 'relative';
      page.style.boxShadow = 'none';
      page.style.border = 'none';
      page.style.margin = '0';
      sandbox.appendChild(page);
      return page;
    };

    try {
      // 1. Decompose the resume preview into atomic blocks
      const atomicUnits = [];

      // A. Extract header
      const header = element.querySelector('header');
      if (header) {
        atomicUnits.push({
          type: 'header',
          element: header.cloneNode(true)
        });
      }

      // B. Extract and split sections
      const sections = element.querySelectorAll('.resume-section');
      sections.forEach((section) => {
        const titleEl = section.querySelector('.resume-section-title');
        const contentEl = section.querySelector('.resume-section-content');

        if (!titleEl || !contentEl) {
          // Keep entire section together
          atomicUnits.push({
            type: 'section-atomic',
            element: section.cloneNode(true)
          });
          return;
        }

        const blocks = contentEl.querySelectorAll('.experience-block, .project-block, .education-block');
        if (blocks.length > 0) {
          // Keep Section Title + first content block together to prevent orphan headers
          const firstSection = document.createElement('section');
          firstSection.className = 'resume-section';
          firstSection.appendChild(titleEl.cloneNode(true));

          const firstContent = document.createElement('div');
          firstContent.className = 'resume-section-content';
          firstContent.appendChild(blocks[0].cloneNode(true));
          firstSection.appendChild(firstContent);

          atomicUnits.push({
            type: 'section-start',
            element: firstSection
          });

          // Subsequent experience or project blocks flow as individual atomic units
          for (let i = 1; i < blocks.length; i++) {
            const continuedSection = document.createElement('section');
            continuedSection.className = 'resume-section';
            continuedSection.style.marginTop = '4px';

            const continuedContent = document.createElement('div');
            continuedContent.className = 'resume-section-content';
            continuedContent.appendChild(blocks[i].cloneNode(true));
            continuedSection.appendChild(continuedContent);

            atomicUnits.push({
              type: 'section-block',
              element: continuedSection
            });
          }
        } else {
          // Summary, Skills, Certifications, and Languages are kept atomic as a whole section
          atomicUnits.push({
            type: 'section-atomic',
            element: section.cloneNode(true)
          });
        }
      });

      // 2. Distribute blocks across A4 page containers
      const pageElements = [createPageElement()];
      let currentPage = pageElements[0];

      for (let i = 0; i < atomicUnits.length; i++) {
        const unit = atomicUnits[i];
        currentPage.appendChild(unit.element);

        // If content overflows A4 height boundary (1123px)
        if (currentPage.scrollHeight > 1123) {
          // If this isn't the only element on the page, roll it over to a new page container
          if (currentPage.childNodes.length > 1) {
            currentPage.removeChild(unit.element);
            currentPage = createPageElement();
            currentPage.appendChild(unit.element);
            pageElements.push(currentPage);
          }
        }
      }

      // 3. Render page containers separately into the PDF
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const pageCanvas = await html2canvas(pageElements[i], {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 794,
          windowHeight: 1123
        });

        const pageImg = pageCanvas.toDataURL('image/png');
        pdf.addImage(pageImg, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      // 4. Manually map clickable link annotations
      const scale = pdfWidth / 794;
      for (let i = 0; i < pageElements.length; i++) {
        const pageContainer = pageElements[i];
        const pageRect = pageContainer.getBoundingClientRect();

        const links = pageContainer.querySelectorAll('a[href]');
        links.forEach((linkEl) => {
          const href = linkEl.getAttribute('href');
          if (!href || href.trim() === '' || href.startsWith('#')) return;

          let url = href.trim();
          if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
          }

          const linkRect = linkEl.getBoundingClientRect();
          const linkX = (linkRect.left - pageRect.left) * scale;
          const linkY = (linkRect.top - pageRect.top) * scale;
          const linkWidth = linkRect.width * scale;
          const linkHeight = linkRect.height * scale;

          pdf.setPage(i + 1);
          pdf.link(linkX, linkY, linkWidth, linkHeight, { url });
        });
      }

      const personalInfo = resumeData.personalInfo || {};
      const exportFilename = personalInfo.fullName 
        ? `${personalInfo.fullName.trim().replace(/\s+/g, '_')}_Resume.pdf` 
        : 'Sivaraman_M_Resume.pdf';

      pdf.save(exportFilename);
    } catch (error) {
      console.error('Paginated PDF generation failed:', error);
      alert('Failed to generate PDF fallback: ' + error.message);
    } finally {
      if (sandbox.parentNode) {
        sandbox.parentNode.removeChild(sandbox);
      }
    }
  } else {
    // --- FALLBACK WHOLE-CANVAS CAPTURE FOR DOUBLE-COLUMN LAYOUTS ---
    const originalBoxShadow = element.style.boxShadow;
    const originalBorder = element.style.border;

    try {
      element.style.boxShadow = 'none';
      element.style.border = 'none';

      const options = {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
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

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Add clickable links
      const elementRect = element.getBoundingClientRect();
      const scale = pdfWidth / elementRect.width;

      const links = element.querySelectorAll('a[href]');
      links.forEach((linkEl) => {
        const href = linkEl.getAttribute('href');
        if (!href || href.trim() === '' || href.startsWith('#')) return;

        let url = href.trim();
        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url;
        }

        const linkRect = linkEl.getBoundingClientRect();
        const linkX = (linkRect.left - elementRect.left) * scale;
        const linkY = (linkRect.top - elementRect.top) * scale;
        const linkWidth = linkRect.width * scale;
        const linkHeight = linkRect.height * scale;

        const pageNumber = Math.floor(linkY / pdfHeight) + 1;
        const linkYOnPage = linkY - ((pageNumber - 1) * pdfHeight);

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
      if (element) {
        element.style.boxShadow = originalBoxShadow;
        element.style.border = originalBorder;
      }
    }
  }
};

export default exportResumePdf;
