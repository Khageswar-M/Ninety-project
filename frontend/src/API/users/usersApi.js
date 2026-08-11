import axios from "axios";
import api from "../api";

export const isUserExists = async (email) => {
    const response = await api.get(`/api/v1/users/exists`, { params: { email } });
    return response.data.data;
}