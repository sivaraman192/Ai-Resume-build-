import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useResume } from '../context/ResumeContext.jsx';
import ResumePreview from '../resume/ResumePreview.jsx';
import { exportResumePdf } from '../utils/exportPdf.js';
import { exportResumeDocx } from '../utils/exportDocx.js';
import aiService from '../services/aiService.js';
import { ArrowLeft, Download, Printer, Award, AlertCircle, RefreshCw, FileText } from 'lucide-react';

export const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentResume, fetchResumeById } = useResume();

  const [aiScoreDetails, setAiScoreDetails] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResumeById(id).then((resume) => {
        // Trigger AI scoring analysis on page load
        handleScoreAnalysis(resume);
      });
    }
  }, [id]);

  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const downloadDropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target)) {
        setShowDownloadDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle auto-download query parameter
  useEffect(() => {
    if (currentResume && searchParams.get('download') === 'true' && !downloading) {
      setDownloading(true);
      setTimeout(() => {
        try {
          exportResumePdf(currentResume, currentResume?.template || 'modern');
        } catch (e) {
          console.error(e);
        } finally {
          setDownloading(false);
          navigate('/dashboard');
        }
      }, 1200);
    }
  }, [currentResume, searchParams]);

  // Request detailed AI scoring & keyword suggestions
  const handleScoreAnalysis = async (resumeData) => {
    setLoadingScore(true);
    try {
      const data = await aiService.scoreResume(resumeData || currentResume);
      setAiScoreDetails(data);
    } catch (err) {
      console.warn('Failed to retrieve AI resume score details:', err);
    } finally {
      setLoadingScore(false);
    }
  };

  const handleDownloadPdf = () => {
    try {
      setShowDownloadDropdown(false);
      exportResumePdf(currentResume, currentResume?.template || 'modern');
    } catch (err) {
      alert('Failed to download PDF.');
    }
  };

  const handleDownloadDocx = () => {
    try {
      setShowDownloadDropdown(false);
      exportResumeDocx(currentResume);
    } catch (err) {
      alert('Failed to download Word document.');
    }
  };

  if (!currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-darkBg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading Resume Preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950/40 py-10 px-4">
      {/* 1. Header controls (no-print) */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-8 no-print border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate(`/builder/${currentResume._id}`)}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Builder
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">
              Resume Preview
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold">{currentResume.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg transition"
          >
            <Printer className="w-4 h-4" />
            Print Resume
          </button>
          <div className="relative" ref={downloadDropdownRef}>
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-md transition"
            >
              <Download className="w-4 h-4" />
              Download
              <span className="ml-1 text-[8px]">▼</span>
            </button>
            
            {showDownloadDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex items-center w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  className="flex items-center w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Download Word (.docx)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Content splits: Left Sidebar with AI Insights & Right A4 Document */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane: AI ATS Score details (no-print) */}
        <div className="lg:col-span-4 flex flex-col gap-6 no-print">
          {/* Circular Score display */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b pb-3">
              <Award className="w-5 h-5 text-indigo-500" />
              ATS Scoring Insights
            </h3>

            <div className="flex items-center gap-5 mt-2">
              <div className="relative w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-2xl font-black text-slate-850 dark:text-white bg-slate-50/50 dark:bg-slate-950">
                {currentResume.resumeScore}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-550 dark:text-slate-400">
                  Initial Completeness
                </span>
                <span className="text-[10px] font-semibold text-slate-450 mt-0.5">
                  Based on filled forms, tech tags count, and summary length.
                </span>
              </div>
            </div>

            {/* AI Keywords suggestion lists */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-2.5">
                Suggested ATS Keywords
              </span>
              {loadingScore ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-450">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating key phrases suggestions...
                </div>
              ) : aiScoreDetails?.suggestedKeywords ? (
                <div className="flex flex-wrap gap-1.5">
                  {aiScoreDetails.suggestedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded text-[10px] font-semibold text-slate-650 dark:text-slate-350"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-400">No suggestions available</span>
              )}
            </div>
          </div>

          {/* Action Checklist panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <h3 className="font-extrabold text-sm text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b pb-3">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              Recruiter Checklist
            </h3>
            {aiScoreDetails?.tips ? (
              <ul className="list-disc pl-4 text-xs font-medium text-slate-600 dark:text-slate-400 space-y-2.5">
                {aiScoreDetails.tips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">Loading checklist...</p>
            )}
          </div>
        </div>

        {/* Right pane: Document Render (takes full page on print) */}
        <div className="lg:col-span-8 flex justify-center bg-transparent">
          <div id="resume-a4-document" className="shadow-2xl rounded-sm overflow-hidden bg-white select-text">
            <ResumePreview resumeData={currentResume} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
