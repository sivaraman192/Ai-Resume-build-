import React, { useState } from 'react';
import FormInput from '../components/FormInput.jsx';
import FormTextarea from '../components/FormTextarea.jsx';
import aiService from '../services/aiService.js';
import { Briefcase, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';

export const ProjectsForm = ({ projects = [], onChange }) => {
  const [improveLoadingIdx, setImproveLoadingIdx] = useState(null);

  const handleItemChange = (index, field, value) => {
    const updated = projects.map((proj, idx) => {
      if (idx === index) {
        if (field === 'techStack') {
          // Parse techStack by splitting commas
          const parsedStack = value.split(',').map((item) => item.trim());
          return { ...proj, techStack: parsedStack };
        }
        return { ...proj, [field]: value };
      }
      return proj;
    });
    onChange(updated);
  };

  const handleAddProject = () => {
    onChange([
      ...projects,
      {
        title: '',
        techStack: [],
        description: '',
        github: '',
        liveDemo: '',
      },
    ]);
  };

  const handleRemoveProject = (index) => {
    const updated = projects.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  // AI Rewrite Project Description
  const handleAIImprove = async (index) => {
    const proj = projects[index];
    if (!proj.description.trim()) {
      alert('Please write a basic description of the project first before improving.');
      return;
    }

    setImproveLoadingIdx(index);
    try {
      const data = await aiService.rewriteProjectDescription(
        proj.title,
        proj.techStack,
        proj.description
      );
      if (data && data.description) {
        handleItemChange(index, 'description', data.description);
      }
    } catch (err) {
      alert(err.message || 'Failed to rewrite description. Please try again.');
    } finally {
      setImproveLoadingIdx(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            Projects
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Showcase your best builds and open source contributions.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-lg shadow-md transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="border border-dashed border-slate-250 dark:border-slate-800 py-10 rounded-xl text-center text-slate-400 dark:text-slate-550 font-medium text-xs">
          No projects added yet. Click "Add Project" to start adding yours.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {projects.map((proj, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900/10 flex flex-col gap-4 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveProject(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition"
                title="Remove Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="text-xs font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                Project #{index + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Project Title"
                  id={`proj-title-${index}`}
                  placeholder="e.g. ResumeForge Builder"
                  value={proj.title}
                  onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                />

                <FormInput
                  label="Tech Stack (comma-separated)"
                  id={`proj-tech-${index}`}
                  placeholder="e.g. React, Node.js, MongoDB"
                  value={proj.techStack ? proj.techStack.join(', ') : ''}
                  onChange={(e) => handleItemChange(index, 'techStack', e.target.value)}
                />

                <FormInput
                  label="GitHub Link"
                  id={`proj-github-${index}`}
                  placeholder="e.g. https://github.com/user/project"
                  value={proj.github}
                  onChange={(e) => handleItemChange(index, 'github', e.target.value)}
                />

                <FormInput
                  label="Live Demo Link"
                  id={`proj-live-${index}`}
                  placeholder="e.g. https://project.com"
                  value={proj.liveDemo}
                  onChange={(e) => handleItemChange(index, 'liveDemo', e.target.value)}
                />
              </div>

              {/* Description + AI rewrite button */}
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Description & Bullet Points
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAIImprove(index)}
                    disabled={improveLoadingIdx === index}
                    className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-750 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50"
                  >
                    {improveLoadingIdx === index ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Improving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Optimize Bullet Points
                      </>
                    )}
                  </button>
                </div>
                <FormTextarea
                  id={`proj-desc-${index}`}
                  placeholder="Enter a brief summary of what you built, what challenges you solved, and what technologies you used."
                  value={proj.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
