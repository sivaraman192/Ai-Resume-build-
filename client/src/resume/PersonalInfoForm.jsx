import React from 'react';
import FormInput from '../components/FormInput.jsx';
import { User, Mail, Phone, MapPin, Github, Linkedin, Globe, Image } from 'lucide-react';

export const PersonalInfoForm = ({ personalInfo, onChange }) => {
  const info = personalInfo || {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    portfolio: '',
    photo: '',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  // Convert uploaded image file to Base64 string
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 1.5MB)
    if (file.size > 1500000) {
      alert('File is too large. Please upload an image under 1.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({ photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onChange({ photo: '' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          Personal Details
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Provide your contact details so hiring managers can reach you.
        </p>
      </div>

      {/* Photo upload section */}
      <div className="flex items-center gap-4 border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
        <div className="relative w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
          {info.photo ? (
            <img src={info.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Image className="w-6 h-6" />
          )}
        </div>
        <div className="flex flex-col gap-1.5 text-left">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Profile Image</span>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-550 px-3 py-1.5 rounded-md transition select-none">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            {info.photo && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-3 py-1.5 rounded-md transition"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          id="fullName"
          placeholder="John Doe"
          value={info.fullName}
          onChange={handleInputChange}
        />

        <FormInput
          label="Email Address"
          id="email"
          type="email"
          placeholder="johndoe@example.com"
          value={info.email}
          onChange={handleInputChange}
        />

        <FormInput
          label="Phone Number"
          id="phone"
          placeholder="+1 (555) 000-0000"
          value={info.phone}
          onChange={handleInputChange}
        />

        <FormInput
          label="Location"
          id="location"
          placeholder="San Francisco, CA"
          value={info.location}
          onChange={handleInputChange}
        />
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-4">
          Professional Links
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="LinkedIn"
            id="linkedin"
            placeholder="https://linkedin.com/in/username"
            value={info.linkedin}
            onChange={handleInputChange}
          />

          <FormInput
            label="GitHub"
            id="github"
            placeholder="https://github.com/username"
            value={info.github}
            onChange={handleInputChange}
          />

          <FormInput
            label="Portfolio Website"
            id="portfolio"
            placeholder="https://yourwebsite.com"
            value={info.portfolio}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
