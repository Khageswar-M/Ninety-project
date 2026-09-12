import axios from "axios";
import Toast from "react-native-toast-message";

export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000
});

// Global response interceptor
api.interceptors.response.use(
    (response) => {
        // normal response
        return response;
    },

    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 429) {
                Toast.show({
                    type: "error",
                    text1: "Limit reached",
                    text2: error.response?.data?.message ??
                        "Too many requests. Please try again later.",
                    position: "bottom",
                    visibilityTime: 4000,
                });
            }
        }

        // let the original error continue to the API caller.
        return Promise.reject(error);
    }
);

export default api;