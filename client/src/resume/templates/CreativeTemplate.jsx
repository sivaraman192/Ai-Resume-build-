import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Calendar, Award } from 'lucide-react';
import { groupSkills } from '../../utils/groupSkills.js';

export const CreativeTemplate = ({ data }) => {
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
  const photo = personalInfo?.photo || '';

  // Helpers to check empty status
  const hasContact = email || phone || location || linkedin || github || portfolio;
  const hasSkills = skills.some(s => s && s.trim() !== '');
  const hasLanguages = languages.some(l => l && l.trim() !== '');
  const hasExperience = experience.some(exp => exp.company || exp.role);
  const hasProjects = projects.some(proj => proj.title);
  const hasEducation = education.some(edu => edu.institution || edu.degree);
  const hasCertifications = certifications.some(c => c.name);

  // Fallback for empty state
  if (!fullName && !summary && !hasContact && !hasSkills && !hasExperience && !hasProjects && !hasEducation) {
    return (
      <div className="a4-container bg-white text-slate-400 p-8 flex items-center justify-center text-xs italic select-none">
        Start editing your details to preview the creative layout.
      </div>
    );
  }

  return (
    <div className="a4-container font-sans bg-slate-50/10 text-slate-800 p-0 flex flex-col select-text text-[11px] leading-[1.45] overflow-hidden">
      {/* Top Banner */}
      <header className="w-full bg-indigo-650 text-white px-6 py-5 flex items-center justify-between gap-5 shrink-0 text-left">
        <div className="flex flex-col gap-0.5 w-full">
          {fullName && (
            <h1 className="text-xl font-black uppercase tracking-tight font-sans text-white">
              {fullName}
            </h1>
          )}
          {hasExperience && experience[0]?.role && (
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-purple-200 mt-0.5">
              {experience[0]?.role}
            </p>
          )}
          {summary && summary.trim() && (
            <p className="text-[11px] text-indigo-50 font-medium leading-[1.45] mt-1 whitespace-pre-wrap">
              {summary}
            </p>
          )}
        </div>

        {photo && (
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/30 shadow-sm shrink-0">
            <img src={photo} alt={fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      {/* Grid wrapper for body sections */}
      <div className="p-6 grid grid-cols-12 gap-5 bg-white flex-1 text-left">
        {/* Left column (7 cols) */}
        <div className="col-span-7 flex flex-col">
          {/* Work experience */}
          {hasExperience && (
            <section className="mt-[10px] mb-[8px]">
              <h3 className="text-[12px] font-bold uppercase border-b border-slate-805 pb-[2px] mb-[5px] text-indigo-700">
                Experience
              </h3>
              <div className="flex flex-col">
                {experience.filter(exp => exp.company || exp.role).map((exp, idx) => {
                  const bullets = Array.isArray(exp?.description)
                    ? exp.description
                    : (typeof exp?.description === 'string' ? exp.description.split('\n').filter(Boolean) : []);

                  return (
                    <div key={exp.id || exp._id || idx} className="flex flex-col relative pl-3 border-l-2 border-slate-100 mb-[10px] last:mb-0">
                      <div className="absolute top-1 -left-[5px] w-2 h-2 rounded-full bg-indigo-500 border border-white"></div>
                      <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45]">
                        <span className="font-extrabold text-slate-850 text-[11px]">{exp?.role}</span>
                        <span className="text-[10.5px] text-slate-500 font-bold">
                          {exp?.startDate} – {exp?.currentlyWorking ? 'Present' : exp?.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] leading-[1.45] font-bold text-slate-505 italic mt-0.5">
                        <span>{exp?.company}</span>
                        {exp?.location && <span>{exp?.location}</span>}
                      </div>
                      {bullets.length > 0 && (
                        <ul className="list-disc pl-[16px] mt-[4px] text-slate-655 space-y-0.5 text-[11px] leading-[1.45]">
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

          {/* Projects */}
          {hasProjects && (
            <section className="mt-[10px] mb-[8px]">
              <h3 className="text-[12px] font-bold uppercase border-b border-slate-805 pb-[2px] mb-[5px] text-indigo-700">
                Projects
              </h3>
              <div className="grid grid-cols-1">
                {projects.filter(proj => proj.title).map((proj, idx) => {
                  const projectBullets = typeof proj.description === 'string'
                    ? proj.description.split('\n').filter(Boolean)
                    : (Array.isArray(proj.description) ? proj.description : []);

                  return (
                    <div key={proj.id || proj._id || idx} className="border border-slate-100 rounded-lg p-2.5 bg-slate-50/30 flex flex-col gap-1 mb-[8px] last:mb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-slate-800 text-[11px] block leading-tight">{proj?.title}</span>
                          {proj?.techStack && (Array.isArray(proj.techStack) ? proj.techStack.length > 0 : proj.techStack.trim().length > 0) && (
                            <span className="text-[10.5px] font-mono text-indigo-650 block mt-0.5 font-bold leading-[1.45]">
                              {Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack}
                            </span>
                          )}
                        </div>
                        {(proj?.github || proj?.liveDemo) && (
                          <div className="flex gap-1.5 text-[10.5px] font-bold text-indigo-650 font-mono">
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
                        )}
                      </div>
                      {projectBullets.length > 0 && (
                        <ul className="list-disc pl-[15px] mt-[2px] text-slate-655 space-y-0.5 text-[11px] leading-[1.45]">
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
        </div>

        {/* Right column (5 cols) */}
        <div className="col-span-5 flex flex-col">
          {/* Contact Details */}
          {hasContact && (
            <section className="mt-[10px] mb-[8px]">
              <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-indigo-700">
                Contact Info
              </h3>
              <div className="flex flex-col gap-1.5 font-semibold break-all text-[11px] text-slate-655 leading-[1.45]">
                {email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-indigo-600 shrink-0" />
                    {email}
                  </span>
                )}
                {phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-indigo-600 shrink-0" />
                    {phone}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                    {location}
                  </span>
                )}
                {github && (
                  <span className="flex items-center gap-1">
                    <Github className="w-3 h-3 text-indigo-600 shrink-0" />
                    <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {github.replace(/https?:\/\/(www\.)?github\.com\//, '')}
                    </a>
                  </span>
                )}
                {linkedin && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="w-3 h-3 text-indigo-600 shrink-0" />
                    <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\//, '')}
                    </a>
                  </span>
                )}
                {portfolio && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-indigo-600 shrink-0" />
                    <a href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-[10.5px]">
                      {portfolio.replace(/https?:\/\/(www\.)?/, '')}
                    </a>
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Education */}
          {hasEducation && (
            <section className="mt-[10px] mb-[8px]">
              <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-indigo-700">
                Education
              </h3>
              <div className="flex flex-col gap-2">
                {education.filter(edu => edu.institution || edu.degree).map((edu, idx) => (
                  <div key={edu.id || edu._id || idx} className="flex flex-col font-sans">
                    {/* Row 1: Degree left, Year right */}
                    <div className="flex justify-between items-baseline text-[11px] leading-[1.45]">
                      <span className="font-extrabold text-slate-805 text-[11px]">{edu?.degree}</span>
                      <span className="text-[10.5px] text-slate-400 font-bold">{edu?.startYear} – {edu?.endYear}</span>
                    </div>
                    {/* Row 2: Institution */}
                    <span className="text-[11px] text-slate-550 font-bold mt-0.5">{edu?.institution}</span>
                    {/* Row 3: Location left, Score right */}
                    {(edu?.location || edu?.percentage) && (
                      <div className="flex justify-between items-baseline text-[11px] leading-[1.45] mt-0.5">
                        <span className="text-slate-550 italic">{edu?.location || ''}</span>
                        {edu?.percentage && <span className="font-bold text-indigo-700">Score: {edu?.percentage}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {(() => {
            const groupedSkills = groupSkills(skills);
            const hasGroupedSkills = Object.keys(groupedSkills).length > 0;
            if (!hasGroupedSkills) return null;

            return (
              <section className="mt-[10px] mb-[8px]">
                <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-indigo-700">
                  Skills Set
                </h3>
                <div className="flex flex-col gap-1 font-sans text-[11px] leading-[1.45]">
                  {Object.entries(groupedSkills).map(([catName, list]) => (
                    <div key={catName} className="text-left">
                      <span className="font-bold text-slate-900">{catName}: </span>
                      <span className="text-slate-800 font-normal">{list.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* Certifications */}
          {hasCertifications && (
            <section className="mt-[10px] mb-[8px]">
              <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-indigo-700">
                Certifications
              </h3>
              <div className="flex flex-col gap-2">
                {certifications.filter(c => c.name).map((cert, idx) => (
                  <div key={cert.id || cert._id || idx} className="flex flex-col text-[11px] leading-[1.45]">
                    <span className="font-extrabold text-slate-800 leading-tight">{cert?.name}</span>
                    <span className="text-[10.5px] text-slate-405 font-bold">
                      {cert?.issuer} ({cert?.date})
                      {cert?.link && (
                        <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-[10.5px] text-indigo-500 hover:underline">
                          [Verify]
                        </a>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {hasLanguages && (
            <section className="mt-[10px] mb-[8px]">
              <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-indigo-700">
                Languages
              </h3>
              <span className="font-bold text-slate-655 text-[11px] tracking-wide leading-[1.45]">
                {languages.filter(l => l && l.trim() !== '').join(', ')}
              </span>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
