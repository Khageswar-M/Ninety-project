import api from "../api";

const GOAL_API = "/api/v1/goal";

export const createGoal = async (title) => {
    const response = await api.post(`${GOAL_API}/create/${encodeURIComponent(title)}`);
    return response;
};

export const updateGoal = async (goalId, newTitle) => {
    const response = await api.put(`${GOAL_API}/update/${goalId}/${encodeURIComponent(newTitle)}`);
    return response;
};

export const deleteGoal = async (goalId) => {
    const response = await api.delete(`${GOAL_API}/delete/${goalId}`);
    return response;
};

export const getAllGoals = async (userId) => {
    const response = await api.get(`${GOAL_API}/${userId}`);
    return response;
};

export const updateGoalStatus = async (goalId, status) => {
    const response = await api.put(`${GOAL_API}/update/status/${goalId}/${status}`);
    return response;
};