import axiosInstance from './axiosInstance';

export const bookmarkApi = {
  addBookmark: (campaignId) => axiosInstance.post(`/bookmarks/${campaignId}`),
  removeBookmark: (campaignId) => axiosInstance.delete(`/bookmarks/${campaignId}`),
  getBookmarks: (params) => axiosInstance.get('/bookmarks', { params }),
  isBookmarked: (campaignId) => axiosInstance.get(`/bookmarks/${campaignId}/status`),
};
