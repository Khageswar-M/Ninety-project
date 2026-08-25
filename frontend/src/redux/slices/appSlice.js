import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogin: false,
    dayGrid: [],
    gridId: 0,
    currentDay: 0,
    completedCount: 0,
    missedDaysCount: 0,
    currentStreak: 0,
    successRate: 0,
    bestStreak: 0
}

const appSlice = createSlice({
    name: "app",

    initialState,

    reducers: {

        hydrateApp(state, action){

            state.isLogin = 
                action.payload.isLogin ?? false;

            state.dayGrid =
                action.payload.dayGrid ?? [];

            state.gridId =
                action.payload.gridId ?? 0;

            state.currentDay =
                action.payload.currentDay ?? 0;

            state.completedCount =
                action.payload.completedCount ?? 0;

            state.missedDaysCount = 
                action.payload.missedDaysCount ?? 0;

            state.currentStreak = 
                action.payload.currentStreak ?? 0;

            state.successRate = 
                action.payload.successRate ?? 0;

            state.bestStreak =
                action.payload.bestStreak ?? 0;

        },

        setLogin(state, action){
            state.isLogin = action.payload;
        },

        setDayGrid(state, action){
            state.dayGrid = action.payload;
        },

        setGridId(state, action){
            state.gridId = action.payload;
        },

        setCurrentDay(state, action){
            state.currentDay = action.payload;
        },

        setCompletedCount(state, action){
            state.completedCount = action.payload;
        },

        setMissedDaysCount(state, action){
            state.missedDaysCount = action.payload;
        },

        setCurrentStreak(state, action){
            state.currentStreak = action.payload;
        },

        setSuccessRate(state, action){
            state.successRate = action.payload;
        },

        setBestStreak(state, action){
            this.setBestStreak = action.payload;
        },

    },
});

export const { 
    hydrateApp,
    setLogin,
    setDayGrid,
    setGridId,
    setCurrentDay,
    setCompletedCount,
    setMissedDaysCount,
    setCurrentStreak,
    setSuccessRate,
    setBestStreak
} = appSlice.actions;

export default appSlice.reducer;