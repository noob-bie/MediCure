import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, 
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("Axios Interceptor - Token:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Axios Interceptor - Authorization Header:", config.headers.Authorization);
    }
    return config;
});

export default axiosInstance;
