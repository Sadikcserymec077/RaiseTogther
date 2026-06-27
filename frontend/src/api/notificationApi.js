import axiosInstance from './axiosInstance';

export const notificationApi = {
  getNotifications: (page = 0, size = 10) =>
    axiosInstance.get(`/notifications?page=${page}&size=${size}`),
    
  getUnreadCount: () =>
    axiosInstance.get('/notifications/unread-count'),
    
  markAsRead: (id) =>
    axiosInstance.put(`/notifications/${id}/read`),
    
  markAllAsRead: () =>
    axiosInstance.put('/notifications/read-all'),
    
  deleteNotification: (id) =>
    axiosInstance.delete(`/notifications/${id}`),
};
