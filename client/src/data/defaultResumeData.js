export const defaultResumeData = {
  title: "Untitled Resume",
  template: "modern",
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    portfolio: "",
    photo: ""
  },
  summary: "",
  education: [
    {
      degree: "",
      institution: "",
      location: "",
      startYear: "",
      endYear: "",
      percentage: ""
    }
  ],
  skills: [],
  projects: [
    {
      title: "",
      techStack: [],
      description: "",
      github: "",
      liveDemo: ""
    }
  ],
  experience: [
    {
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: []
    }
  ],
  certifications: [
    {
      name: "",
      issuer: "",
      date: "",
      link: ""
    }
  ],
  languages: [],
  links: {
    github: "",
    linkedin: "",
    portfolio: ""
  }
};

export default defaultResumeData;
