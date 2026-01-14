import { Platform } from "react-native";

const getApiUrl = () => {
  if (Platform.OS === "ios") {
    return "http://localhost:3000/api"; // iOS simulator
  } else if (Platform.OS === "android") {
    return "http://192.168.1.3:3000/api"; // Android emulator
  } else {
    return "http://192.168.1.3:3000/api"; // Dispositivos físicos y web
  }
};

const getSocketUrl = () => {
  if (Platform.OS === "ios") {
    return "http://localhost:3000"; // iOS simulator
  } else if (Platform.OS === "android") {
    return "http://192.168.1.3:3000"; // Android emulator
  } else {
    return "http://192.168.1.3:3000"; // Dispositivos físicos y web
  }
};

export const config = {
  apiUrl: getApiUrl(),
  socketUrl: getSocketUrl(),
};
