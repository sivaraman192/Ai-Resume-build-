import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, CheckCircle, Smartphone, ArrowRight, Eye, ShieldCheck, Download, RefreshCw } from 'lucide-react';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleHeroCTA = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-between">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 mb-6 mx-auto animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Resume Builder V2.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans max-w-4xl mx-auto leading-[1.15]">
          Build{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            ATS-Friendly Resumes
          </span>{' '}
          with AI
        </h1>

        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
          ResumeForge helps students, freshers, and developers create professional resumes with AI suggestions, live preview, and high-fidelity PDF export.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            onClick={handleHeroCTA}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-200"
          >
            Create Resume
            <ArrowRight className="w-5 h-5" />
          </button>
          <Link
            to="/templates"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200"
          >
            View Templates
          </Link>
        </div>

        {/* Live Mock Editor Graphic */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <span className="text-xs font-semibold text-slate-400">Live Workspace - software_engineer_resume.pdf</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Form simulation */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 text-left flex flex-col gap-3">
              <div className="w-1/3 h-3.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="w-full h-8 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800"></div>
              <div className="w-2/3 h-3.5 bg-slate-200 dark:bg-slate-800 rounded mt-2"></div>
              <div className="w-full h-16 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between px-3">
                <span className="text-xs text-slate-400">AI summary rewrite suggestion...</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded">Auto-Write</span>
              </div>
            </div>
            {/* Preview simulation */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 text-left flex flex-col gap-4 shadow-sm">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between">
                <div>
                  <div className="w-24 h-4 bg-slate-300 dark:bg-slate-700 rounded mb-1"></div>
                  <div className="w-36 h-2 bg-slate-200 dark:bg-slate-850 rounded"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-850 rounded"></div>
                <div className="w-5/6 h-2 bg-slate-200 dark:bg-slate-850 rounded"></div>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex gap-2">
                <div className="w-12 h-4 bg-indigo-100 dark:bg-indigo-950/40 rounded"></div>
                <div className="w-16 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                <div className="w-14 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="bg-slate-50 dark:bg-slate-950/40 py-20 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Packed with features to land your dream job
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">
              We provide tools designed specifically to help your resume succeed in ATS bots and impress recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900/60 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-150">AI Summary Generator</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Generate professional summaries and improve career objectives instantly tailored for specific roles.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/60 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-150">ATS Resume Score</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Get an objective score based on recruiters' standard guidelines and extract critical keywords suggestions.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/60 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-150">Live A4 Preview</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Watch your PDF update in real-time as you type. Choose between ATS-friendly, Modern, and Creative layouts.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/60 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-150">PDF Export</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Export high-fidelity A4 layout PDFs locally with a single click. Keep formatting perfectly aligned.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/60 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-150">Auto Save</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Never lose your progress. The builder automatically saves drafts in real-time behind the scenes.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/60 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-150">Fully Responsive</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Access and refine your resumes smoothly on mobile, tablet, laptop, and desktop displays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-20 bg-white dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Create a recruiter-ready resume in 4 simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-indigo-600/10">
                1
              </div>
              <h4 className="font-bold text-base text-slate-850 dark:text-white">Enter Details</h4>
              <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed max-w-[200px]">
                Fill in personal info, education, skills, projects, and work history.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-indigo-600/10">
                2
              </div>
              <h4 className="font-bold text-base text-slate-850 dark:text-white">Choose Template</h4>
              <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed max-w-[200px]">
                Select Modern, ATS Friendly, or Creative layout matching your industry.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-indigo-600/10">
                3
              </div>
              <h4 className="font-bold text-base text-slate-850 dark:text-white">Improve with AI</h4>
              <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed max-w-[200px]">
                Generate summaries, improve objectives, rewrite bullet points with AI.
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-indigo-600/10">
                4
              </div>
              <h4 className="font-bold text-base text-slate-850 dark:text-white">Download PDF</h4>
              <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed max-w-[200px]">
                Generate and download your clean PDF locally or print directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Templates Preview Section */}
      <section className="bg-slate-50 dark:bg-slate-950/40 py-20 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Choose a professional template
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Our templates are verified by hiring managers and optimized for readability.
              </p>
            </div>
            <Link
              to="/templates"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
            >
              See all templates
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col hover:shadow-lg transition duration-200">
              <div className="h-48 bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 font-bold">
                Modern Template
              </div>
              <div className="p-5 flex flex-col gap-1.5">
                <span className="font-bold text-base text-slate-800 dark:text-white">Modern</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Perfect for developer resumes</span>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col hover:shadow-lg transition duration-200">
              <div className="h-48 bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 font-bold">
                ATS Friendly Template
              </div>
              <div className="p-5 flex flex-col gap-1.5">
                <span className="font-bold text-base text-slate-800 dark:text-white">ATS Friendly</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Plain text focus for parse compliance</span>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col hover:shadow-lg transition duration-200">
              <div className="h-48 bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 font-bold">
                Creative Template
              </div>
              <div className="p-5 flex flex-col gap-1.5">
                <span className="font-bold text-base text-slate-800 dark:text-white">Creative Layout</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Bold banners for designers and media roles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="bg-gradient-to-r from-indigo-650 to-violet-750 text-white py-16 text-center bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold font-sans">
            Start building your resume today
          </h2>
          <p className="text-slate-200 text-base mt-4 max-w-xl mx-auto font-medium">
            Join thousands of students and developers using ResumeForge to present their qualifications perfectly.
          </p>
          <button
            onClick={handleHeroCTA}
            className="mt-8 px-8 py-3.5 bg-white text-indigo-600 hover:bg-slate-50 font-bold rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all"
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
