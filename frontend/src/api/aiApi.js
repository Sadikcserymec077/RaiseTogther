import axiosInstance from './axiosInstance';

export const fullAssist = (data) => axiosInstance.post('/ai/full-assist', data);
export const suggestTitle = (data) => axiosInstance.post('/ai/suggest-title', data);
export const improveDescription = (data) => axiosInstance.post('/ai/improve-description', data);
