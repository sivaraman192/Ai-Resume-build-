const API_BASE_URL = 'https://ai-resume-build-3748.onrender.com/api';

const getHeaders = () => {
  const token = localStorage.getItem('resumeforge_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const data = await response.json();
      errorMsg = data.message || errorMsg;
    } catch (e) {
      // Ignore parse errors on failure
    }

    if (response.status === 401) {
      // Clear token and redirect if session expires
      localStorage.removeItem('resumeforge_token');
      localStorage.removeItem('resumeforge_user');
      window.dispatchEvent(new Event('auth-change'));
    }

    throw new Error(errorMsg);
  }

  // Handle DELETE or empty responses
  if (response.status === 204) {
    return null;
  }

  return await response.json();
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  postForm: async (endpoint, formData) => {
    const headers = getHeaders();
    delete headers['Content-Type']; // Browser will set boundary automatically
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
export default api;
