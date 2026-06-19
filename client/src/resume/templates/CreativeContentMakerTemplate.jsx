import React from 'react';
import { groupSkills } from '../../utils/groupSkills.js';

export const CreativeContentMakerTemplate = ({ data }) => {
  // Safe fallbacks
  const personalInfo = data?.personalInfo || {};
  const links = data?.links || {};
  const summary = data?.summary || '';
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const experience = data?.experience || [];
  const certifications = data?.certifications || [];
  const languages = data?.languages || [];

  // Contact Details
  const email = personalInfo?.email || '';
  const phone = personalInfo?.phone || '';
  const location = personalInfo?.location || '';
  const github = links?.github || personalInfo?.github || '';
  const linkedin = links?.linkedin || personalInfo?.linkedin || '';
  const portfolio = links?.portfolio || personalInfo?.portfolio || '';
  const fullName = personalInfo?.fullName || '';

  // Helpers to check empty status
  const hasPersonalInfo = fullName || email || phone || location;
  const hasExperience = experience.some(exp => exp.company || exp.role);
  const hasEducation = education.some(edu => edu.institution || edu.degree);
  const hasProjects = projects.some(proj => proj.title);
  const hasCertifications = certifications.some(c => c.name);
  const hasLanguages = languages.some(l => l && l.trim() !== '');
  const hasLinks = github || linkedin || portfolio;

  // Initials generator for top-right circle avatar
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(fullName);

  return (
    <div className="a4-container font-sans bg-white text-slate-900 flex flex-col select-text text-[11px] leading-[1.45]">
      {/* 1. Header Centered/Split Layout */}
      {hasPersonalInfo && (
        <header className="flex justify-between items-center pb-2 mb-3 border-b-2 border-slate-100 text-left">
          <div className="flex flex-col gap-0.5 max-w-[80%]">
            {fullName && (
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-955">
                {fullName}
              </h1>
            )}
            
            {/* Target Role Designation (first experience role as default) */}
            {hasExperience && experience[0]?.role && (
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                {experience[0]?.role}
              </p>
            )}

            {/* Contact details list */}
            {(email || phone || location) && (
              <div className="flex flex-wrap items-center gap-x-2.5 text-[11px] text-slate-500 font-semibold mt-1">
                {email && <span>{email}</span>}
                {email && (phone || location) && <span className="text-slate-300 select-none">•</span>}
                {phone && <span>{phone}</span>}
                {phone && location && <span className="text-slate-300 select-none">•</span>}
                {location && <span>{location}</span>}
              </div>
            )}
          </div>

          {/* Top-Right Circle Initials Avatar */}
          {initials && (
            <div className="w-14 h-14 rounded-full border-2 border-blue-600 bg-blue-50 dark:bg-slate-905 flex items-center justify-center text-blue-600 font-black text-lg shadow-sm shrink-0 select-none">
              {initials}
            </div>
          )}
        </header>
      )}

      {/* 2. Main Two-Column Body Grid */}
      <div className="flex gap-6 w-full text-left">
        {/* Left Column (65% width) */}
        <div className="w-[65%] flex flex-col">
          {/* Professional Summary */}
          {summary && summary.trim() && (
            <section className="mt-[10px] mb-[8px]">
              <h2 className="text-[12px] font-bold uppercase border-b border-blue-200 pb-[2px] mb-[5px] text-blue-600 tracking-wide">
                Professional Summary
              </h2>
              <p className="text-slate-805 leading-[1.45] text-justify text-[11px] whitespace-pre-wrap">
                {summary}
              </p>
            </section>
          )}

          {/* Professional Experience */}
          {hasExperience && (
            <section className="mt-[10px] mb-[8px]">
              <h2 className="text-[12px] font-bold uppercase border-b border-blue-200 pb-[2px] mb-[5px] text-blue-600 tracking-wide">
                Professional Experience
              </h2>
              <div className="flex flex-col">
                {experience.filter(exp => exp.company || exp.role).map((exp, idx) => {
                  const bullets = Array.isArray(exp?.description)
                    ? exp.description
                    : (typeof exp?.description === 'string' ? exp.description.split('\n').filter(Boolean) : []);

                  return (
                    <div key={exp.id || exp._id || idx} className="flex flex-col mb-[10px] last:mb-0">
                      {/* Role and Dates */}
                      <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45]">
                        <span className="font-bold text-slate-955 text-[11px]">{exp?.role}</span>
                        <span className="text-slate-500 font-bold text-[10.5px]">
                          {exp?.startDate} – {exp?.currentlyWorking ? 'Present' : exp?.endDate}
                        </span>
                      </div>
                      {/* Company and Location */}
                      <div className="flex justify-between items-baseline text-[11px] leading-[1.45] mt-0.5">
                        <span className="font-bold text-slate-650 italic">{exp?.company}</span>
                        {exp?.location && <span className="text-slate-550 font-bold">{exp?.location}</span>}
                      </div>
                      {/* Bullets achievements */}
                      {bullets.length > 0 && (
                        <ul className="list-disc pl-[15px] mt-[4px] text-slate-700 space-y-0.5 text-[11px] leading-[1.45]">
                          {bullets.map((bullet, i) => (
                            <li key={i} className="whitespace-pre-wrap select-text">
                              {bullet.replace(/^[•\-\*]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Education */}
          {hasEducation && (
            <section className="mt-[10px] mb-[8px]">
              <h2 className="text-[12px] font-bold uppercase border-b border-blue-200 pb-[2px] mb-[5px] text-blue-600 tracking-wide">
                Education
              </h2>
              <div className="flex flex-col gap-2">
                {education.filter(edu => edu.institution || edu.degree).map((edu, idx) => (
                  <div key={edu.id || edu._id || idx} className="flex flex-col font-sans">
                    {/* Degree and Dates */}
                    <div className="flex justify-between items-baseline text-[11px] leading-[1.45]">
                      <span className="font-bold text-slate-955 text-[11px]">{edu?.degree}</span>
                      <span className="text-slate-500 font-bold text-[10.5px]">{edu?.startYear} – {edu?.endYear}</span>
                    </div>
                    {/* Institution */}
                    <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                      {edu?.institution}
                    </div>
                    {/* Location and Grade */}
                    {(edu?.location || edu?.percentage) && (
                      <div className="flex justify-between items-baseline text-[11px] leading-[1.45] mt-0.5 text-slate-500">
                        <span className="italic">{edu?.location || ''}</span>
                        {edu?.percentage && <span className="font-bold text-slate-700">GPA/Score: {edu?.percentage}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {hasCertifications && (
            <section className="mt-[10px] mb-[8px]">
              <h2 className="text-[12px] font-bold uppercase border-b border-blue-200 pb-[2px] mb-[5px] text-blue-600 tracking-wide">
                Certifications
              </h2>
              <ul className="list-disc pl-[15px] space-y-0.5 text-slate-750 text-[11px] leading-[1.45]">
                {certifications.filter(c => c.name).map((cert, idx) => (
                  <li key={cert.id || cert._id || idx}>
                    <span className="font-bold text-slate-900">{cert?.name}</span> – <span className="italic">{cert?.issuer}</span> ({cert?.date})
                    {cert?.link && (
                      <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-[10.5px] text-blue-500 hover:underline">
                        [Verify]
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {hasLanguages && (
            <section className="mt-[10px] mb-[8px]">
              <h2 className="text-[12px] font-bold uppercase border-b border-blue-200 pb-[2px] mb-[5px] text-blue-600 tracking-wide">
                Languages
              </h2>
              <p className="text-slate-755 text-[11px] leading-[1.45]">
                {languages.filter(l => l && l.trim() !== '').join(', ')}
              </p>
            </section>
          )}
        </div>

        {/* Right Column (35% width) */}
        <div className="w-[35%] flex flex-col border-l border-slate-100 pl-4">
          {/* Technical Skills */}
          {(() => {
            const groupedSkills = groupSkills(skills);
            const hasGroupedSkills = Object.keys(groupedSkills).length > 0;
            if (!hasGroupedSkills) return null;

            return (
              <section className="mt-[10px] mb-[8px]">
                <h2 className="text-[12px] font-bold uppercase border-b border-blue-200 pb-[2px] mb-[5px] text-blue-600 tracking-wide">
                  Technical Skills
                </h2>
                <div className="flex flex-col gap-2 font-sans text-[11px] leading-[1.45]">
                  {Object.entries(groupedSkills).map(([catName, list]) => (
                    <div key={catName}>
                      <span className="font-bold text-slate-900 block">{catName}</span>
                      <span className="text-slate-655 font-medium">{list.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* Key Projects */}
          {hasProjects && (
            <section className="mt-[10px] mb-[8px]">
              <h2 className="text-[12px] font-bold uppercase border-b border-blue-200 pb-[2px] mb-[5px] text-blue-600 tracking-wide">
                Key Projects
              </h2>
              <div className="flex flex-col gap-2.5">
                {projects.filter(proj => proj.title).map((proj, idx) => {
                  const projectBullets = typeof proj.description === 'string'
                    ? proj.description.split('\n').filter(Boolean)
                    : (Array.isArray(proj.description) ? proj.description : []);

                  return (
                    <div key={proj.id || proj._id || idx} className="flex flex-col font-sans text-[11px] leading-[1.45]">
                      {/* Project Title and Links */}
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{proj?.title}</span>
                        <div className="text-[10.5px] text-indigo-650 font-bold flex gap-1.5 font-mono">
                          {proj?.github && (
                            <a href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Git
                            </a>
                          )}
                          {proj?.github && proj?.liveDemo && <span>|</span>}
                          {proj?.liveDemo && (
                            <a href={proj.liveDemo.startsWith('http') ? proj.liveDemo : `https://${proj.liveDemo}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Live
                            </a>
                          )}
                        </div>
                      </div>
                      {/* Tech stack */}
                      {proj?.techStack && (Array.isArray(proj.techStack) ? proj.techStack.length > 0 : proj.techStack.trim().length > 0) && (
                        <span className="text-[10.5px] font-mono text-slate-400 block mt-0.5 leading-[1.45]">
                          {Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack}
                        </span>
                      )}
                      {/* Compact project bullets */}
                      {projectBullets.length > 0 && (
                        <ul className="list-disc pl-[12px] mt-[3px] text-slate-650 space-y-0.5 text-[11px] leading-[1.45]">
                          {projectBullets.map((bullet, i) => (
                            <li key={i} className="whitespace-pre-wrap select-text">
                              {bullet.replace(/^[•\-\*]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Links Section */}
          {hasLinks && (
            <section className="mt-[10px] mb-[8px]">
              <h2 className="text-[12px] font-bold uppercase border-b border-blue-200 pb-[2px] mb-[5px] text-blue-600 tracking-wide">
                Social Links
              </h2>
              <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-600 break-all leading-[1.45]">
                {github && (
                  <div className="flex flex-col">
                    <span className="text-[9.5px] font-black uppercase text-slate-400">GitHub</span>
                    <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                      {github.replace(/https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                )}
                {linkedin && (
                  <div className="flex flex-col mt-1">
                    <span className="text-[9.5px] font-black uppercase text-slate-400">LinkedIn</span>
                    <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                      {linkedin.replace(/https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                )}
                {portfolio && (
                  <div className="flex flex-col mt-1">
                    <span className="text-[9.5px] font-black uppercase text-slate-400">Portfolio</span>
                    <a href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                      {portfolio.replace(/https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeContentMakerTemplate;
