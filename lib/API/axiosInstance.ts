import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { AuthAPI } from "./api";

console.log("API Base URL:", process.env.BASE_URL);

const token = AuthAPI.getAccessToken();
const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("API Base URL:", BaseUrl);

const api = axios.create({
  baseURL: BaseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  withCredentials: true,
});

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

api.interceptors.request.use(
  (config) => {
    const token = AuthAPI.getAccessToken();
    console.log("Token from interceptor:", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
