import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext.jsx';
import ResumeCard from '../components/ResumeCard.jsx';
import VersionHistoryModal from '../components/VersionHistoryModal.jsx';
import ResumeUpload from '../components/ResumeUpload.jsx';
import { Plus, LayoutGrid, FileText, AlertCircle, TrendingUp, Award, Clock, Upload } from 'lucide-react';

export const Dashboard = () => {
  const { resumes = [], loading, error, fetchResumes, deleteResume } = useResume();
  const navigate = useNavigate();

  const [selectedResume, setSelectedResume] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadSuccess = (parsedData) => {
    // Navigate to builder and pass parsedResumeData in state
    navigate('/builder?template=ats', { state: { parsedResumeData: parsedData } });
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume? This cannot be undone.')) {
      try {
        await deleteResume(id);
      } catch (err) {
        console.error('Failed to delete resume:', err);
      }
    }
  };

  const handleDownload = (resume) => {
    if (resume?._id) {
      navigate(`/preview/${resume._id}?download=true`);
    }
  };

  const handleViewHistory = (resume) => {
    setSelectedResume(resume);
    setShowHistoryModal(true);
  };

  const handleRestoreSuccess = () => {
    fetchResumes();
  };

  const totalResumes = resumes.length;
  const bestAtsScore = resumes.reduce((max, r) => Math.max(max, r.resumeScore || 0), 0);
  const recentlyEdited = resumes[0] ? resumes[0].title : 'None';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 flex-1">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <LayoutGrid className="w-8 h-8 text-indigo-500" />
            My Resumes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage, edit, check score, and download your resumes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 text-indigo-500" />
            Upload Resume
          </button>
          
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-550 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Resume
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-rose-50 dark:bg-rose-955/20 border border-rose-250 dark:border-rose-900/40 text-rose-600 dark:text-rose-450 rounded-xl mb-6 text-left">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Stats Section */}
      {!loading && resumes && resumes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-left">
          <div className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Total Resumes</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{totalResumes}</span>
            </div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Best ATS Score</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-450 leading-none">{bestAtsScore}</span>
            </div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Recently Edited</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-250 truncate leading-none mt-0.5">{recentlyEdited}</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 min-h-[190px] bg-white/40 dark:bg-slate-900/20 animate-pulse"
            >
              <div className="w-2/3 h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="flex-1 mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4 flex justify-between">
                <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : resumes && resumes.length === 0 ? (
        /* Empty state view */
        <div className="border border-dashed border-slate-305 dark:border-slate-800 rounded-2xl py-16 px-6 text-center max-w-lg mx-auto flex flex-col items-center gap-4 bg-white/30 dark:bg-slate-900/10">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">No Resumes Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-[280px] mx-auto font-medium">
              You haven't created any resumes yet. Click the button to select a template and start building!
            </p>
          </div>
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-lg shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Build First Resume
          </button>
        </div>
      ) : (
        /* Resumes Grid list */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume?._id}
              resume={resume}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onViewHistory={handleViewHistory}
            />
          ))}
        </div>
      )}

      {/* Version History Overlay */}
      <VersionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedResume(null);
        }}
        resume={selectedResume}
        onRestoreSuccess={handleRestoreSuccess}
      />

      {/* Resume Upload Modal */}
      <ResumeUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Dashboard;
