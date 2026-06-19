import React from 'react';
import FormInput from '../components/FormInput.jsx';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

export const EducationForm = ({ education = [], onChange }) => {
  const handleItemChange = (index, field, value) => {
    const updated = education.map((edu, idx) => {
      if (idx === index) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange(updated);
  };

  const handleAddEducation = () => {
    onChange([
      ...education,
      {
        degree: '',
        institution: '',
        location: '',
        startYear: '',
        endYear: '',
        percentage: '',
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    const updated = education.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            Education History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            List your academic qualifications and degrees.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-550 rounded-lg shadow-md transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="border border-dashed border-slate-250 dark:border-slate-800 py-10 rounded-xl text-center text-slate-400 dark:text-slate-500 font-medium text-xs">
          No education details added yet. Click "Add Education" to start.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {education.map((edu, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900/10 flex flex-col gap-4 relative group"
            >
              <button
                type="button"
                onClick={() => handleRemoveEducation(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition"
                title="Remove Education"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="text-xs font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                Education #{index + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Degree / Course"
                  id={`degree-${index}`}
                  placeholder="e.g. B.Tech in Computer Science"
                  value={edu.degree}
                  onChange={(e) => handleItemChange(index, 'degree', e.target.value)}
                />

                <FormInput
                  label="Institution / University"
                  id={`institution-${index}`}
                  placeholder="e.g. Stanford University"
                  value={edu.institution}
                  onChange={(e) => handleItemChange(index, 'institution', e.target.value)}
                />

                <FormInput
                  label="Location"
                  id={`edu-location-${index}`}
                  placeholder="e.g. Stanford, CA"
                  value={edu.location}
                  onChange={(e) => handleItemChange(index, 'location', e.target.value)}
                />

                <FormInput
                  label="GPA / Percentage"
                  id={`percentage-${index}`}
                  placeholder="e.g. 3.8/4.0 or 85%"
                  value={edu.percentage}
                  onChange={(e) => handleItemChange(index, 'percentage', e.target.value)}
                />

                <FormInput
                  label="Start Year"
                  id={`edu-start-${index}`}
                  placeholder="e.g. 2020"
                  value={edu.startYear}
                  onChange={(e) => handleItemChange(index, 'startYear', e.target.value)}
                />

                <FormInput
                  label="End Year / Expected"
                  id={`edu-end-${index}`}
                  placeholder="e.g. 2024"
                  value={edu.endYear}
                  onChange={(e) => handleItemChange(index, 'endYear', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
