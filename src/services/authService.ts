import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";

export const authService = {
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (err) {
      console.log("Error al obtener token", err);
      return null;
    }
  },

  setToken: async (token: string) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (err) {
      console.log("Error al guardar token", err);
    }
  },

  removeToken: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (err) {
      console.log("Error al borrar token", err);
    }
  },

  // Saber si hay token
  hasToken: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (err) {
      console.log("Error al chequear token", err);
      return false;
    }
  },
};
