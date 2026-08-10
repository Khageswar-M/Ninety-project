import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
    async set(key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Storage set error: ", error);
        }
    },

    async get(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error("Storage get error: ", error);
            return null;
        }
    },

    async remove(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error("Storage remove error: ", error);
        }
    },

    async getAll() {
        try {
            const keys = await AsyncStorage.getAllKeys();

            const entries = await AsyncStorage.multiGet(keys);

            const data = {};

            entries.forEach(([key, value]) => {
                data[key] = value ? JSON.parse(value) : null;
            });

            return data;
        } catch (error) {
            console.error("Storage getAll error:", error);
            return {};
        }
    },

    async clear() {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error("Storage clear error: ", error);
        }
    },
}