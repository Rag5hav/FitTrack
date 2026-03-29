import axiosInstance from '../api/axiosConfig';

export const getWorkouts = async () => {
    const response = await axiosInstance.get('/workouts');
    return response.data;
};

export const addWorkout = async (workoutData) => {
    const response = await axiosInstance.post('/workouts', workoutData);
    return response.data;
};

export const deleteWorkout = async (id) => {
    const response = await axiosInstance.delete(`/workouts/${id}`);
    return response.data;
};
