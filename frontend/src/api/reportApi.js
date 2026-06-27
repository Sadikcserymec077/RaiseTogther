import axiosInstance from './axiosInstance';

export const reportApi = {
  reportCampaign: (campaignId, reason, description) =>
    axiosInstance.post(`/reports/campaign/${campaignId}`, { reason, description }),
    
  getReports: (page = 0, size = 10, status = '') => {
    let url = `/reports?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    return axiosInstance.get(url);
  },
    
  updateReportStatus: (reportId, status, remarks) =>
    axiosInstance.put(`/reports/${reportId}/status`, null, {
      params: { status, remarks }
    }),
};
