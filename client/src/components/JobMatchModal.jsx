import React, { useState } from 'react';
import { X, Briefcase, Sparkles, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { analyzeJobMatch } from '../utils/jobMatch.js';

export const JobMatchModal = ({ isOpen, onClose, resumeData }) => {
  if (!isOpen) return null;

  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    // Simulate minor network delay for premium feel
    setTimeout(() => {
      const analysis = analyzeJobMatch(resumeData, jobDescription);
      setResult(analysis);
      setLoading(false);
    }, 700);
  };

  const handleReset = () => {
    setResult(null);
    setJobDescription('');
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20';
    if (score >= 75) return 'text-sky-500 border-sky-500/20 bg-sky-50 dark:bg-sky-950/20';
    if (score >= 60) return 'text-amber-500 border-amber-500/20 bg-amber-50 dark:bg-amber-950/20';
    return 'text-rose-500 border-rose-500/20 bg-rose-50 dark:bg-rose-950/20';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            Job Description ATS Matcher
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-950 transition animate-pulse"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {!result ? (
            <div className="flex flex-col gap-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                  Target Job Description
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Paste the job posting requirements below. We will scan your skills, projects, and summary for matching keywords.
                </p>
              </div>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium resize-none leading-relaxed"
              />

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !jobDescription.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Analyze Match Rate
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 text-left">
              {/* Dial score card */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-5 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl">
                <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-inner ${getScoreColor(result.score)}`}>
                  <span className="text-[9px] font-black tracking-widest uppercase opacity-75">Match</span>
                  <span className="text-3xl font-black mt-0.5">{result.score}%</span>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-base">
                    {result.score >= 85 ? 'Excellent Alignment!' : result.score >= 60 ? 'Good Match, Needs Skills' : 'Low Relevance Detected'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 leading-relaxed">
                    Compare your experience and skill keywords to standard recruiter posting criteria. Optimize missing tags below to rank higher.
                  </p>
                </div>
              </div>

              {/* Matched Keywords */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Matched Keywords ({result.matchedKeywords.length})
                </span>
                {result.matchedKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 text-[10.5px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400 rounded-lg capitalize">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No matching keywords found.</span>
                )}
              </div>

              {/* Missing Keywords */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  Missing Keywords ({result.missingKeywords.length})
                </span>
                {result.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 text-[10.5px] font-bold bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400 rounded-lg capitalize animate-pulse">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Excellent! You have no missing key concepts.</span>
                )}
              </div>

              {/* Suggestions list */}
              <div className="flex flex-col gap-2.5 mt-1 border-t pt-4 border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Match Recommendations
                </span>
                <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 flex flex-col gap-1.5">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i} className="leading-relaxed font-semibold">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-between">
          {result ? (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Scan Another Job
            </button>
          ) : (
            <div></div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Close Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobMatchModal;
