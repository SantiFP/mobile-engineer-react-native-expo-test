import * as FileSystem from "expo-file-system/legacy";
import { Message } from "../api/domain/chat/chat.types";
import { postRequest } from "./postRequest";

export const sendImageToServer = async (message: Message, token: string) => {
  try {
    // Validamos que el mensaje tenga una URI de imagen
    if (!message.imageUrl) {
      console.error("❌ No se encontró la URI de la imagen");
      return;
    }

    // Verificamos que el archivo exista en el dispositivo
    const fileInfo = await FileSystem.getInfoAsync(message.imageUrl);
    if (!fileInfo.exists) {
      console.error("❌ El archivo no existe en el dispositivo:", message.imageUrl);
      return;
    }

    // Preparamos el FormData para el POST
    const formData = new FormData();
    formData.append("image", {
      uri: message.imageUrl,
      name: message.imageName || "image.jpg",
      type: "image/jpeg",
    } as any);
    formData.append("caption", ""); // Se puede usar message.caption si se desea

    // Enviamos la imagen usando nuestro wrapper postRequest
    const data = await postRequest<{ data: any }>(
      '/messages/send-image',
      formData,
      { token }
    );

    return data.data;
  } catch (error) {
    console.error("❌ Error enviando la imagen:", error);
    throw new Error('No se pudo enviar la imagen');
  }
};
