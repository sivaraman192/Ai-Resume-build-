import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950/20">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-rose-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Something went wrong</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              An unexpected error occurred while loading this page. You can try reloading or clearing cache.
            </p>
            {this.state.error && (
              <pre className="w-full text-left bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded text-[10px] font-mono overflow-auto max-h-40 whitespace-pre-wrap select-text border border-rose-100 dark:border-rose-900/50">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-md transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
