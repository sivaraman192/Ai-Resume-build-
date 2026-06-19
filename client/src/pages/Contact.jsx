import React, { useState } from 'react';
import FormInput from '../components/FormInput.jsx';
import FormTextarea from '../components/FormTextarea.jsx';
import { Mail, MessageSquare, CheckCircle, Send } from 'lucide-react';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    // Simulate support ticket API submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Info Sidebar */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-indigo-500" />
              Get In Touch
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
              Have questions, feedback, or need assistance? Our team is happy to help you!
            </p>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 uppercase">Support Email</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">support@resumeforge.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg">
          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent Successfully</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed">
                Thank you for contacting us. We will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FormInput
                label="Full Name"
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />

              <FormInput
                label="Email Address"
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />

              <FormTextarea
                label="Your Message"
                id="message"
                placeholder="Describe your issue or request here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md transition"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
