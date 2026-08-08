import axios from "axios";

export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000
});

export default api;