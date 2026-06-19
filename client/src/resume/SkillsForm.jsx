import React, { useState } from 'react';
import FormInput from '../components/FormInput.jsx';
import aiService from '../services/aiService.js';
import { Sparkles, Hammer, Plus, Trash2, Tag, Loader2 } from 'lucide-react';

export const SkillsForm = ({ skills = [], role = '', onChange }) => {
  const [aiLoading, setAiLoading] = useState(false);

  const handleCategoryChange = (index, value) => {
    const updated = skills.map((s, idx) => {
      if (idx === index) {
        return { ...s, category: value };
      }
      return s;
    });
    onChange(updated);
  };

  const handleSkillsTextChange = (index, value) => {
    // Split input string by comma and trim values
    const items = value.split(',').map((item) => item.trim());
    const updated = skills.map((s, idx) => {
      if (idx === index) {
        return { ...s, items };
      }
      return s;
    });
    onChange(updated);
  };

  const handleAddCategory = () => {
    onChange([...skills, { category: '', items: [] }]);
  };

  const handleRemoveCategory = (index) => {
    const updated = skills.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  // Triggers AI skills recommendations
  const handleAISuggestions = async () => {
    const targetRole = role || prompt('What role are you targeting? (e.g. Frontend Developer, Data Analyst)');
    if (!targetRole) return;

    setAiLoading(true);
    try {
      const data = await aiService.suggestSkills(targetRole);
      if (data && data.skills) {
        // Merge AI suggested categories or overwrite
        onChange(data.skills);
      }
    } catch (err) {
      alert(err.message || 'Failed to suggest skills. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans flex items-center gap-2">
            <Hammer className="w-5 h-5 text-indigo-500" />
            Technical & Professional Skills
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Group your expertise by categories (e.g. Languages, Frameworks).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAISuggestions}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-violet-650 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition"
          >
            {aiLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            AI Suggest
          </button>
          <button
            type="button"
            onClick={handleAddCategory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Category
          </button>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="border border-dashed border-slate-250 dark:border-slate-800 py-10 rounded-xl text-center text-slate-400 dark:text-slate-550 font-medium text-xs">
          No skills groups added yet. Click "Add Category" or try "AI Suggest" for ideas.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900/10 flex flex-col gap-4 relative group"
            >
              <button
                type="button"
                onClick={() => handleRemoveCategory(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition"
                title="Remove Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pr-8">
                {/* Category name */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Category Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Languages or Frameworks"
                    value={skill.category || ''}
                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Skills list input */}
                <div className="md:col-span-2 flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Skill Items (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Vue, Svelte"
                    value={skill.items ? skill.items.join(', ') : ''}
                    onChange={(e) => handleSkillsTextChange(index, e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Rendering nice visual chips below */}
              {skill.items && skill.items.some((i) => i.trim() !== '') && (
                <div className="flex flex-wrap gap-1.5 mt-1 border-t border-slate-50 dark:border-slate-850/60 pt-3">
                  {skill.items
                    .filter((item) => item.trim() !== '')
                    .map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold"
                      >
                        <Tag className="w-3 h-3" />
                        {item}
                      </span>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
