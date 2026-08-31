import api from "../api";

const SETTING_URL = '/api/v1/settings'

export const getSettings = () => {
    const response = api.get(SETTING_URL);
    return response;
}

export const toggleDailyReminder = async () => {
    const response = await api.put(SETTING_URL + '/toggle-daily-reminder');
    return response;
}

export const updateReminderTime = async (newTime) => {
    const response = await api.put(SETTING_URL + `/daily-reminder/${newTime}`);
    return response;
}

export const toggleAiCoachDigest = async () => {
    const response = await api.put(SETTING_URL + '/toggle-ai-coach');
    return response;
}

export const toggleMileStone = async () => {
    const response = await api.put(SETTING_URL + '/toggle-mile-stone');
    return response;
}

export const updateTheme = async (newTheme) => {
    const response = await api.put(SETTING_URL + `/theme/${newTheme}`);
    return response;
}