import axiosInstance from './axiosInstance';

export const commentApi = {
  getComments: (campaignId, page = 0, size = 10) =>
    axiosInstance.get(`/comments/campaign/${campaignId}?page=${page}&size=${size}`),
    
  postComment: (campaignId, content) =>
    axiosInstance.post(`/comments/campaign/${campaignId}`, { content }),
    
  postReply: (commentId, content) =>
    axiosInstance.post(`/comments/${commentId}/reply`, { content }),
    
  deleteComment: (commentId) =>
    axiosInstance.delete(`/comments/${commentId}`),
};
