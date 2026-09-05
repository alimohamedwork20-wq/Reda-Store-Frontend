// src/Services/apiClient.js
import axios from "axios";
import Cookies from "js-cookie";
import { getSecureCookie } from "../Helper/cookieUtils";
const apiClient = axios.create({
  baseURL: "https://redastore.somee.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getSecureCookie("tth_1854");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
