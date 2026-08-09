// src/Services/apiClient.js
import axios from "axios";
import Cookies from "js-cookie";
import { getSecureCookie } from "../Helper/cookieUtils";
const apiClient = axios.create({
  baseURL: "https://localhost:7173/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: وظيفتها تقفش أي طلب رايح للـ API وتحط فيه الـ Token لو موجود
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
