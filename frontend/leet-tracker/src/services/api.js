import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🌐 API Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method.toUpperCase(),
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: `${response.config.baseURL}${response.config.url}`,
      method: response.config.method.toUpperCase(),
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.baseURL + error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      message: error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  getUserStats: () => api.get('/userstats'),
  updateProfile: (userData) => api.put('/user', userData),
};

export const platformsAPI = {
  getPlatforms: () => api.get('/platforms'),
  createPlatform: (data) => api.post('/platforms', data),
};

export const tagsAPI = {
  getTags: () => api.get('/tags'),
  createTag: (data) => api.post('/tags', data),
};

export const problemsAPI = {
  getProblems: () => api.get('/problems'),
  getProblem: (id) => api.get(`/problems/${id}`),
  createProblem: (data) => api.post('/problems', data),
  updateProblem: (id, data) => api.put(`/problems/${id}`, data),
  deleteProblem: (id) => api.delete(`/problems/${id}`),
  getAllProblems: (params) => api.get('/problems', { params }),
  countProblems: () => api.get('/problems/count'),
};

export const solutionsAPI = {
  getSolutions: () => api.get('/solutions'),
  getSolution: (id) => api.get(`/solutions/${id}`),
  createSolution: (data) => api.post('/solutions', data),
  updateSolution: (id, data) => api.put(`/solutions/${id}`, data),
  getSolutionsWithFilters: (params) => api.get('/solutions', { params }),
  deleteSolution: (id) => api.delete(`/solutions/${id}`),
};

export default api; 
 
