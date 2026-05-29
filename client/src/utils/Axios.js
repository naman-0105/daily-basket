import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_URL || '';
const normalizedBaseURL = typeof window !== 'undefined' && window.location.protocol === 'https:' && apiBaseURL.startsWith('http://')
    ? apiBaseURL.replace('http://', 'https://')
    : apiBaseURL;

const Axios = axios.create({
    baseURL: normalizedBaseURL,
    withCredentials: true
});

// Add request interceptor to attach token
Axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accesstoken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

Axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accesstoken');
            localStorage.removeItem('refreshToken');
        }
        return Promise.reject(error);
    }
);

export default Axios;