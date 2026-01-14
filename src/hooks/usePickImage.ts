import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import type { Message } from "../api/domain/chat/chat.types";

export const usePickImage = () => {
  const pickImageFromCamera = async (): Promise<Message | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara.");
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      return {
        id: Date.now().toString(),
        text: "",
        type: "image",
        username: "testuser",
        timestamp: new Date().toISOString(),
        isAutoResponse: false,
        imageUrl: uri,
        imageName: "imagen.jpg",
        imageSize: undefined,
        replyTo: undefined,
        uri:undefined
      };
    }

    return null;
  };

  return { pickImageFromCamera };
};
