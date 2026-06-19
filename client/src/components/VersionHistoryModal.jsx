import React, { useState } from 'react';
import { X, History, RotateCcw, AlertTriangle } from 'lucide-react';
import resumeService from '../services/resumeService.js';

export const VersionHistoryModal = ({ isOpen, onClose, resume, onRestoreSuccess }) => {
  if (!isOpen || !resume) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const versions = resume.versions || [];

  const handleRestore = async (versionId) => {
    if (!window.confirm('Are you sure you want to restore this version? Your current edits will be saved as a new version history checkpoint.')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updatedResume = await resumeService.restoreVersion(resume._id || resume.id, versionId);
      if (onRestoreSuccess) {
        onRestoreSuccess(updatedResume.data || updatedResume);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to restore version. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            Version History - {resume.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {versions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 font-semibold text-sm">No saved versions found</p>
              <span className="text-xs text-slate-350 mt-1 block">Saves and updates will create automatic checkpoints.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                Available Restore Checkpoints ({versions.length})
              </span>
              <div className="flex flex-col gap-2.5">
                {[...versions].reverse().map((ver, idx) => (
                  <div
                    key={ver._id || idx}
                    className="flex justify-between items-center p-3 border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        {formatDate(ver.savedAt)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Template: <span className="capitalize">{ver.data?.template || 'modern'}</span> | Score: {ver.data?.resumeScore || 0}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRestore(ver._id)}
                      disabled={loading}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;
