import React from 'react';
// ResumePreview.jsx: Handles forwarding of education location, score, and experience spacing to child layouts.
import ModernTemplate from './templates/ModernTemplate.jsx';
import ATSTemplate from './templates/ATSTemplate.jsx';
import CreativeTemplate from './templates/CreativeTemplate.jsx';
import CreativeContentMakerTemplate from './templates/CreativeContentMakerTemplate.jsx';

export const ResumePreview = ({ resumeData }) => {
  if (!resumeData) {
    return (
      <div className="a4-container flex items-center justify-center p-8 bg-white border border-slate-200 rounded-lg">
        <div className="text-center">
          <p className="text-slate-400 font-semibold text-sm">No resume data available to preview</p>
          <span className="text-xs text-slate-300">Fill in some fields to start generating</span>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    try {
      const templateName = resumeData?.template || 'modern';
      
      switch (templateName) {
        case 'ats':
          return <ATSTemplate data={resumeData} />;
        case 'creative':
          return <CreativeTemplate data={resumeData} />;
        case 'creative-content-maker':
          return <CreativeContentMakerTemplate data={resumeData} />;
        case 'modern':
        default:
          return <ModernTemplate data={resumeData} />;
      }
    } catch (error) {
      console.error('Error rendering template layout:', error);
      return (
        <div className="a4-container flex flex-col items-center justify-center p-8 text-rose-600 bg-rose-50 border border-rose-200 rounded-lg select-text font-mono">
          <h3 className="font-extrabold text-sm uppercase tracking-wide">Layout Render Error</h3>
          <p className="text-[11px] mt-2 text-center max-w-sm leading-relaxed">
            {error?.message || 'An error occurred during template formatting.'}
          </p>
          <span className="text-[10px] text-slate-400 mt-4">
            Try correcting template fields or switching layout style.
          </span>
        </div>
      );
    }
  };

  return (
    <div className="resume-preview-scale-wrapper select-none">
      {/* Outer container ID to easily target for html2canvas conversion */}
      <div id="resume-a4-document" className="origin-top shadow-xl">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;
