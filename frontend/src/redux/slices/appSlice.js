import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogin: true,
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setLogin(state, action){
            state.isLogin = action.payload;
        },
    },
});

export const { setLogin } = appSlice.actions;
export default appSlice.reducer;