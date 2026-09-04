import api from "../api";

const AI_API_BASE_URL = "/api/v1/ai-coach"

export const aiCoachSuggestion = async () => {
    const response = await api.get(AI_API_BASE_URL);
    return response;
}