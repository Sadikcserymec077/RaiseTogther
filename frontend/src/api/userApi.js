import axiosInstance from './axiosInstance';

export const userApi = {
  getMe: () => axiosInstance.get('/users/me'),
  updateProfile: (data) => axiosInstance.put('/users/me', data),
  changePassword: (data) => axiosInstance.put('/users/me/password', data),
  uploadAvatar: (formData) => 
    axiosInstance.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getUserById: (id) => axiosInstance.get(`/users/${id}`),
};
