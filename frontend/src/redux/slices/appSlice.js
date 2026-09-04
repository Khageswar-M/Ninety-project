import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogin: false,
    dayGrid: [],
    gridId: 0,
    currentDay: 0,
    userName: "",
    userEmail: "",
    userId: ""
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

            state.userName = 
                action.payload.userName;

            state.userEmail =
                action.payload.userEmail;

            state.userId = 
                action.payload.userId;

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

        setUserName(state, action){
            state.userName = action.payload;
        },

        setUserEmail(state, action){
            state.userEmail = action.payload;
        },

        setUserId(state, action){
            state.userId = action.payload;
        }

    },
});

export const { 
    hydrateApp,
    setLogin,
    setDayGrid,
    setGridId,
    setCurrentDay,
    setUserName,
    setUserEmail,
    setUserId
} = appSlice.actions;

export default appSlice.reducer;