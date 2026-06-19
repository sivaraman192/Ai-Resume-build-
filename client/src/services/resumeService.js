import api from './api.js';

export const resumeService = {
  getAllResumes: async () => {
    return await api.get('/resumes');
  },

  getResumeById: async (id) => {
    return await api.get(`/resumes/${id}`);
  },

  createResume: async (title, template = 'modern') => {
    return await api.post('/resumes', { title, template });
  },

  updateResume: async (id, resumeData) => {
    return await api.put(`/resumes/${id}`, resumeData);
  },

  deleteResume: async (id) => {
    return await api.delete(`/resumes/${id}`);
  },

  restoreVersion: async (id, versionId) => {
    return await api.post(`/resumes/${id}/restore`, { versionId });
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return await api.postForm('/resumes/upload', formData);
  },
};

export default resumeService;
