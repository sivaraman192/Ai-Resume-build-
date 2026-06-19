import React from 'react';
import FormInput from '../components/FormInput.jsx';
import FormTextarea from '../components/FormTextarea.jsx';
import { Landmark, Plus, Trash2 } from 'lucide-react';

export const ExperienceForm = ({ experience = [], onChange }) => {
  const handleItemChange = (index, field, value) => {
    const updated = experience.map((exp, idx) => {
      if (idx === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updated);
  };

  const handleAddExperience = () => {
    onChange([
      ...experience,
      {
        company: '',
        role: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const handleRemoveExperience = (index) => {
    const updated = experience.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-500" />
            Professional Experience / Internship
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detail your past employment, roles, and accomplishments.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-lg shadow-md transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="border border-dashed border-slate-250 dark:border-slate-800 py-10 rounded-xl text-center text-slate-400 dark:text-slate-550 font-medium text-xs">
          No experience records added yet. Click "Add Experience" to start.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900/10 flex flex-col gap-4 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveExperience(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition"
                title="Remove Experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="text-xs font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                Experience #{index + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Company Name"
                  id={`exp-company-${index}`}
                  placeholder="e.g. Google or Freelance"
                  value={exp.company}
                  onChange={(e) => handleItemChange(index, 'company', e.target.value)}
                />

                <FormInput
                  label="Your Role / Designation"
                  id={`exp-role-${index}`}
                  placeholder="e.g. Junior Web Developer"
                  value={exp.role}
                  onChange={(e) => handleItemChange(index, 'role', e.target.value)}
                />

                <FormInput
                  label="Job Location"
                  id={`exp-loc-${index}`}
                  placeholder="e.g. New York, NY or Remote"
                  value={exp.location}
                  onChange={(e) => handleItemChange(index, 'location', e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    label="Start Date"
                    id={`exp-start-${index}`}
                    placeholder="MM/YYYY"
                    value={exp.startDate}
                    onChange={(e) => handleItemChange(index, 'startDate', e.target.value)}
                  />
                  <FormInput
                    label="End Date"
                    id={`exp-end-${index}`}
                    placeholder="MM/YYYY or Present"
                    value={exp.endDate}
                    onChange={(e) => handleItemChange(index, 'endDate', e.target.value)}
                  />
                </div>
              </div>

              <FormTextarea
                label="Role Description / Achievements (prefer bullet points)"
                id={`exp-desc-${index}`}
                placeholder="• Developed front-end layouts.&#10;• Collaborated in a scrum team.&#10;• Optimized page performance."
                value={exp.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                rows={3}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
