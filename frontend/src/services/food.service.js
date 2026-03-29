import axiosInstance from '../api/axiosConfig';

export const getDailyFoodLogs = async (date) => {
    const response = await axiosInstance.get(`/food`, { params: { date } });
    return response.data;
};

export const getAllFoodLogs = async () => {
    const response = await axiosInstance.get(`/food/all`);
    return response.data;
};

export const estimateFoodCalories = async (foodName) => {
    const response = await axiosInstance.post('/progress/estimate-calories', { food: foodName });
    return response.data;
};

export const getDailyTotalCalories = async (date) => {
    const response = await axiosInstance.get(`/food/calories`, { params: { date } });
    return response.data;
};

export const addFoodLog = async (foodData) => {
    const response = await axiosInstance.post('/food', foodData);
    return response.data;
};

export const deleteFoodLog = async (id) => {
    const response = await axiosInstance.delete(`/food/${id}`);
    return response.data;
};
