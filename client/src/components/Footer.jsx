import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & copyright */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-800 dark:text-slate-200">
              ResumeForge
            </span>
            <span className="text-sm text-slate-400 dark:text-slate-600">|</span>
            <p className="text-sm">
              &copy; {currentYear} ResumeForge. All rights reserved.
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link to="/templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Templates
            </Link>
            <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Contact
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Github
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
