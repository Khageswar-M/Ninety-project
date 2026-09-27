import api from "../api";

const CHALLENGE_BASE_URL = "/api/v1/challenge";

export const getChallenges = async (userId) => {
    const response = await api.get(CHALLENGE_BASE_URL + `/challenges-by-userId/${userId}`);
    return response.data;
}

export const createNewChallenge = async () => {
    const response = await api.post(CHALLENGE_BASE_URL + "/create-challenge");
    return response.data;
}