import { createSlice } from "@reduxjs/toolkit";
import { darkTheme, lightTheme } from "../../themes/theme";

const initialState = {
    isDark: true,
    theme: darkTheme
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isDark = !state.isDark;
            state.theme = state.isDark ? darkTheme : lightTheme;
        },

        setLightTheme: (state) => {
            state.isDark = false;
            state.theme = lightTheme;
        },

        setDarkTheme: (state) => {
            state.isDark = true;
            state.theme = darkTheme;
        },
    },
});

export const {
    toggleTheme,
    setLightTheme,
    setDarkTheme,
} = themeSlice.actions;

export default themeSlice.reducer;