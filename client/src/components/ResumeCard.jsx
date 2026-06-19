import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Download, Calendar, Eye, History } from 'lucide-react';

export const ResumeCard = ({ resume, onDelete, onDownload, onViewHistory }) => {
  const navigate = useNavigate();

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20';
    if (score >= 75) return 'text-sky-500 border-sky-500/20 bg-sky-50 dark:bg-sky-950/20';
    if (score >= 60) return 'text-amber-500 border-amber-500/20 bg-amber-50 dark:bg-amber-950/20';
    return 'text-rose-500 border-rose-500/20 bg-rose-50 dark:bg-rose-950/20';
  };

  const formattedDate = new Date(resume?.updatedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[190px]">
      <div>
        {/* Title and Template Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
              {resume?.title || 'Untitled Resume'}
            </h3>
            <span className="inline-flex max-w-max items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 capitalize">
              {resume?.template || 'modern'} Template
            </span>
          </div>

          {/* Resume Score circular badge */}
          <div className={`flex flex-col items-center justify-center border rounded-xl px-2.5 py-1.5 ${getScoreColor(resume?.resumeScore)}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 flex items-center gap-0.5">
              Score
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              {resume?.resumeScore || 0}
            </span>
          </div>
        </div>

        {/* Updated Timestamp */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-550 mt-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>Updated {formattedDate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/builder/${resume?._id}`)}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-650 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          
          <button
            type="button"
            onClick={() => navigate(`/preview/${resume?._id}`)}
            className="flex items-center gap-1 text-sm font-semibold text-slate-650 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          <button
            type="button"
            onClick={() => onViewHistory && onViewHistory(resume)}
            className="flex items-center gap-1 text-sm font-semibold text-slate-655 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <History className="w-4 h-4" />
            Versions
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onDownload && onDownload(resume)}
            title="Download PDF"
            className="p-2 text-slate-550 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/30 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(resume?._id)}
            title="Delete Resume"
            className="p-2 text-slate-550 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
