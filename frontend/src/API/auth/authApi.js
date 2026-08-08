import axios from "axios";
import api from "../api";


export const sendOtpMail = async (toEmail, fullName) => {
    const response = await api.post("/api/v1/auth/send-otp",{
        toEmail,
        fullName
    });

    return response.data;
}