import api from './axiosInstance';

export const rewardApi = {
  createReward: (campaignId, data) => api.post(`/rewards/campaign/${campaignId}`, data),
  getRewardsForCampaign: (campaignId) => api.get(`/rewards/campaign/${campaignId}`),
  updateReward: (id, data) => api.put(`/rewards/${id}`, data),
  deleteReward: (id) => api.delete(`/rewards/${id}`),
};
