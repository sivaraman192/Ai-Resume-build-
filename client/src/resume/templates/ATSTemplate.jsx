import React from 'react';
import { groupSkills } from '../../utils/groupSkills.js';

export const ATSTemplate = ({ data }) => {
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

  // Contact details
  const email = personalInfo?.email || '';
  const phone = personalInfo?.phone || '';
  const location = personalInfo?.location || '';
  const github = links?.github || personalInfo?.github || '';
  const linkedin = links?.linkedin || personalInfo?.linkedin || '';
  const portfolio = links?.portfolio || personalInfo?.portfolio || '';
  const fullName = personalInfo?.fullName || '';

  // Has-section checks
  const hasPersonalInfo = fullName || email || phone || location;
  const hasExperience = experience.some(exp => exp.company || exp.role);
  const hasEducation = education.some(edu => edu.institution || edu.degree);
  const hasProjects = projects.some(proj => proj.title);
  const hasCertifications = certifications.some(c => c.name);
  const hasLanguages = languages.some(l => l && l.trim() !== '');

  return (
    <div className="a4-container font-serif bg-white text-slate-900 flex flex-col select-text text-xs leading-[1.45]">
      {/* 1. Header Centered Layout */}
      {hasPersonalInfo && (
        <header className="text-center flex flex-col gap-0.5 pb-1 mb-2 border-b-2 border-slate-300">
          {fullName && (
            <h1 className="text-xl font-bold uppercase tracking-wide text-black mb-0.5">
              {fullName}
            </h1>
          )}
          
          {/* Row 1: Email | Phone | Location */}
          {(email || phone || location) && (
            <div className="flex flex-wrap justify-center items-center gap-x-2 text-[11px] text-slate-700 font-sans">
              {email && <span>{email}</span>}
              {email && (phone || location) && <span className="text-slate-350 select-none">|</span>}
              {phone && <span>{phone}</span>}
              {phone && location && <span className="text-slate-350 select-none">|</span>}
              {location && <span>{location}</span>}
            </div>
          )}

          {/* Row 2: GitHub | LinkedIn | Portfolio */}
          {(github || linkedin || portfolio) && (
            <div className="flex flex-wrap justify-center items-center gap-x-2 text-[11px] text-slate-700 font-sans">
              {github && (
                <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {github.replace(/https?:\/\/(www\.)?/, '')}
                </a>
              )}
              {github && (linkedin || portfolio) && <span className="text-slate-350 select-none">|</span>}
              {linkedin && (
                <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {linkedin.replace(/https?:\/\/(www\.)?/, '')}
                </a>
              )}
              {linkedin && portfolio && <span className="text-slate-350 select-none">|</span>}
              {portfolio && (
                <a href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {portfolio.replace(/https?:\/\/(www\.)?/, '')}
                </a>
              )}
            </div>
          )}
        </header>
      )}

      {/* 2. Professional Summary */}
      {summary && summary.trim() && (
        <section className="mt-[10px] mb-[8px]">
          <h2 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide text-left">
            Professional Summary
          </h2>
          <p className="text-slate-800 leading-[1.45] font-sans text-justify text-[11px] whitespace-pre-wrap">
            {summary}
          </p>
        </section>
      )}

      {/* 3. Professional Experience */}
      {hasExperience && (
        <section className="mt-[10px] mb-[8px]">
          <h2 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide text-left">
            Professional Experience
          </h2>
          <div className="flex flex-col">
            {experience.filter(exp => exp.company || exp.role).map((exp, idx) => {
              const bullets = Array.isArray(exp?.description)
                ? exp.description
                : (typeof exp?.description === 'string' ? exp.description.split('\n').filter(Boolean) : []);

              return (
                <div key={exp.id || exp._id || idx} className="flex flex-col mb-[10px] last:mb-0">
                  {/* Left: Role | Right: Date */}
                  <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45]">
                    <span className="font-bold text-black text-[11px] font-serif">{exp?.role}</span>
                    <span className="text-slate-700 font-semibold">
                      {exp?.startDate} – {exp?.currentlyWorking ? 'Present' : exp?.endDate}
                    </span>
                  </div>
                  {/* Left: Company | Right: Location */}
                  <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45] mt-0.5">
                    <span className="font-bold text-slate-800 italic">{exp?.company}</span>
                    {exp?.location && <span className="text-slate-655 font-semibold">{exp?.location}</span>}
                  </div>
                  {/* Bullet achievements list */}
                  {bullets.length > 0 && (
                    <ul className="list-disc pl-[16px] mt-[4px] text-slate-800 text-[11px] font-sans leading-[1.45]">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="whitespace-pre-wrap select-text mb-[2px] last:mb-0">
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

      {/* 4. Projects */}
      {hasProjects && (
        <section className="mt-[10px] mb-[8px]">
          <h2 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide text-left">
            Key Projects
          </h2>
          <div className="flex flex-col">
            {projects.filter(proj => proj.title).map((proj, idx) => {
              const projectBullets = typeof proj.description === 'string'
                ? proj.description.split('\n').filter(Boolean)
                : (Array.isArray(proj.description) ? proj.description : []);

              return (
                <div key={proj.id || proj._id || idx} className="flex flex-col mb-[8px] last:mb-0">
                  {/* Title left, links right */}
                  <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45]">
                    <span className="font-bold text-black text-[11px] font-serif">{proj?.title}</span>
                    <div className="text-[11px] text-slate-655 flex gap-2 font-sans">
                      {proj?.github && (
                        <a href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-slate-700">
                          GitHub
                        </a>
                      )}
                      {proj?.github && proj?.liveDemo && <span className="text-slate-300">|</span>}
                      {proj?.liveDemo && (
                        <a href={proj.liveDemo.startsWith('http') ? proj.liveDemo : `https://${proj.liveDemo}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-slate-700">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Tech stack below title */}
                  {proj?.techStack && (Array.isArray(proj.techStack) ? proj.techStack.length > 0 : proj.techStack.trim().length > 0) && (
                    <div className="text-[10.5px] font-mono text-slate-500 font-semibold mt-[1px] text-left leading-[1.45]">
                      Tech Stack: {Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack}
                    </div>
                  )}
                  {/* Description bullets compact */}
                  {projectBullets.length > 0 && (
                    <ul className="list-disc pl-[15px] mt-[3px] text-slate-800 space-y-0.5 text-[11px] font-sans leading-[1.45]">
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

      {/* 5. Education */}
      {hasEducation && (
        <section className="mt-[10px] mb-[8px]">
          <h2 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide text-left">
            Education
          </h2>
          <div className="flex flex-col gap-2">
            {education.filter(edu => edu.institution || edu.degree).map((edu, idx) => (
              <div key={edu.id || edu._id || idx} className="flex flex-col">
                {/* Left: Degree | Right: Year */}
                <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45]">
                  <span className="font-bold text-black text-[11px] font-serif">{edu?.degree}</span>
                  <span className="text-slate-700 font-semibold">{edu?.startYear} – {edu?.endYear}</span>
                </div>
                {/* Left: Institution */}
                <div className="font-sans text-[11px] text-slate-850 font-bold text-left mt-0.5">
                  {edu?.institution}
                </div>
                {/* Left: Location | Right: Score */}
                {(edu?.location || edu?.percentage) && (
                  <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45] mt-0.5">
                    <span className="text-slate-605 italic">{edu?.location || ''}</span>
                    {edu?.percentage && <span className="font-bold text-slate-800">CGPA/Percentage: {edu?.percentage}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Technical Skills */}
      {(() => {
        const groupedSkills = groupSkills(skills);
        const hasGroupedSkills = Object.keys(groupedSkills).length > 0;
        if (!hasGroupedSkills) return null;

        return (
          <section className="mt-[10px] mb-[8px]">
            <h2 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide text-left">
              Technical Skills
            </h2>
            <div className="flex flex-col gap-1 font-sans text-[11px] leading-[1.45] text-left">
              {Object.entries(groupedSkills).map(([catName, list]) => (
                <div key={catName} className="select-all">
                  <span className="font-bold text-slate-900">{catName}: </span>
                  <span className="text-slate-850 font-normal">{list.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* 7. Certifications */}
      {hasCertifications && (
        <section className="mt-[10px] mb-[8px]">
          <h2 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide text-left">
            Certifications
          </h2>
          <ul className="list-disc pl-[15px] mt-[3px] text-slate-800 space-y-0.5 font-sans text-[11px] leading-[1.45] text-left">
            {certifications.filter(c => c.name).map((cert, idx) => (
              <li key={cert.id || cert._id || idx}>
                <span className="font-bold text-black">{cert?.name}</span> by <span className="italic">{cert?.issuer}</span> ({cert?.date})
                {cert?.link && (
                  <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="ml-1.5 text-[10.5px] text-slate-500 hover:underline font-sans">
                    [Verify]
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 8. Languages */}
      {hasLanguages && (
        <section className="mt-[10px] mb-[8px]">
          <h2 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide text-left">
            Languages
          </h2>
          <p className="text-slate-800 font-sans text-[11px] leading-[1.45] text-left">
            {languages.filter(l => l && l.trim() !== '').join(', ')}
          </p>
        </section>
      )}
    </div>
  );
};

export default ATSTemplate;
