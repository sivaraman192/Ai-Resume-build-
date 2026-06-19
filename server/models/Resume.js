import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  institution: { type: String, default: '' },
  location: { type: String, default: '' },
  startYear: { type: String, default: '' },
  endYear: { type: String, default: '' },
  percentage: { type: String, default: '' },
});

const skillSchema = new mongoose.Schema({
  category: { type: String, default: '' },
  items: { type: [String], default: [] },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  techStack: { type: [String], default: [] },
  description: { type: String, default: '' },
  github: { type: String, default: '' },
  liveDemo: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  currentlyWorking: { type: Boolean, default: false },
  description: { type: String, default: '' },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  link: { type: String, default: '' },
});

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Resume',
    },
    template: {
      type: String,
      required: true,
      default: 'modern', // 'modern', 'ats', 'creative'
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      photo: { type: String, default: '' }, // base64 or URL
    },
    summary: {
      type: String,
      default: '',
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    skills: {
      type: [skillSchema],
      default: [],
    },
    projects: {
      type: [projectSchema],
      default: [],
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    certifications: {
      type: [certificationSchema],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    resumeScore: {
      type: Number,
      default: 0,
    },
    versions: [
      {
        savedAt: { type: Date, default: Date.now },
        data: { type: Object }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
