import api from "../api";

export const getChallenges = async (userId) => {
    const response = await api.get(`/api/v1/challenge/challenges-by-userId/${userId}`);
    return response.data;
}