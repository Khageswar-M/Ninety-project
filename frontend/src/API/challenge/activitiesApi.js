import api from "../api";

const ACTIVITY_BASE_URL = "/api/v1/activity"

export const addActivity = async (challengeId, title) => {
    const response = await api.post(ACTIVITY_BASE_URL+"/create", {
        challengeId , title
    });

    return response.data;
}

export const getActivities = async (challengeId, dayNumber) => {
    const response = await api.get(ACTIVITY_BASE_URL +`/${challengeId}/days/${dayNumber}`);
    return response.data;
}

export const updateActivity = async (activityId, newTitle) => {
    const response = await api.patch(ACTIVITY_BASE_URL + "/update", {
        activityId, newTitle
    });

    return response.data;
}

export const deleteActivity = async(activityId) => {
    const response = await api.delete(ACTIVITY_BASE_URL + `/delete/${activityId}`);

    return response.data;
}

