import React from 'react';
import FormInput from '../components/FormInput.jsx';
import { Award, Plus, Trash2, Globe2 } from 'lucide-react';

export const CertificationsForm = ({
  certifications = [],
  languages = [],
  onCertChange,
  onLangChange,
}) => {
  const handleCertItemChange = (index, field, value) => {
    const updated = certifications.map((cert, idx) => {
      if (idx === index) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    onCertChange(updated);
  };

  const handleAddCert = () => {
    onCertChange([
      ...certifications,
      {
        name: '',
        issuer: '',
        date: '',
        link: '',
      },
    ]);
  };

  const handleRemoveCert = (index) => {
    const updated = certifications.filter((_, idx) => idx !== index);
    onCertChange(updated);
  };

  const handleLanguagesTextChange = (e) => {
    const value = e.target.value;
    const parsedLangs = value.split(',').map((item) => item.trim());
    onLangChange(parsedLangs);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Certifications header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Certifications & Licenses
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Include courses, credentials, or licenses you possess.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCert}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-lg shadow-md transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="border border-dashed border-slate-250 dark:border-slate-800 py-10 rounded-xl text-center text-slate-400 dark:text-slate-550 font-medium text-xs">
          No certifications added yet. Click "Add Certification" to start.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900/10 flex flex-col gap-4 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveCert(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition"
                title="Remove Certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="text-xs font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                Certification #{index + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Certification Name"
                  id={`cert-name-${index}`}
                  placeholder="e.g. AWS Certified Developer"
                  value={cert.name}
                  onChange={(e) => handleCertItemChange(index, 'name', e.target.value)}
                />

                <FormInput
                  label="Issuing Organization"
                  id={`cert-issuer-${index}`}
                  placeholder="e.g. Amazon Web Services"
                  value={cert.issuer}
                  onChange={(e) => handleCertItemChange(index, 'issuer', e.target.value)}
                />

                <FormInput
                  label="Issue Date"
                  id={`cert-date-${index}`}
                  placeholder="e.g. June 2024"
                  value={cert.date}
                  onChange={(e) => handleCertItemChange(index, 'date', e.target.value)}
                />

                <FormInput
                  label="Credential Link (optional)"
                  id={`cert-link-${index}`}
                  placeholder="e.g. https://aws.amazon.com/verify/..."
                  value={cert.link}
                  onChange={(e) => handleCertItemChange(index, 'link', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages subsection */}
      <div className="border-t border-slate-150 dark:border-slate-800/80 pt-6 mt-4">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-indigo-500" />
              Languages Known
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add languages you speak (comma-separated list).
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              placeholder="e.g. English (Fluent), Spanish (Conversational)"
              value={languages ? languages.join(', ') : ''}
              onChange={handleLanguagesTextChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationsForm;
