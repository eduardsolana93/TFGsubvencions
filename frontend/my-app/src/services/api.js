import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getDepartaments = async () => {
    const response = await api.get('/departaments');
    return response.data;
};

export const getPartidaQuantitat = async (query) => {
    const response = await api.get(`/partides?search=${query}`);
    return response.data;
};

export const verifyToken = async (token) => {
    const response = await api.post('/users/verify-token', { token });
    return response.data;
};

export default api;

