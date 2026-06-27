import axiosInstance from './axiosInstance';

export const campaignApi = {
  getCampaigns: (params) => axiosInstance.get('/campaigns', { params }),
  getCampaignById: (id) => axiosInstance.get(`/campaigns/${id}`),
  getFeaturedCampaigns: () => axiosInstance.get('/campaigns/featured'),
  getTrendingCampaigns: () => axiosInstance.get('/campaigns/trending'),
  getEndingSoonCampaigns: () => axiosInstance.get('/campaigns/ending-soon'),
  getMyCampaigns: (params) => axiosInstance.get('/campaigns/my', { params }),
  searchCampaigns: (q, params) => axiosInstance.get('/campaigns', { params: { search: q, ...params } }),

  createCampaign: (formData) => axiosInstance.post('/campaigns', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  updateCampaign: (id, data) => axiosInstance.put(`/campaigns/${id}`, data),
  deleteCampaign: (id) => axiosInstance.delete(`/campaigns/${id}`),
  pauseCampaign: (id) => axiosInstance.put(`/campaigns/${id}/pause`),
  resumeCampaign: (id) => axiosInstance.put(`/campaigns/${id}/resume`),

  addCampaignImage: (id, formData) => axiosInstance.post(`/campaigns/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteCampaignImage: (id, imageId) => axiosInstance.delete(`/campaigns/${id}/images/${imageId}`),

  postCampaignUpdate: (id, data) => axiosInstance.post(`/campaigns/${id}/updates`, data),
  getCampaignUpdates: (id) => axiosInstance.get(`/campaigns/${id}/updates`),

  // Admin
  getPendingCampaigns: (params) => axiosInstance.get('/admin/campaigns/pending', { params }),
  getAllAdminCampaigns: (params) => axiosInstance.get('/admin/campaigns', { params }),
  approveCampaign: (id) => axiosInstance.put(`/admin/campaigns/${id}/approve`),
  rejectCampaign: (id, data) => axiosInstance.put(`/admin/campaigns/${id}/reject`, data),
  toggleFeatured: (id) => axiosInstance.put(`/admin/campaigns/${id}/feature`),
  expireCampaign: (id) => axiosInstance.put(`/admin/campaigns/${id}/expire`),
  forceDeleteCampaign: (id) => axiosInstance.delete(`/admin/campaigns/${id}`),
};
