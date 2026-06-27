import api from './axiosInstance';

export const donationApi = {
  initiateDonation: (data) => api.post('/donations/initiate', data),
  verifyPayment: (data) => api.post('/donations/verify', data),
  getDonationHistory: (page = 0, size = 10) =>
    api.get(`/donations?page=${page}&size=${size}`),
  getDonationById: (id) => api.get(`/donations/${id}`),
  getCampaignDonations: (campaignId, page = 0, size = 10) =>
    api.get(`/donations/campaign/${campaignId}?page=${page}&size=${size}`),
  getCampaignDonationStats: (campaignId) =>
    api.get(`/donations/campaign/${campaignId}/stats`),
  downloadReceipt: (donationId) =>
    api.get(`/donations/${donationId}/receipt`, { responseType: 'blob' }),
  emailReceipt: (donationId) =>
    api.get(`/donations/${donationId}/receipt/email`),
};
