import axiosInstance from './axiosInstance';

export const authApi = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  logout: () => axiosInstance.post('/auth/logout'),
  forgotPassword: (data) => axiosInstance.post('/auth/forgot-password', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  verifyEmail: (token) => axiosInstance.get(`/auth/verify-email?token=${token}`),
};
