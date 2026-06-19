import api from './api.js';

export const authService = {
  register: async (name, email, password) => {
    const data = await api.post('/auth/register', { name, email, password });
    if (data.token) {
      localStorage.setItem('resumeforge_token', data.token);
      localStorage.setItem('resumeforge_user', JSON.stringify({ name: data.name, email: data.email }));
      window.dispatchEvent(new Event('auth-change'));
    }
    return data;
  },

  login: async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('resumeforge_token', data.token);
      localStorage.setItem('resumeforge_user', JSON.stringify({ name: data.name, email: data.email }));
      window.dispatchEvent(new Event('auth-change'));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('resumeforge_token');
    localStorage.removeItem('resumeforge_user');
    window.dispatchEvent(new Event('auth-change'));
  },

  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },
};
export default authService;
