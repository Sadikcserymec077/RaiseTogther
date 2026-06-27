import axiosInstance from './axiosInstance';

export const leaderboardApi = {
  getTopDonors: (period = 'all') =>
    axiosInstance.get(`/leaderboard/top-donors?period=${period}`),
    
  getTopCampaigns: () =>
    axiosInstance.get('/leaderboard/top-campaigns'),
    
  getTopCreators: () =>
    axiosInstance.get('/leaderboard/top-creators'),
};
