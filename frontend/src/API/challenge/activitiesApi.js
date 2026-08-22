import axios from "axios";
import api from "../api";

const ACTIVITY_BASE_URL = "/api/v1/activity"

export const addActivity = async (challengeId, title) => {
    const response = await api.post(ACTIVITY_BASE_URL+"/create", {
        challengeId , title
    });

    return response.data;
}