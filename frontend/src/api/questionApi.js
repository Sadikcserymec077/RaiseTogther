import axiosInstance from './axiosInstance';

export const questionApi = {
  getQuestions: (campaignId, page = 0, size = 10) =>
    axiosInstance.get(`/questions/campaign/${campaignId}?page=${page}&size=${size}`),
    
  postQuestion: (campaignId, title, content) =>
    axiosInstance.post(`/questions/campaign/${campaignId}`, { title, content }),
    
  answerQuestion: (questionId, answer) =>
    axiosInstance.post(`/questions/${questionId}/answer`, { answer }),
    
  deleteQuestion: (questionId) =>
    axiosInstance.delete(`/questions/${questionId}`),
};
