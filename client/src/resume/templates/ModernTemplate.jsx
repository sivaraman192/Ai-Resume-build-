import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Calendar, Award } from 'lucide-react';
import { groupSkills } from '../../utils/groupSkills.js';

export const ModernTemplate = ({ data }) => {
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

  // Extract contact links
  const email = personalInfo?.email || '';
  const phone = personalInfo?.phone || '';
  const location = personalInfo?.location || '';
  const github = links?.github || personalInfo?.github || '';
  const linkedin = links?.linkedin || personalInfo?.linkedin || '';
  const portfolio = links?.portfolio || personalInfo?.portfolio || '';
  const fullName = personalInfo?.fullName || '';
  const photo = personalInfo?.photo || '';

  // Has-section checks
  const hasContact = email || phone || location || linkedin || github || portfolio;
  const hasSkills = skills.some(s => s && s.trim() !== '');
  const hasLanguages = languages.some(l => l && l.trim() !== '');
  const hasExperience = experience.some(exp => exp.company || exp.role);
  const hasProjects = projects.some(proj => proj.title);
  const hasEducation = education.some(edu => edu.institution || edu.degree);
  const hasCertifications = certifications.some(c => c.name);

  if (!fullName && !summary && !hasContact && !hasSkills && !hasExperience && !hasProjects && !hasEducation) {
    return (
      <div className="a4-container bg-white text-slate-400 p-8 flex items-center justify-center text-xs italic select-none">
        Start editing your details to preview the modern layout.
      </div>
    );
  }

  return (
    <div className="a4-container font-sans bg-white text-slate-800 p-6 flex gap-5 select-text text-[11px] leading-[1.45]">
      {/* Left Sidebar (1/3rd width) */}
      <aside className="w-[30%] border-r border-slate-100 pr-4 flex flex-col gap-4.5 shrink-0 text-slate-700">
        {photo && (
          <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-205 shadow-sm mx-auto shrink-0 mb-1">
            <img src={photo} alt={fullName} className="w-full h-full object-cover" />
          </div>
        )}

        {hasContact && (
          <div className="flex flex-col gap-2 text-left">
            <h3 className="text-[10.5px] font-bold text-slate-900 uppercase tracking-widest border-b pb-0.5">
              Contact
            </h3>
            <div className="flex flex-col gap-1.5 text-[11px] font-semibold break-all text-slate-655 leading-[1.45]">
              {email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-indigo-650 shrink-0" />
                  {email}
                </span>
              )}
              {phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-indigo-655 shrink-0" />
                  {phone}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-indigo-655 shrink-0" />
                  {location}
                </span>
              )}
              {linkedin && (
                <span className="flex items-center gap-1.5">
                  <Linkedin className="w-3 h-3 text-indigo-650 shrink-0" />
                  <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                  </a>
                </span>
              )}
              {github && (
                <span className="flex items-center gap-1.5">
                  <Github className="w-3 h-3 text-indigo-655 shrink-0" />
                  <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {github.replace(/https?:\/\/(www\.)?github\.com\//, '')}
                  </a>
                </span>
              )}
              {portfolio && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-indigo-650 shrink-0" />
                  <a href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {portfolio.replace(/https?:\/\/(www\.)?/, '')}
                  </a>
                </span>
              )}
            </div>
          </div>
        )}

        {hasLanguages && (
          <div className="flex flex-col gap-1.5 text-left">
            <h3 className="text-[10.5px] font-bold text-slate-900 uppercase tracking-widest border-b pb-0.5">
              Languages
            </h3>
            <p className="text-[11px] font-bold text-slate-655 tracking-wide leading-[1.45]">
              {languages.filter(l => l && l.trim() !== '').join(', ')}
            </p>
          </div>
        )}
      </aside>

      {/* Right Content Area (2/3rds width) */}
      <main className="w-[70%] flex flex-col">
        {fullName && (
          <div className="flex flex-col gap-0.5 border-b pb-2 text-left mb-1.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-0.5">
              {fullName}
            </h1>
            {hasExperience && experience[0]?.role && (
              <p className="text-[10.5px] font-bold text-indigo-650 tracking-wider uppercase">
                {experience[0]?.role}
              </p>
            )}
          </div>
        )}

        {/* Summary */}
        {summary && summary.trim() && (
          <section className="mt-[10px] mb-[8px] text-left">
            <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide">
              About Me
            </h3>
            <p className="text-slate-705 leading-[1.45] font-sans text-justify text-[11px] whitespace-pre-wrap">
              {summary}
            </p>
          </section>
        )}

        {/* Technical Skills Section */}
        {(() => {
          const groupedSkills = groupSkills(skills);
          const hasGroupedSkills = Object.keys(groupedSkills).length > 0;
          if (!hasGroupedSkills) return null;

          return (
            <section className="mt-[10px] mb-[8px] text-left">
              <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide">
                Technical Skills
              </h3>
              <div className="flex flex-col gap-1 font-sans text-[11px] leading-[1.45]">
                {Object.entries(groupedSkills).map(([catName, list]) => (
                  <div key={catName} className="text-left">
                    <span className="font-bold text-slate-900">{catName}: </span>
                    <span className="text-slate-805">{list.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Work Experience */}
        {hasExperience && (
          <section className="mt-[10px] mb-[8px] text-left">
            <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide">
              Experience
            </h3>
            <div className="flex flex-col">
              {experience.filter(exp => exp.company || exp.role).map((exp, idx) => {
                const bullets = Array.isArray(exp?.description)
                  ? exp.description
                  : (typeof exp?.description === 'string' ? exp.description.split('\n').filter(Boolean) : []);

                return (
                  <div key={exp.id || exp._id || idx} className="flex flex-col mb-[10px] last:mb-0">
                    <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45]">
                      <span className="font-bold text-slate-900 text-[11px]">{exp?.role}</span>
                      <span className="text-[10.5px] text-slate-550 font-bold flex items-center gap-0.5">
                        <Calendar className="w-3 h-3 text-indigo-655 shrink-0" />
                        {exp?.startDate} – {exp?.currentlyWorking ? 'Present' : exp?.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] leading-[1.45] font-bold text-slate-500 italic mt-0.5">
                      <span>{exp?.company}</span>
                      {exp?.location && <span>{exp?.location}</span>}
                    </div>
                    {bullets.length > 0 && (
                      <ul className="list-disc pl-[16px] mt-[4px] text-slate-700 text-[11px] leading-[1.45]">
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
          <section className="mt-[10px] mb-[8px] text-left">
            <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide">
              Projects
            </h3>
            <div className="flex flex-col">
              {projects.filter(proj => proj.title).map((proj, idx) => {
                const projectBullets = typeof proj.description === 'string'
                  ? proj.description.split('\n').filter(Boolean)
                  : (Array.isArray(proj.description) ? proj.description : []);

                return (
                  <div key={proj.id || proj._id || idx} className="flex flex-col mb-[8px] last:mb-0">
                    <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45]">
                      <span className="font-bold text-slate-900 text-[11px]">{proj?.title}</span>
                      <div className="text-[10.5px] text-indigo-650 font-bold flex gap-2 font-mono">
                        {proj?.github && (
                          <a href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            GitHub
                          </a>
                        )}
                        {proj?.github && proj?.liveDemo && <span>|</span>}
                        {proj?.liveDemo && (
                          <a href={proj.liveDemo.startsWith('http') ? proj.liveDemo : `https://${proj.liveDemo}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                      {proj?.techStack && (Array.isArray(proj.techStack) ? proj.techStack.length > 0 : proj.techStack.trim().length > 0) && (
                        <span className="text-[10.5px] font-mono text-slate-400 block mt-0.5 leading-[1.45]">
                          Tech: {Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack}
                        </span>
                      )}
                    {projectBullets.length > 0 && (
                      <ul className="list-disc pl-[15px] mt-[3px] text-slate-705 space-y-0.5 text-[11px] leading-[1.45]">
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

        {/* Education */}
        {hasEducation && (
          <section className="mt-[10px] mb-[8px] text-left">
            <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide">
              Education
            </h3>
            <div className="flex flex-col gap-2">
              {education.filter(edu => edu.institution || edu.degree).map((edu, idx) => (
                <div key={edu.id || edu._id || idx} className="flex flex-col">
                  {/* Row 1: Degree left, Year right */}
                  <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45]">
                    <span className="font-bold text-slate-900 text-[11px]">{edu?.degree}</span>
                    <span className="text-slate-500 font-semibold">{edu?.startYear} – {edu?.endYear}</span>
                  </div>
                  {/* Row 2: Institution */}
                  <div className="font-sans text-[11px] font-bold text-slate-605 mt-0.5">
                    {edu?.institution}
                  </div>
                  {/* Row 3: Location left, Score right */}
                  {(edu?.location || edu?.percentage) && (
                    <div className="flex justify-between items-baseline font-sans text-[11px] leading-[1.45] mt-0.5">
                      <span className="text-slate-500 italic">{edu?.location || ''}</span>
                      {edu?.percentage && <span className="font-bold text-slate-700">CGPA/Percentage: {edu?.percentage}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {hasCertifications && (
          <section className="mt-[10px] mb-[8px] text-left">
            <h3 className="text-[12px] font-bold uppercase border-b border-slate-800 pb-[2px] mb-[5px] text-slate-800 tracking-wide">
              Certifications
            </h3>
            <div className="flex flex-col gap-2">
              {certifications.filter(c => c.name).map((cert, idx) => (
                <div key={cert.id || cert._id || idx} className="flex items-start gap-1.5 text-slate-700 text-[11px] leading-[1.45]">
                  <Award className="w-3 h-3 text-indigo-655 shrink-0 mt-0.5" />
                  <span className="leading-[1.45]">
                    <span className="font-bold text-slate-900 font-sans">{cert?.name}</span> – <span className="italic">{cert?.issuer}</span> ({cert?.date})
                    {cert?.link && (
                      <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-[10.5px] text-indigo-550 hover:underline font-sans">
                        [Verify]
                      </a>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ModernTemplate;
