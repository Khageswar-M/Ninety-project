import { configureStore } from "@reduxjs/toolkit";
import appSlice from './slices/appSlice.js';
import themeSlice from './slices/themeSlice.js'
import notificationSlice from './slices/notificationSlice.js';

export const store = configureStore({
    reducer: {
        app: appSlice,
        theme: themeSlice,
        notification: notificationSlice,
    }
})