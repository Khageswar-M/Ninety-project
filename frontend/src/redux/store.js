import { configureStore } from "@reduxjs/toolkit";
import appSlice from './slices/appSlice.js';
import themeSlice from './slices/themeSlice.js'

export const store = configureStore({
    reducer: {
        app: appSlice,
        theme: themeSlice
    }
})