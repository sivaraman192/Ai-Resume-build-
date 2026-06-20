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
    <div className="resume-page select-text">
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
            <div className="resume-links flex flex-wrap justify-center items-center font-sans">
              {github && (
                <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {github.replace(/https?:\/\/(www\.)?/, '')}
                </a>
              )}
              {github && (linkedin || portfolio) && <span>|</span>}
              {linkedin && (
                <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {linkedin.replace(/https?:\/\/(www\.)?/, '')}
                </a>
              )}
              {linkedin && portfolio && <span>|</span>}
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
        <section className="resume-section">
          <h2 className="resume-section-title">
            Professional Summary
          </h2>
          <div className="resume-section-content">
            <p className="whitespace-pre-wrap text-justify">
              {summary}
            </p>
          </div>
        </section>
      )}

      {/* 3. Professional Experience */}
      {hasExperience && (
        <section className="resume-section">
          <h2 className="resume-section-title">
            Professional Experience
          </h2>
          <div className="resume-section-content">
            {experience.filter(exp => exp.company || exp.role).map((exp, idx) => {
              const bullets = Array.isArray(exp?.description)
                ? exp.description
                : (typeof exp?.description === 'string' ? exp.description.split('\n').filter(Boolean) : []);

              return (
                <div key={exp.id || exp._id || idx} className="experience-block">
                  {/* Left: Role | Right: Date */}
                  <div className="resume-row">
                    <span className="resume-title">{exp?.role}</span>
                    <span className="resume-date">
                      {exp?.startDate} – {exp?.currentlyWorking ? 'Present' : exp?.endDate}
                    </span>
                  </div>
                  {/* Left: Company | Right: Location */}
                  <div className="resume-row mt-0.5">
                    <span className="resume-subtitle">{exp?.company}</span>
                    {exp?.location && <span className="resume-location">{exp?.location}</span>}
                  </div>
                  {/* Bullet achievements list */}
                  {bullets.length > 0 && (
                    <ul className="resume-bullets" style={{ listStyleType: 'disc' }}>
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

      {/* 4. Projects */}
      {hasProjects && (
        <section className="resume-section">
          <h2 className="resume-section-title">
            Key Projects
          </h2>
          <div className="resume-section-content">
            {projects.filter(proj => proj.title).map((proj, idx) => {
              const projectBullets = typeof proj.description === 'string'
                ? proj.description.split('\n').filter(Boolean)
                : (Array.isArray(proj.description) ? proj.description : []);

              return (
                <div key={proj.id || proj._id || idx} className="project-block">
                  {/* Title left, links right */}
                  <div className="resume-row">
                    <span className="resume-title">{proj?.title}</span>
                    {(proj?.github || proj?.liveDemo) && (
                      <div className="resume-links">
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
                    )}
                  </div>
                  {/* Tech stack below title */}
                  {proj?.techStack && (Array.isArray(proj.techStack) ? proj.techStack.length > 0 : proj.techStack.trim().length > 0) && (
                    <div className="resume-tech">
                      Tech Stack: {Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack}
                    </div>
                  )}
                  {/* Description bullets compact */}
                  {projectBullets.length > 0 && (
                    <ul className="resume-bullets" style={{ listStyleType: 'disc' }}>
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
        <section className="resume-section">
          <h2 className="resume-section-title">
            Education
          </h2>
          <div className="resume-section-content">
            {education.filter(edu => edu.institution || edu.degree).map((edu, idx) => (
              <div key={edu.id || edu._id || idx} className="education-block">
                {/* Left: Degree | Right: Year */}
                <div className="resume-row">
                  <span className="resume-title">{edu?.degree}</span>
                  <span className="resume-date">{edu?.startYear} – {edu?.endYear}</span>
                </div>
                {/* Left: Institution */}
                <div className="resume-row mt-0.5">
                  <span className="resume-subtitle">{edu?.institution}</span>
                </div>
                {/* Left: Location | Right: Score */}
                {(edu?.location || edu?.percentage) && (
                  <div className="resume-row mt-0.5">
                    <span className="resume-location italic" style={{ textAlign: 'left', fontWeight: 'normal' }}>{edu?.location || ''}</span>
                    {edu?.percentage && <span className="resume-date">CGPA/Percentage: {edu?.percentage}</span>}
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
          <section className="resume-section">
            <h2 className="resume-section-title">
              Technical Skills
            </h2>
            <div className="resume-section-content flex flex-col gap-1">
              {Object.entries(groupedSkills).map(([catName, list]) => (
                <div key={catName} className="select-all">
                  <span className="font-bold">{catName}: </span>
                  <span>{list.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* 7. Certifications */}
      {hasCertifications && (
        <section className="resume-section">
          <h2 className="resume-section-title">
            Certifications
          </h2>
          <div className="resume-section-content">
            <ul className="resume-bullets" style={{ listStyleType: 'disc' }}>
              {certifications.filter(c => c.name).map((cert, idx) => (
                <li key={cert.id || cert._id || idx}>
                  <span className="font-bold">{cert?.name}</span> by <span className="italic">{cert?.issuer}</span> ({cert?.date})
                  {cert?.link && (
                    <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="ml-1.5 hover:underline" style={{ fontSize: '10px' }}>
                      [Verify]
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 8. Languages */}
      {hasLanguages && (
        <section className="resume-section">
          <h2 className="resume-section-title">
            Languages
          </h2>
          <div className="resume-section-content">
            <p>
              {languages.filter(l => l && l.trim() !== '').join(', ')}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ATSTemplate;
