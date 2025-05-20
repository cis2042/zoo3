import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; displayName?: string }) => 
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
};

// Tasks API
export const tasksAPI = {
  getAllTasks: () => 
    api.get('/tasks'),
  
  getTaskById: (id: string) => 
    api.get(`/tasks/${id}`),
  
  completeTask: (taskId: string) => 
    api.post(`/tasks/${taskId}/complete`),
  
  getCompletedTasks: () => 
    api.get('/tasks/user/completed'),
};

// Rewards API
export const rewardsAPI = {
  getLoginStreak: () => 
    api.get('/rewards/login-streak'),
  
  claimDailyReward: () => 
    api.post('/rewards/claim-daily'),
  
  getTransactions: () => 
    api.get('/rewards/transactions'),
};

// User API
export const userAPI = {
  getUserProfile: () => 
    api.get('/users/profile'),
  
  updateUserProfile: (data: { display_name?: string; avatar_url?: string }) => 
    api.put('/users/profile', data),
};

export default api;
