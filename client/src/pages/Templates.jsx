import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FileText, ArrowRight } from 'lucide-react';

export const Templates = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const templatesList = [
    {
      id: 'modern',
      name: 'Modern Developer Layout',
      desc: 'Top choice for Software Engineers, Product Managers, and UX designers. Features a clean sidebar structure highlighting key contact nodes, skills lists, and languages in a dual-column layout.',
      badge: 'Popular',
      color: 'indigo',
    },
    {
      id: 'ats',
      name: 'Corporate ATS Compliant',
      desc: 'Highly structured single-column text formatting. Eliminates parser failure risks by avoiding complex columns or image overlaps. Perfect for corporate applications in finance, law, or engineering.',
      badge: 'Recommended',
      color: 'slate',
    },
    {
      id: 'creative',
      name: 'Creative Banner Layout',
      desc: 'Features a colorful top banner, distinct section spacers, and project cards. Ideal for social media managers, copywriters, marketers, and startup hires.',
      badge: 'New Layout',
      color: 'purple',
    },
    {
      id: 'creative-content-maker',
      name: 'Creative Content Maker',
      desc: 'Two-column creative ATS-friendly resume for developers and content creators.',
      badge: 'Professional',
      color: 'blue',
    },
  ];

  const handleUseTemplate = (templateId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Save chosen template
      localStorage.setItem('selectedTemplate', templateId);
      // Navigate to builder
      navigate(`/builder?template=${templateId}`);
    } catch (err) {
      console.error('Failed to select template:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans">
          Choose Your Starting Layout
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 font-medium">
          Select from our list of recruiter-approved layouts. All templates support AI generation and instantly export to high-fidelity PDF.
        </p>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {templatesList.map((t) => (
          <div
            key={t.id}
            onClick={() => handleUseTemplate(t.id)}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40 p-6 flex flex-col justify-between hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 min-h-[360px] cursor-pointer"
          >
            <div>
              {/* Visual Card simulation placeholder */}
              <div className="w-full h-44 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 flex items-center justify-center text-slate-450 dark:text-slate-550 text-xs font-bold font-sans uppercase relative overflow-hidden select-none mb-6">
                {/* Accent design strip based on template color */}
                <div
                  className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${
                    t.color === 'indigo'
                      ? 'from-blue-500 to-indigo-650'
                      : t.color === 'slate'
                      ? 'from-slate-600 to-slate-800'
                      : 'from-purple-500 to-pink-500'
                  }`}
                ></div>
                <div className="flex flex-col items-center gap-1">
                  <FileText className="w-8 h-8 text-slate-350 dark:text-slate-700" />
                  <span>{t.id} Layout Preview</span>
                </div>
              </div>

              {/* Title & Badge */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-lg text-slate-808 dark:text-white leading-tight">
                  {t.name}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 rounded shrink-0">
                  {t.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                {t.desc}
              </p>
            </div>

            {/* Action */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleUseTemplate(t.id);
              }}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer shadow-md"
            >
              Use This Template
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
