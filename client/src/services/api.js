import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Progress APIs
export const getProgress = async () => {
  const response = await api.get('/progress');
  return response.data;
};

export const toggleQuestion = async (question) => {
  const response = await api.post('/progress/toggle', { question });
  return response.data;
};

export const bulkUpdateProgress = async (completedQuestions) => {
  const response = await api.post('/progress/bulk-update', { completedQuestions });
  return response.data;
};

export default api;