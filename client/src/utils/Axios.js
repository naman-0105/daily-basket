import axios from 'axios';

const Axios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
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

export default Axios;