import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-4">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center shadow-inner">
          <FileQuestion className="w-9 h-9" />
        </div>
        <h1 className="text-5xl font-extrabold text-indigo-650 dark:text-indigo-400 font-sans tracking-tight">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 leading-tight">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-4">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md transition text-sm"
          >
            <Home className="w-4.5 h-4.5" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition text-sm font-bold"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
