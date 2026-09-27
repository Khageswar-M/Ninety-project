import axios from "axios";
import Toast from "react-native-toast-message";

import { store } from "../redux/store";
import { hydrateApp } from "../redux/slices/appSlice";
import { storage } from "../utils/storage";
// import { goToLogin } from "../utils/NavigationService";

export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000
});


let isLoggingOut = false;

// Global response interceptor
api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            //--------------
            // JWT expired / authentication invalid
            //--------------
            if (status === 401 && !isLoggingOut) {
                isLoggingOut = true;

                // Update Redux immediately -> Stack.Protected swaps to (auth) right away
                store.dispatch(hydrateApp({ isLogin: false }));

                // Clean up storage in the background, don't block the redirect on it
                storage.remove("@ninety_user")
                    .catch((logoutError) => {
                        console.error("Failed to clear stored user after 401:", logoutError);
                    })
                    .finally(() => {
                        isLoggingOut = false;
                    });
            }

            //---------------
            // Rate limit
            //---------------
            if (status === 429) {
                Toast.show({
                    type: "error",
                    text1: "Limit reached",
                    text2: error.response?.data?.message ?? "Too many requests. Please try again later.",
                    position: "bottom",
                    visibilityTime: 4000,
                });
            }
        }

        return Promise.reject(error);
    }
);

export default api;