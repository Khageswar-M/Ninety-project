import axios from "axios";
import api from "../api";


export const sendOtpMail = async (toEmail, fullName) => {
    console.log("api call")

    const response = await api.post("/api/v1/auth/send-otp",{
        toEmail,
        fullName
    });
    // console.log(response);

    return response.data;
}

export const sendOtpMailForForgetPwd = async (toEmail) => {
    const response = await api.post(`/api/v1/auth/send-forget-password-otp`, null, {
        params: { toEmail },
    });

    return response.data;
}

export const verifyOtp = async (email, otp) =>{
    const response = await api.post("/api/v1/auth/verify-otp",{
        email,
        otp
    });

    return response;
}

export const signUp = async (email, fullName, password) => {
    const response = await api.post("/api/v1/auth/register",{
        email,
        fullName,
        password
    });

    return response;
}

export const login = async (email, password) => {
    const response = await api.post("/api/v1/auth/login",{
        email,
        password
    });

    return response;
}

export const logout = async () => {
  try {
    const response = await api.post("/api/v1/auth/logout");

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    throw error;
  }
};


export const updatePassword = async (email, password) => {
    const response = await api.post("/api/v1/auth/update-password",{
        email,
        password
    })

    return response;
}