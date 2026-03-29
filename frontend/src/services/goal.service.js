import axiosInstance from '../api/axiosConfig';

export const getUserGoal = async () => {
    const response = await axiosInstance.get('/goals');
    return response.data;
};

export const setOrUpdateGoal = async (goalData) => {
    const response = await axiosInstance.post('/goals', goalData);
    return response.data;
};

export const getAiFeedback = async () => {
    const response = await axiosInstance.get('/progress/ai-feedback');
    return response.data;
};

export const postChatQuery = async (message) => {
    const response = await axiosInstance.post('/progress/chat', { message });
    return response.data;
};
