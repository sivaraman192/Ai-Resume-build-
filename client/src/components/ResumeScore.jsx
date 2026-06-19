import React from 'react';
import { X, Award, AlertCircle, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { calculateAtsScore } from '../utils/atsScoring.js';

export const ResumeScore = ({ isOpen, onClose, resume, onFixField }) => {
  if (!isOpen) return null;

  const analysis = calculateAtsScore(resume);
  const score = analysis.overallScore;
  const subScores = analysis.subScores;
  const tips = analysis.suggestions;
  const missingKeywords = analysis.missingKeywords;

  const getScoreStatus = (s) => {
    if (s >= 90) return { label: 'Excellent', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20', fill: 'bg-emerald-500' };
    if (s >= 75) return { label: 'Good', color: 'text-sky-500 border-sky-500/20 bg-sky-50 dark:bg-sky-950/20', fill: 'bg-sky-500' };
    if (s >= 60) return { label: 'Fair', color: 'text-amber-500 border-amber-500/20 bg-amber-50 dark:bg-amber-950/20', fill: 'bg-amber-500' };
    return { label: 'Needs Work', color: 'text-rose-500 border-rose-500/20 bg-rose-50 dark:bg-rose-950/20', fill: 'bg-rose-500' };
  };

  const status = getScoreStatus(score);

  // Map checklist string to builder forms for automatic focus scrolls
  const handleFixField = (tipText) => {
    let elementId = '';
    let tabId = '';

    const lowerTip = tipText.toLowerCase();

    if (lowerTip.includes('name') || lowerTip.includes('personal info')) {
      elementId = 'fullName';
      tabId = 'personal';
    } else if (lowerTip.includes('email') || lowerTip.includes('phone') || lowerTip.includes('contact')) {
      elementId = 'email';
      tabId = 'personal';
    } else if (lowerTip.includes('location')) {
      elementId = 'location';
      tabId = 'personal';
    } else if (lowerTip.includes('link') || lowerTip.includes('linkedin') || lowerTip.includes('github')) {
      elementId = 'github';
      tabId = 'personal';
    } else if (lowerTip.includes('summary') || lowerTip.includes('objective')) {
      elementId = 'summary-textarea';
      tabId = 'summary';
    } else if (lowerTip.includes('education') || lowerTip.includes('academic') || lowerTip.includes('degree')) {
      elementId = 'edu-degree-0';
      tabId = 'education';
    } else if (lowerTip.includes('skills') || lowerTip.includes('technical skill')) {
      elementId = 'skill-input-0';
      tabId = 'skills';
    } else if (lowerTip.includes('experience') || lowerTip.includes('employment') || lowerTip.includes('work history') || lowerTip.includes('bullet')) {
      elementId = 'exp-company-0';
      tabId = 'experience';
    } else if (lowerTip.includes('projects') || lowerTip.includes('builds')) {
      elementId = 'proj-title-0';
      tabId = 'projects';
    } else if (lowerTip.includes('certifications') || lowerTip.includes('credential')) {
      elementId = 'cert-name-0';
      tabId = 'certifications';
    }

    if (onFixField && typeof onFixField === 'function') {
      onFixField(tabId, elementId);
    }
  };

  const subScoreProgress = [
    { label: 'Contact Information', score: subScores.contact, max: 10 },
    { label: 'Professional Summary', score: subScores.summary, max: 15 },
    { label: 'Technical Skills', score: subScores.skills, max: 20 },
    { label: 'Experience Section', score: subScores.experience, max: 15 },
    { label: 'Key Projects', score: subScores.projects, max: 20 },
    { label: 'Academic Education', score: subScores.education, max: 10 },
    { label: 'Certifications', score: subScores.certifications, max: 5 },
    { label: 'Resume Formatting', score: subScores.formatting, max: 5 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Premium ATS Score Dashboard
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-950 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Main Dial & Metric */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-5 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 rounded-2xl">
            <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-inner ${status.color}`}>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">ATS Score</span>
              <span className="text-4xl font-black mt-1 leading-none">{score}</span>
              <span className="text-[9px] font-extrabold mt-1 uppercase tracking-wider">{status.label}</span>
            </div>

            <div className="flex-1 text-center sm:text-left flex flex-col gap-2">
              <span className="font-extrabold text-slate-805 dark:text-white text-base flex items-center gap-1.5 justify-center sm:justify-start">
                <ShieldCheck className="w-5 h-5 text-indigo-650" />
                ATS Scanner Readiness Summary
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                An ATS score above 90 guarantees optimal key phrase readability. Our engine evaluates contact nodes, section density, action verbs, and spelling filters.
              </p>
            </div>
          </div>

          {/* Subscores Grid */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">
              ATS Component Checklist Sub-scores
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3.5">
              {subScoreProgress.map((item, idx) => {
                const percent = (item.score / item.max) * 100;
                return (
                  <div key={idx} className="flex flex-col gap-1 text-left">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-305">
                      <span>{item.label}</span>
                      <span>{item.score} / {item.max}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${status.fill}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing Keywords */}
          {missingKeywords.length > 0 && (
            <div className="flex flex-col gap-2.5 text-left border-t border-slate-100 dark:border-slate-800 pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-indigo-500" />
                ATS Target Keywords to Add
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 text-[10px] font-extrabold bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 text-indigo-650 dark:text-indigo-400 rounded-lg capitalize">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quality Recommendations Checklist */}
          <div className="flex flex-col gap-3 text-left border-t border-slate-100 dark:border-slate-800 pt-4">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              AI Resume Quality Suggestions
            </span>

            {tips && tips.length > 0 && tips[0] !== 'Your resume looks exceptionally competitive and recruiter ready!' ? (
              <div className="flex flex-col gap-2">
                {tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-4 p-3 border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10 rounded-xl"
                  >
                    <p className="text-xs text-slate-650 dark:text-slate-350 font-semibold leading-relaxed">
                      {tip}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleFixField(tip)}
                      className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 shrink-0 select-none flex items-center gap-0.5"
                    >
                      Fix Field
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-4 border border-emerald-200/50 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-xl text-emerald-650">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold">Excellent! Your profile meets all high-scoring recruitment parameters.</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeScore;
