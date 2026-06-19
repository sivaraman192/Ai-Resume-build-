import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import resumeService from '../services/resumeService.js';

export const ResumeUpload = ({ isOpen, onClose, onUploadSuccess }) => {
  if (!isOpen) return null;

  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (selectedFile) => {
    setError(null);
    setSuccess(false);

    if (!selectedFile) return;

    // Check size limit: 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      setError("File is too large. Maximum size allowed is 5MB.");
      return;
    }

    // Check extension
    const allowedExtensions = ['.pdf', '.docx'];
    const fileName = selectedFile.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isAllowed) {
      setError("Unsupported file format. Please upload only PDF or DOCX files.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await resumeService.uploadResume(file);
      
      setSuccess(true);
      setFile(null);
      
      // Allow user to see success state for a brief second, then pass data and close
      setTimeout(() => {
        if (onUploadSuccess && response.resumeData) {
          onUploadSuccess(response.resumeData);
        }
        onClose();
      }, 1200);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload and parse the resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-500" />
            Upload & Import Resume
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Upload your existing resume in PDF or Word (DOCX) format. Our parser will read the text and populate your resume builder fields automatically.
          </p>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Resume imported successfully! Populating builder...</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          {!loading && !success && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleButtonClick}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                onChange={handleChange}
              />
              
              <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-full">
                <Upload className="w-6 h-6" />
              </div>
              
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-350">
                  Drag and drop your file here, or <span className="text-indigo-500 hover:underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1.5 font-semibold">
                  Supports PDF or DOCX (Max 5MB)
                </p>
              </div>
            </div>
          )}

          {/* Selected File State */}
          {file && !loading && !success && (
            <div className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1 text-slate-400 hover:text-rose-500 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-350">
                Reading resume...
              </p>
              <p className="text-xs text-slate-400 font-bold">
                Parsing text and extracting sections. Please wait.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-105 dark:hover:bg-slate-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleUploadSubmit}
            disabled={!file || loading || success}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-500/10 transition flex items-center gap-1.5"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
