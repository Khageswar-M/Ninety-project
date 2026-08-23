import axios from "axios";
import api from "../api";


export const sendOtpMail = async (toEmail, fullName) => {
    const response = await api.post("/api/v1/auth/send-otp",{
        toEmail,
        fullName
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