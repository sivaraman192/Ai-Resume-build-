import React from 'react';
import { Check } from 'lucide-react';

export const TemplateSelector = ({ activeTemplate = 'modern', onChange }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern Template',
      desc: 'Elegant dual-column layout with a sleek sidebar, ideal for tech developers and designers.',
      badge: 'Popular',
      color: 'from-blue-500 to-indigo-600',
      preview: (
        <div className="w-full h-28 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex p-2 gap-2 overflow-hidden select-none">
          <div className="w-1/3 bg-slate-200 dark:bg-slate-800 rounded flex flex-col gap-1.5 p-1.5">
            <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded"></div>
            <div className="w-4/5 h-1 bg-slate-300 dark:bg-slate-700 rounded"></div>
            <div className="w-3/5 h-1 bg-slate-300 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="w-2/3 flex flex-col gap-2 p-1">
            <div className="w-2/3 h-2 bg-slate-300 dark:bg-slate-700 rounded"></div>
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="w-4/5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      ),
    },
    {
      id: 'ats',
      name: 'ATS Friendly',
      desc: 'Single-column structured layout focusing on text hierarchy. High parser pass-rate for big enterprise applications.',
      badge: 'Recommended',
      color: 'from-slate-700 to-slate-900',
      preview: (
        <div className="w-full h-28 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col p-2 gap-2.5 overflow-hidden select-none">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-2/5 h-2.5 bg-slate-300 dark:bg-slate-700 rounded"></div>
            <div className="w-3/5 h-1 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded"></div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="w-5/6 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded"></div>
            <div className="w-4/5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      ),
    },
    {
      id: 'creative',
      name: 'Creative Template',
      desc: 'Dynamic design layout featuring a top banner, bold highlights, and clean card spacing for marketers and creatives.',
      badge: 'Modern',
      color: 'from-purple-500 to-pink-600',
      preview: (
        <div className="w-full h-28 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col overflow-hidden select-none">
          <div className="w-full h-4 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-between px-2"></div>
          <div className="flex p-2 gap-2 flex-1">
            <div className="w-1/2 flex flex-col gap-2">
              <div className="w-3/4 h-2 bg-slate-300 dark:bg-slate-700 rounded"></div>
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="w-4/5 h-1 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <div className="w-3/4 h-2 bg-slate-300 dark:bg-slate-700 rounded"></div>
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="w-5/6 h-1 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'creative-content-maker',
      name: 'Creative Content Maker',
      desc: 'Two-column creative ATS-friendly resume for developers and content creators.',
      badge: 'Professional',
      color: 'from-blue-500 to-indigo-650',
      preview: (
        <div className="w-full h-28 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex p-2 gap-2 overflow-hidden select-none">
          <div className="w-2/3 flex flex-col gap-2 p-1">
            <div className="w-2/3 h-2 bg-blue-500 rounded"></div>
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="w-4/5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="w-1/3 bg-slate-200 dark:bg-slate-800 rounded flex flex-col gap-1.5 p-1.5">
            <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded"></div>
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      ),
    },
  ];

  const handleSelection = (id) => {
    if (onChange && typeof onChange === 'function') {
      onChange(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map((t) => {
        const isSelected = activeTemplate === t.id;
        return (
          <div
            key={t.id}
            onClick={() => handleSelection(t.id)}
            className={`cursor-pointer rounded-2xl border-2 p-5 bg-white dark:bg-slate-900/40 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300 relative flex flex-col gap-4 ${
              isSelected
                ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/10'
                : 'border-slate-200 dark:border-slate-800/80'
            }`}
          >
            {/* Template Card Top Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                  {t.name}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Select to use
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  {t.badge}
                </span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>

            {/* Layout Mock Preview */}
            {t.preview}

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {t.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TemplateSelector;
