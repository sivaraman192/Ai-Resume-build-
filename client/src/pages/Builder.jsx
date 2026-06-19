import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useResume } from '../context/ResumeContext.jsx';
import ResumePreview from '../resume/ResumePreview.jsx';
import ResumeScore from '../components/ResumeScore.jsx';
import JobMatchModal from '../components/JobMatchModal.jsx';
import ResumeUpload from '../components/ResumeUpload.jsx';
import { exportResumeJSON, importResumeJSON } from '../utils/resumeBackup.js';
import calculateResumeScore from '../utils/resumeScore.js';
import { exportResumePdf } from '../utils/exportPdf.js';
import { exportResumeDocx } from '../utils/exportDocx.js';
import FormInput from '../components/FormInput.jsx';
import FormTextarea from '../components/FormTextarea.jsx';
import TagInput from '../components/TagInput.jsx';
import BulletInput from '../components/BulletInput.jsx';
import aiService from '../services/aiService.js';
import skillSuggestions from '../data/skillSuggestions.js';
import {
  ArrowLeft,
  Download,
  Award,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Upload,
  DownloadCloud,
  UploadCloud,
} from 'lucide-react';

export const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const templateQuery = searchParams.get('template') || 'modern';

  const {
    currentResume,
    loading,
    saveStatus,
    error,
    fetchResumeById,
    initializeNewUnsavedResume,
    updatePersonalInfo,
    updateSummary,
    updateSection,
    updateTemplate,
    updateTitle,
    manualSave,
    setCurrentResume,
  } = useResume();

  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'summary', 'education', 'skills', 'projects', 'experience', 'certifications', 'languages'
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showJobMatchModal, setShowJobMatchModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loadingAi, setLoadingAi] = useState({});
  const isInitialized = useRef(false);
  const backupFileInputRef = useRef(null);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const downloadDropdownRef = useRef(null);

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

  const [previewScale, setPreviewScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        const padding = 32;
        const availableWidth = window.innerWidth - padding;
        const resumeWidth = 794;
        const scale = Math.min(0.95, availableWidth / resumeWidth);
        setPreviewScale(scale);
      } else {
        setPreviewScale(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const hasExistingData = () => {
    if (!currentResume) return false;
    const hasPersonalInfo = currentResume.personalInfo?.fullName || currentResume.personalInfo?.email;
    const hasSummary = currentResume.summary && currentResume.summary.trim() !== '';
    const hasEdu = currentResume.education && currentResume.education.length > 0;
    const hasExp = currentResume.experience && currentResume.experience.length > 0;
    const hasProj = currentResume.projects && currentResume.projects.length > 0;
    return !!(hasPersonalInfo || hasSummary || hasEdu || hasExp || hasProj);
  };

  const handleExportBackup = () => {
    try {
      const dataToExport = {
        ...currentResume,
        personalInfo: {
          ...currentResume.personalInfo,
          github: currentResume.links?.github || currentResume.personalInfo?.github || '',
          linkedin: currentResume.links?.linkedin || currentResume.personalInfo?.linkedin || '',
          portfolio: currentResume.links?.portfolio || currentResume.personalInfo?.portfolio || '',
        },
        skills: currentResume.skills || []
      };
      exportResumeJSON(dataToExport);
      triggerToast('Backup JSON exported successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to export backup.', true);
    }
  };

  const handleImportBackupClick = () => {
    if (hasExistingData() && !window.confirm('Importing a backup will overwrite your current resume data. Do you want to continue?')) {
      return;
    }
    backupFileInputRef.current.click();
  };

  const handleImportBackupFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const importedData = await importResumeJSON(e.target.files[0]);
        
        let flatSkills = [];
        if (Array.isArray(importedData.skills)) {
          if (importedData.skills.length > 0 && typeof importedData.skills[0] === 'object' && importedData.skills[0].items) {
            flatSkills = importedData.skills.reduce((acc, cat) => [...acc, ...(cat.items || [])], []);
          } else {
            flatSkills = importedData.skills;
          }
        }

        const experienceMapped = (importedData.experience || []).map(exp => {
          let descArray = [];
          if (typeof exp.description === 'string') {
            descArray = exp.description.split('\n').map(line => line.replace(/^[•\*-]\s*/, '').trim()).filter(Boolean);
          } else if (Array.isArray(exp.description)) {
            descArray = exp.description;
          }
          return {
            ...exp,
            id: exp.id || crypto.randomUUID(),
            description: descArray
          };
        });

        setCurrentResume((prev) => ({
          ...prev,
          ...importedData,
          skills: flatSkills,
          experience: experienceMapped,
          education: (importedData.education || []).map(edu => ({ ...edu, id: edu.id || crypto.randomUUID() })),
          projects: (importedData.projects || []).map(proj => ({ ...proj, id: proj.id || crypto.randomUUID() })),
          certifications: (importedData.certifications || []).map(cert => ({ ...cert, id: cert.id || crypto.randomUUID() })),
          _id: prev?._id || importedData._id,
          title: importedData.title || prev?.title || 'Imported Resume',
          links: {
            github: importedData.personalInfo?.github || importedData.links?.github || '',
            linkedin: importedData.personalInfo?.linkedin || importedData.links?.linkedin || '',
            portfolio: importedData.personalInfo?.portfolio || importedData.links?.portfolio || '',
          }
        }));

        triggerToast('Backup imported successfully!');
      } catch (err) {
        triggerToast(err.message || 'Failed to import backup.', true);
      } finally {
        e.target.value = '';
      }
    }
  };

  const handleUploadSuccess = (parsedData) => {
    let flatSkills = [];
    if (Array.isArray(parsedData.skills)) {
      if (parsedData.skills.length > 0 && typeof parsedData.skills[0] === 'object' && parsedData.skills[0].items) {
        flatSkills = parsedData.skills.reduce((acc, cat) => [...acc, ...(cat.items || [])], []);
      } else {
        flatSkills = parsedData.skills;
      }
    }

    const experienceMapped = (parsedData.experience || []).map(exp => {
      let descArray = [];
      if (typeof exp.description === 'string') {
        descArray = exp.description.split('\n').map(line => line.replace(/^[•\*-]\s*/, '').trim()).filter(Boolean);
      } else if (Array.isArray(exp.description)) {
        descArray = exp.description;
      }
      return {
        ...exp,
        id: exp.id || crypto.randomUUID(),
        description: descArray
      };
    });

    setCurrentResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev?.personalInfo,
        ...parsedData.personalInfo,
      },
      summary: parsedData.summary || '',
      education: (parsedData.education || []).map(edu => ({
        ...edu,
        id: edu.id || crypto.randomUUID()
      })),
      skills: flatSkills,
      projects: (parsedData.projects || []).map(proj => ({
        ...proj,
        id: proj.id || crypto.randomUUID(),
        techStack: Array.isArray(proj.techStack) ? proj.techStack : []
      })),
      experience: experienceMapped,
      certifications: (parsedData.certifications || []).map(cert => ({
        ...cert,
        id: cert.id || crypto.randomUUID()
      })),
      languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
      links: {
        github: parsedData.personalInfo?.github || prev?.links?.github || '',
        linkedin: parsedData.personalInfo?.linkedin || prev?.links?.linkedin || '',
        portfolio: parsedData.personalInfo?.portfolio || prev?.links?.portfolio || ''
      }
    }));

    triggerToast('Resume imported successfully!');
  };

  // Initialize or fetch resume ONCE
  useEffect(() => {
    if (location.state?.parsedResumeData) {
      const parsed = location.state.parsedResumeData;
      
      let flatSkills = [];
      if (Array.isArray(parsed.skills)) {
        if (parsed.skills.length > 0 && typeof parsed.skills[0] === 'object' && parsed.skills[0].items) {
          flatSkills = parsed.skills.reduce((acc, cat) => [...acc, ...(cat.items || [])], []);
        } else {
          flatSkills = parsed.skills;
        }
      }

      const experienceMapped = (parsed.experience || []).map(exp => {
        let descArray = [];
        if (typeof exp.description === 'string') {
          descArray = exp.description.split('\n').map(line => line.replace(/^[•\*-]\s*/, '').trim()).filter(Boolean);
        } else if (Array.isArray(exp.description)) {
          descArray = exp.description;
        }
        return {
          ...exp,
          id: exp.id || crypto.randomUUID(),
          description: descArray
        };
      });

      const initializedData = {
        title: parsed.personalInfo?.fullName ? `${parsed.personalInfo.fullName} Resume` : 'Imported Resume',
        template: templateQuery,
        personalInfo: {
          fullName: parsed.personalInfo?.fullName || '',
          email: parsed.personalInfo?.email || '',
          phone: parsed.personalInfo?.phone || '',
          location: parsed.personalInfo?.location || '',
          github: parsed.personalInfo?.github || '',
          linkedin: parsed.personalInfo?.linkedin || '',
          portfolio: parsed.personalInfo?.portfolio || '',
          photo: parsed.personalInfo?.photo || ''
        },
        summary: parsed.summary || '',
        education: (parsed.education || []).map(edu => ({
          ...edu,
          id: edu.id || crypto.randomUUID()
        })),
        skills: flatSkills,
        projects: (parsed.projects || []).map(proj => ({
          ...proj,
          id: proj.id || crypto.randomUUID(),
          techStack: Array.isArray(proj.techStack) ? proj.techStack : []
        })),
        experience: experienceMapped,
        certifications: (parsed.certifications || []).map(cert => ({
          ...cert,
          id: cert.id || crypto.randomUUID()
        })),
        languages: Array.isArray(parsed.languages) ? parsed.languages : [],
        links: {
          github: parsed.personalInfo?.github || '',
          linkedin: parsed.personalInfo?.linkedin || '',
          portfolio: parsed.personalInfo?.portfolio || ''
        }
      };

      setCurrentResume(initializedData);
      
      // Clear navigation state to prevent re-initializing
      window.history.replaceState({}, document.title);
      isInitialized.current = true;
    } else if (id) {
      isInitialized.current = false;
      fetchResumeById(id)
        .then(() => {
          isInitialized.current = true;
        })
        .catch((err) => {
          console.error('Error fetching resume by ID:', err);
          navigate('/dashboard');
        });
    } else {
      if (!isInitialized.current) {
        initializeNewUnsavedResume(templateQuery);
        isInitialized.current = true;
      }
    }
  }, [id, location.state]);

  // Handle toast notifications
  const triggerToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Safe client-side score evaluation
  let score = 0;
  let tips = [];
  try {
    if (currentResume) {
      // Create safe object for calculating score
      const calcResult = calculateResumeScore({
        ...currentResume,
        // Convert flat skills array to structure expected by resumeScore utility
        skills: currentResume.skills ? [{ category: 'Skills', items: currentResume.skills }] : []
      });
      score = calcResult.score || 0;
      tips = calcResult.tips || [];
    }
  } catch (err) {
    console.error('Error calculating score:', err);
  }

  // Update backend resumeScore property when changed
  useEffect(() => {
    if (currentResume && currentResume.resumeScore !== score) {
      setCurrentResume((prev) => {
        if (!prev) return prev;
        return { ...prev, resumeScore: score };
      });
    }
  }, [score]);

  console.log("Builder render");
  console.log("Selected template:", currentResume?.template);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950/20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading Resume Workspace...</p>
        </div>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-xl flex flex-col items-center gap-4">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Workspace Error</h3>
          <p className="text-xs text-slate-500">Failed to initialize the builder state. Please return to the dashboard.</p>
          <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Action: Save Resume to Backend API
  const handleSave = async () => {
    try {
      // Format data for saving
      const dataToSave = {
        ...currentResume,
        // Ensure links are synced to personalInfo for database schema validation
        personalInfo: {
          ...currentResume.personalInfo,
          github: currentResume.links?.github || currentResume.personalInfo?.github || '',
          linkedin: currentResume.links?.linkedin || currentResume.personalInfo?.linkedin || '',
          portfolio: currentResume.links?.portfolio || currentResume.personalInfo?.portfolio || '',
        },
        // Ensure skills are categorized to category/items array schema
        skills: currentResume.skills ? [{ category: 'Skills', items: currentResume.skills.filter(s => s && s.trim() !== '') }] : []
      };

      await manualSave(dataToSave);
      triggerToast('Resume progress saved successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to save resume. Please try again.', true);
    }
  };



  const handleDownloadPdf = () => {
    try {
      setShowDownloadDropdown(false);
      exportResumePdf(currentResume, currentResume?.template || 'modern');
      triggerToast('PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to download PDF.', true);
    }
  };

  const handleDownloadDocx = () => {
    try {
      setShowDownloadDropdown(false);
      exportResumeDocx(currentResume);
      triggerToast('Word document downloaded successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to download Word document.', true);
    }
  };

  // Action: Fix field and scroll to targeted form element
  const handleFixField = (tabId, elementId) => {
    setActiveTab(tabId);
    setShowScoreModal(false);
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }, 200);
  };

  // AI Service Handlers
  const handleImproveSummary = async () => {
    const role = currentResume.experience?.[0]?.role || 'Software Developer';
    const skills = currentResume.skills || [];
    setLoadingAi(prev => ({ ...prev, summary: true }));
    try {
      const improved = await aiService.generateSummary(role, skills);
      updateSummary(improved);
      triggerToast('Summary improved using AI!');
    } catch (err) {
      triggerToast('AI Summary generation failed.', true);
    } finally {
      setLoadingAi(prev => ({ ...prev, summary: false }));
    }
  };

  const handleGenerateExperienceBullets = async (id) => {
    const exp = currentResume.experience?.find(e => e.id === id);
    if (!exp) return;
    const role = exp.role || 'Software Developer';
    const company = exp.company || 'Technology Solutions';
    setLoadingAi(prev => ({ ...prev, [`experience_${id}`]: true }));
    try {
      const bullets = await aiService.generateExperienceBullets(role, company);
      const currentBullets = Array.isArray(exp.description) ? exp.description : [];
      const updatedBullets = [...currentBullets.filter(Boolean), ...bullets];
      handleExperienceChange(id, 'description', updatedBullets);
      triggerToast('Experience achievements generated!');
    } catch (err) {
      triggerToast('AI bullet generation failed.', true);
    } finally {
      setLoadingAi(prev => ({ ...prev, [`experience_${id}`]: false }));
    }
  };

  const handleImproveProjectDescription = async (id) => {
    const proj = currentResume.projects?.find(p => p.id === id);
    if (!proj) return;
    const title = proj.title || 'Project';
    const techStack = proj.techStack || [];
    const desc = proj.description || '';
    setLoadingAi(prev => ({ ...prev, [`project_${id}`]: true }));
    try {
      const improved = await aiService.rewriteProjectDescription(title, techStack, desc);
      handleProjectChange(id, 'description', improved);
      triggerToast('Project description optimized!');
    } catch (err) {
      triggerToast('AI project improvement failed.', true);
    } finally {
      setLoadingAi(prev => ({ ...prev, [`project_${id}`]: false }));
    }
  };

  const handleSuggestSkills = async () => {
    const role = currentResume.experience?.[0]?.role || 'Software Developer';
    setLoadingAi(prev => ({ ...prev, skills: true }));
    try {
      const suggested = await aiService.suggestSkills(role);
      const currentSkills = currentResume.skills || [];
      const uniqueSuggested = suggested.filter(s => !currentSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
      if (uniqueSuggested.length > 0) {
        updateSection('skills', [...currentSkills, ...uniqueSuggested]);
        triggerToast(`Added ${uniqueSuggested.length} suggested skills!`);
      } else {
        triggerToast('Skills already up to date!');
      }
    } catch (err) {
      triggerToast('AI skills suggestion failed.', true);
    } finally {
      setLoadingAi(prev => ({ ...prev, skills: false }));
    }
  };

  // Load Professional Sample Data for Testing
  const handleLoadSampleData = () => {
    const sampleResume = {
      ...currentResume,
      title: "Sivaraman M - Resume Sample",
      personalInfo: {
        fullName: "SIVARAMAN M",
        email: "sivaraman.m@example.com",
        phone: "+91 9876543210",
        location: "Chennai, India",
        github: "https://github.com/sivaraman-m",
        linkedin: "https://linkedin.com/in/sivaraman-m",
        portfolio: "https://sivaraman.dev",
        photo: ""
      },
      summary: "Dynamic Frontend Engineer with 3+ years of experience building high-performance web applications using React.js, JavaScript, and CSS. Passionate about creating responsive interfaces, optimizing code quality, and delivering intuitive user experiences. Proven ability to translate design mockups into functional web applications.",
      education: [
        {
          id: crypto.randomUUID(),
          degree: "B.E. in Computer Science and Engineering",
          institution: "Anna University",
          location: "Chennai, India",
          startYear: "2018",
          endYear: "2022",
          percentage: "8.5 CGPA"
        }
      ],
      skills: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Git', 'GitHub', 'Responsive Design'],
      projects: [
        {
          id: crypto.randomUUID(),
          title: "AI Resume Builder Platform",
          techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
          description: "Designed and built an AI-powered resume builder allowing users to create ATS-friendly resumes. Integrated auto-saving and dynamic resume score rating. Implemented PDF export layout matching print requirements.",
          github: "https://github.com/sivaraman-m/airesume",
          liveDemo: "https://resumeforge-builder.demo"
        }
      ],
      experience: [
        {
          id: crypto.randomUUID(),
          company: "Innovate Tech Labs",
          role: "Frontend Developer",
          location: "Chennai, India",
          startDate: "June 2022",
          endDate: "Present",
          currentlyWorking: true,
          description: [
            "Built responsive web pages using React.js and CSS.",
            "Improved UI performance and mobile responsiveness.",
            "Collaborated with team members to deliver client requirements.",
            "Tested and debugged frontend issues."
          ]
        }
      ],
      certifications: [
        {
          id: crypto.randomUUID(),
          name: "React Developer Certification",
          issuer: "Meta Academy",
          date: "August 2023",
          link: "https://coursera.org/verify/react-meta"
        }
      ],
      languages: ['English', 'Tamil'],
      links: {
        github: "https://github.com/sivaraman-m",
        linkedin: "https://linkedin.com/in/sivaraman-m",
        portfolio: "https://sivaraman.dev"
      }
    };
    setCurrentResume(sampleResume);
    triggerToast('Sample data loaded! Feel free to edit or test the live preview.');
  };

  // Form Field Changers
  const handlePersonalInfoChange = (field, val) => {
    updatePersonalInfo({ [field]: val });
  };

  const handleLinksChange = (field, val) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      const currentLinks = prev?.links || {};
      return {
        ...prev,
        links: { ...currentLinks, [field]: val },
      };
    });
  };

  // Dynamic Array Helpers: Education
  const handleEducationChange = (id, field, val) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: (prev.education || []).map((item) =>
          item.id === id ? { ...item, [field]: val } : item
        ),
      };
    });
  };

  const handleAddEducation = () => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: [
          ...(prev.education || []),
          {
            id: crypto.randomUUID(),
            degree: '',
            institution: '',
            location: '',
            startYear: '',
            endYear: '',
            percentage: '',
          },
        ],
      };
    });
  };

  const handleRemoveEducation = (id) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: (prev.education || []).filter((item) => item.id !== id),
      };
    });
  };

  // Dynamic Array Helpers: Projects
  const handleProjectChange = (id, field, val) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        projects: (prev.projects || []).map((item) =>
          item.id === id ? { ...item, [field]: val } : item
        ),
      };
    });
  };

  const handleAddProject = () => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        projects: [
          ...(prev.projects || []),
          {
            id: crypto.randomUUID(),
            title: '',
            techStack: [],
            description: '',
            github: '',
            liveDemo: '',
          },
        ],
      };
    });
  };

  const handleRemoveProject = (id) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        projects: (prev.projects || []).filter((item) => item.id !== id),
      };
    });
  };

  // Dynamic Array Helpers: Experience
  const handleExperienceChange = (id, field, val) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        experience: (prev.experience || []).map((item) =>
          item.id === id ? { ...item, [field]: val } : item
        ),
      };
    });
  };

  const handleAddExperience = () => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        experience: [
          ...(prev.experience || []),
          {
            id: crypto.randomUUID(),
            company: '',
            role: '',
            location: '',
            startDate: '',
            endDate: '',
            currentlyWorking: false,
            description: [],
          },
        ],
      };
    });
  };

  const handleRemoveExperience = (id) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        experience: (prev.experience || []).filter((item) => item.id !== id),
      };
    });
  };

  // Dynamic Array Helpers: Certifications
  const handleCertChange = (id, field, val) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        certifications: (prev.certifications || []).map((item) =>
          item.id === id ? { ...item, [field]: val } : item
        ),
      };
    });
  };

  const handleAddCert = () => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        certifications: [
          ...(prev.certifications || []),
          {
            id: crypto.randomUUID(),
            name: '',
            issuer: '',
            date: '',
            link: '',
          },
        ],
      };
    });
  };

  const handleRemoveCert = (id) => {
    setCurrentResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        certifications: (prev.certifications || []).filter((item) => item.id !== id),
      };
    });
  };

  const tabClass = (tabId) =>
    `px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
      activeTab === tabId
        ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400'
        : 'border-transparent text-slate-400 hover:text-slate-705'
    }`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950/20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-55 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold transition-all ${
          toastMessage.isError
            ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900'
        }`}>
          {toastMessage.text}
        </div>
      )}

      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 no-print shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 border border-slate-200 dark:border-slate-855 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={currentResume.title || 'Untitled Resume'}
              onChange={(e) => updateTitle(e.target.value)}
              className="text-sm md:text-base font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-transparent hover:border-slate-350 focus:border-indigo-500 focus:outline-none w-full max-w-xs md:max-w-md px-1 truncate"
            />
            <div className="text-[10px] text-slate-400 font-semibold px-1 mt-0.5">
              {saveStatus === 'saving' ? 'Saving draft...' : saveStatus === 'saved' ? 'Saved' : 'Auto-save draft active'}
            </div>
          </div>
        </div>

        {/* Action button nodes */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end builder-toolbar">
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="px-3 py-2 border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 hover:bg-indigo-55 text-indigo-650 dark:text-indigo-400 font-bold text-xs rounded-lg transition"
          >
            Load Sample Data
          </button>

          <button
            type="button"
            onClick={() => {
              if (hasExistingData() && !window.confirm('This will replace your current resume data. Do you want to continue?')) {
                return;
              }
              setShowUploadModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-lg transition"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-500" />
            Upload Resume
          </button>

          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition"
            title="Export JSON Backup"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-indigo-500" />
            Export Backup
          </button>

          <button
            type="button"
            onClick={handleImportBackupClick}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition"
            title="Import JSON Backup"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-500" />
            Import Backup
          </button>
          <input
            ref={backupFileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportBackupFileChange}
            className="hidden"
          />

          <select
            value={currentResume.template || 'modern'}
            onChange={(e) => updateTemplate(e.target.value)}
            className="text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 capitalize focus:outline-none"
          >
            <option value="modern">Modern</option>
            <option value="ats">ATS Friendly</option>
            <option value="creative">Creative</option>
          </select>

          <button
            type="button"
            onClick={() => setShowScoreModal(true)}
            className="flex items-center gap-1 px-3 py-2 border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-655 dark:text-indigo-400 font-bold text-xs rounded-lg transition"
          >
            <Award className="w-3.5 h-3.5" />
            Score
          </button>

          <button
            type="button"
            onClick={() => setShowJobMatchModal(true)}
            className="flex items-center gap-1 px-3 py-2 border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-655 dark:text-indigo-400 font-bold text-xs rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-550 shrink-0" />
            Match with Job Description
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition"
          >
            Save
          </button>

          <div className="relative" ref={downloadDropdownRef}>
            <button
              type="button"
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="flex items-center gap-1 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs rounded-lg shadow-md transition"
            >
              <Download className="w-3.5 h-3.5" />
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
      </header>

      {/* 2. Main Builder Body Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-65px)] builder-layout">
        {/* Left Form pane (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col no-print">
          {/* Tabs header list */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto scrollbar-none">
            <button type="button" onClick={() => setActiveTab('personal')} className={tabClass('personal')}>Personal</button>
            <button type="button" onClick={() => setActiveTab('summary')} className={tabClass('summary')}>Summary</button>
            <button type="button" onClick={() => setActiveTab('education')} className={tabClass('education')}>Education</button>
            <button type="button" onClick={() => setActiveTab('skills')} className={tabClass('skills')}>Skills</button>
            <button type="button" onClick={() => setActiveTab('projects')} className={tabClass('projects')}>Projects</button>
            <button type="button" onClick={() => setActiveTab('experience')} className={tabClass('experience')}>Experience</button>
            <button type="button" onClick={() => setActiveTab('certifications')} className={tabClass('certifications')}>Certifications</button>
            <button type="button" onClick={() => setActiveTab('languages')} className={tabClass('languages')}>Languages</button>
          </div>

          {/* Form scroll inputs */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* 1. Personal Information */}
            {activeTab === 'personal' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-white uppercase tracking-wider">Personal Info</h3>
                <FormInput
                  label="Full Name"
                  id="fullName"
                  placeholder="e.g. John Doe"
                  value={currentResume.personalInfo?.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                />
                <FormInput
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="e.g. johndoe@example.com"
                  value={currentResume.personalInfo?.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                />
                <FormInput
                  label="Phone Number"
                  id="phone"
                  placeholder="e.g. +1 (555) 000-0000"
                  value={currentResume.personalInfo?.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                />
                <FormInput
                  label="Location"
                  id="location"
                  placeholder="e.g. San Francisco, CA"
                  value={currentResume.personalInfo?.location}
                  onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                />
                <FormInput
                  label="GitHub URL"
                  id="github"
                  placeholder="e.g. https://github.com/username"
                  value={currentResume.links?.github || currentResume.personalInfo?.github}
                  onChange={(e) => handleLinksChange('github', e.target.value)}
                />
                <FormInput
                  label="LinkedIn URL"
                  id="linkedin"
                  placeholder="e.g. https://linkedin.com/in/username"
                  value={currentResume.links?.linkedin || currentResume.personalInfo?.linkedin}
                  onChange={(e) => handleLinksChange('linkedin', e.target.value)}
                />
                <FormInput
                  label="Portfolio Link"
                  id="portfolio"
                  placeholder="e.g. https://yourwebsite.com"
                  value={currentResume.links?.portfolio || currentResume.personalInfo?.portfolio}
                  onChange={(e) => handleLinksChange('portfolio', e.target.value)}
                />
                <FormInput
                  label="Profile Photo URL"
                  id="photo"
                  placeholder="e.g. Image URL or Base64 String"
                  value={currentResume.personalInfo?.photo}
                  onChange={(e) => handlePersonalInfoChange('photo', e.target.value)}
                />
              </div>
            )}

            {/* 2. Professional Summary */}
            {activeTab === 'summary' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-855 dark:text-white uppercase tracking-wider">Summary & Objective</h3>
                  <button
                    type="button"
                    onClick={handleImproveSummary}
                    disabled={loadingAi.summary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 font-bold text-xs rounded-lg transition border border-indigo-200/50"
                  >
                    {loadingAi.summary ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-indigo-550" />
                    )}
                    Generate Professional Summary
                  </button>
                </div>
                <FormTextarea
                  label="Career Objective Summary"
                  id="summary-textarea"
                  placeholder="Describe your qualifications, key achievements, and target role..."
                  value={currentResume.summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  rows={8}
                />
              </div>
            )}

            {/* 3. Education */}
            {activeTab === 'education' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Education</h3>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </button>
                </div>
                {currentResume.education?.map((edu) => (
                  <div key={edu.id} className="border border-slate-200 dark:border-slate-850 p-4 rounded-xl flex flex-col gap-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <FormInput
                      label="Degree / Course"
                      id={`edu-degree-${edu.id}`}
                      placeholder="e.g. B.S. in Computer Science"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                    />
                    <FormInput
                      label="Institution / University"
                      id={`edu-inst-${edu.id}`}
                      placeholder="e.g. Stanford University"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                    />
                    <FormInput
                      label="Location"
                      id={`edu-loc-${edu.id}`}
                      placeholder="e.g. Stanford, CA"
                      value={edu.location}
                      onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Start Year"
                        id={`edu-start-${edu.id}`}
                        placeholder="e.g. 2018"
                        value={edu.startYear}
                        onChange={(e) => handleEducationChange(edu.id, 'startYear', e.target.value)}
                      />
                      <FormInput
                        label="End Year"
                        id={`edu-end-${edu.id}`}
                        placeholder="e.g. 2022"
                        value={edu.endYear}
                        onChange={(e) => handleEducationChange(edu.id, 'endYear', e.target.value)}
                      />
                    </div>
                    <FormInput
                      label="Score / CGPA / Percentage"
                      id={`edu-grade-${edu.id}`}
                      placeholder="e.g. 3.9 GPA or 85%"
                      value={edu.percentage}
                      onChange={(e) => handleEducationChange(edu.id, 'percentage', e.target.value)}
                    />
                  </div>
                ))}
                {(!currentResume.education || currentResume.education.length === 0) && (
                  <p className="text-xs text-slate-450 italic text-center py-4">No education entries added yet.</p>
                )}
              </div>
            )}

            {/* 4. Skills */}
            {activeTab === 'skills' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Skills</h3>
                  <button
                    type="button"
                    onClick={handleSuggestSkills}
                    disabled={loadingAi.skills}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 hover:text-indigo-705 dark:text-indigo-400 font-bold text-xs rounded-lg transition border border-indigo-200/50"
                  >
                    {loadingAi.skills ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-indigo-550" />
                    )}
                    Suggest Skills
                  </button>
                </div>
                
                <TagInput
                  value={currentResume.skills}
                  onChange={(tags) => updateSection('skills', tags)}
                  placeholder="Type a skill and press Enter"
                  suggestions={skillSuggestions}
                  sectionLabel="Skills"
                />
              </div>
            )}

            {/* 5. Projects */}
            {activeTab === 'projects' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Projects</h3>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>
                {currentResume.projects?.map((proj) => (
                  <div key={proj.id} className="border border-slate-200 dark:border-slate-855 p-4 rounded-xl flex flex-col gap-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(proj.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-505 font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <FormInput
                      label="Project Title"
                      id={`proj-title-${proj.id}`}
                      placeholder="e.g. AI Resume Forge Builder"
                      value={proj.title}
                      onChange={(e) => handleProjectChange(proj.id, 'title', e.target.value)}
                    />
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Tech Stack
                      </label>
                      <TagInput
                        value={proj.techStack}
                        onChange={(tags) => handleProjectChange(proj.id, 'techStack', tags)}
                        placeholder="Type a tech stack and press Enter"
                        suggestions={skillSuggestions}
                        sectionLabel="Tech Stack"
                      />
                    </div>

                    <FormInput
                      label="GitHub Link"
                      id={`proj-git-${proj.id}`}
                      placeholder="e.g. https://github.com/user/project"
                      value={proj.github}
                      onChange={(e) => handleProjectChange(proj.id, 'github', e.target.value)}
                    />
                    <FormInput
                      label="Live Demo Link"
                      id={`proj-live-${proj.id}`}
                      placeholder="e.g. https://project.com"
                      value={proj.liveDemo}
                      onChange={(e) => handleProjectChange(proj.id, 'liveDemo', e.target.value)}
                    />
                    
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Description
                        </label>
                        <button
                          type="button"
                          onClick={() => handleImproveProjectDescription(proj.id)}
                          disabled={loadingAi[`project_${proj.id}`]}
                          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 hover:text-indigo-700 text-[10px] font-bold rounded-md transition border border-indigo-250/30"
                        >
                          {loadingAi[`project_${proj.id}`] ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-indigo-550" />
                          )}
                          Improve Project Description
                        </button>
                      </div>
                      <FormTextarea
                        id={`proj-desc-${proj.id}`}
                        placeholder="Explain project details, features, architecture..."
                        value={proj.description}
                        onChange={(e) => handleProjectChange(proj.id, 'description', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                ))}
                {(!currentResume.projects || currentResume.projects.length === 0) && (
                  <p className="text-xs text-slate-450 italic text-center py-4">No projects added yet.</p>
                )}
              </div>
            )}

            {/* 6. Experience */}
            {activeTab === 'experience' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Experience & Internships</h3>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-650 hover:text-indigo-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </button>
                </div>
                {currentResume.experience?.map((exp) => (
                  <div key={exp.id} className="border border-slate-200 dark:border-slate-855 p-4 rounded-xl flex flex-col gap-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <FormInput
                      label="Company Name"
                      id={`exp-company-${exp.id}`}
                      placeholder="e.g. Google"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                    />
                    <FormInput
                      label="Role Designation"
                      id={`exp-role-${exp.id}`}
                      placeholder="e.g. Software Engineer"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                    />
                    <FormInput
                      label="Location"
                      id={`exp-loc-${exp.id}`}
                      placeholder="e.g. Mountain View, CA"
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                    />
                    
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                      <input
                        type="checkbox"
                        id={`exp-current-${exp.id}`}
                        checked={!!exp.currentlyWorking}
                        onChange={(e) => handleExperienceChange(exp.id, 'currentlyWorking', e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 border-slate-350 focus:ring-indigo-500"
                      />
                      <label htmlFor={`exp-current-${exp.id}`} className="text-xs font-bold text-slate-600 dark:text-slate-300 select-none">
                        Currently working here
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Start Date"
                        id={`exp-start-${exp.id}`}
                        placeholder="e.g. Jan 2022"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                      />
                      {!exp.currentlyWorking && (
                        <FormInput
                          label="End Date"
                          id={`exp-end-${exp.id}`}
                          placeholder="e.g. Present"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                        />
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Bullet Achievements
                        </label>
                        <button
                          type="button"
                          onClick={() => handleGenerateExperienceBullets(exp.id)}
                          disabled={loadingAi[`experience_${exp.id}`]}
                          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-655 hover:text-indigo-705 text-[10px] font-bold rounded-md transition border border-indigo-250/30"
                        >
                          {loadingAi[`experience_${exp.id}`] ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-indigo-550" />
                          )}
                          Generate Experience Bullets
                        </button>
                      </div>
                      
                      <BulletInput
                        value={exp.description}
                        onChange={(bullets) => handleExperienceChange(exp.id, 'description', bullets)}
                        placeholder="Type an achievement and press Enter"
                      />
                    </div>
                  </div>
                ))}
                {(!currentResume.experience || currentResume.experience.length === 0) && (
                  <p className="text-xs text-slate-450 italic text-center py-4">No experience entries added yet.</p>
                )}
              </div>
            )}

            {/* 7. Certifications */}
            {activeTab === 'certifications' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-805 dark:text-white uppercase tracking-wider">Certifications</h3>
                  <button
                    type="button"
                    onClick={handleAddCert}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-705"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Certificate
                  </button>
                </div>
                {currentResume.certifications?.map((cert) => (
                  <div key={cert.id} className="border border-slate-200 dark:border-slate-850 p-4 rounded-xl flex flex-col gap-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(cert.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-505 font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <FormInput
                      label="Certificate Name"
                      id={`cert-name-${cert.id}`}
                      placeholder="e.g. AWS Solutions Architect"
                      value={cert.name}
                      onChange={(e) => handleCertChange(cert.id, 'name', e.target.value)}
                    />
                    <FormInput
                      label="Issuer Organization"
                      id={`cert-issuer-${cert.id}`}
                      placeholder="e.g. Amazon Web Services"
                      value={cert.issuer}
                      onChange={(e) => handleCertChange(cert.id, 'issuer', e.target.value)}
                    />
                    <FormInput
                      label="Date Certified"
                      id={`cert-date-${cert.id}`}
                      placeholder="e.g. June 2024"
                      value={cert.date}
                      onChange={(e) => handleCertChange(cert.id, 'date', e.target.value)}
                    />
                    <FormInput
                      label="Credential Link"
                      id={`cert-link-${cert.id}`}
                      placeholder="e.g. https://aws.amazon.com/verify/..."
                      value={cert.link}
                      onChange={(e) => handleCertChange(cert.id, 'link', e.target.value)}
                    />
                  </div>
                ))}
                {(!currentResume.certifications || currentResume.certifications.length === 0) && (
                  <p className="text-xs text-slate-450 italic text-center py-4">No certifications added yet.</p>
                )}
              </div>
            )}

            {/* 8. Languages */}
            {activeTab === 'languages' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Languages</h3>
                
                <TagInput
                  value={currentResume.languages}
                  onChange={(tags) => updateSection('languages', tags)}
                  placeholder="Type a language and press Enter"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Preview pane (7 cols) - STICKY Preview */}
        <div className="lg:col-span-7 bg-slate-200/40 dark:bg-slate-950/20 flex justify-center py-6 px-4 overflow-y-auto lg:h-[calc(100vh-65px)] h-auto resume-preview-wrapper">
          {/* Sized container mapping ID so PDF generator captures this wrapper block */}
          <div 
            className="origin-top scale-[0.8] md:scale-[0.85] lg:scale-[0.9] xl:scale-[1] transition-all bg-white shadow-xl h-fit border border-slate-100 select-text screen-preview-scale"
            style={{ '--preview-scale': previewScale }}
          >
            <ResumePreview resumeData={currentResume} />
          </div>
        </div>
      </div>

      {/* Score Check Analysis Modal */}
      <ResumeScore
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        resume={currentResume}
        onFixField={handleFixField}
      />

      {/* Job Description ATS Matcher Modal */}
      <JobMatchModal
        isOpen={showJobMatchModal}
        onClose={() => setShowJobMatchModal(false)}
        resumeData={currentResume}
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

export default Builder;
