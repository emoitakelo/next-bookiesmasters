// src/utils/axiosInstance.js
import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://api.bookiesmasters.com/api", // Change to your deployed URL if needed
// });

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:1000/api" // local Express
    : "https://api.bookiesmasters.com/api", // deployed backend
});

// Request interceptor: attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: handle 401 errors (token expired or invalid)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove invalid token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optional: alert user
      alert("Session expired. Please log in again.");

      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
