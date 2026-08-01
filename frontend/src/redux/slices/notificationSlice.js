import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dailyRemainder: false,
    remainderTime: new Date().toISOString(),
    aiCoachDigest: false,
    milestoneAlert: false,
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {

        setDailyRemainder(state, action){
            state.dailyRemainder = action.payload;
        },

        setRemainderTime(state, action){
            state.remainderTime = action.payload;
        },

        setAiCoachDigest(state, action){
            state.aiCoachDigest = action.payload;
        },

        setMilestoneAlerts(state, action){
            state.milestoneAlert = action.payload;
        }
    }
});

export const {
    setDailyRemainder,
    setRemainderTime,
    setAiCoachDigest,
    setMilestoneAlerts
} = notificationSlice.actions;

export default notificationSlice.reducer;