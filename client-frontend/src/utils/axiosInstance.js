import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Or 'JWT ' + token, depending on your backend expectation
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;