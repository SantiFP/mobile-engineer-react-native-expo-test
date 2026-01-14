import { useActionSheet } from "@expo/react-native-action-sheet";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Message } from "../api/domain/chat/chat.types";
import { RootState } from "../redux/store";
import { sendImageToServer } from "../services/sendImageService";
import { useError } from "./useErrorMessage";
import { usePickImage } from "./usePickImage";

export function useAttachmentMenu() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { pickImageFromCamera } = usePickImage();
  const { showError } = useError();
  const token = useSelector((state: RootState) => state.globalStatus.token);

  const [isSending, setIsSending] = useState(false); // Estado de envío de archivos

  const openAttachmentOptions = useCallback(() => {
    // Opciones del action sheet
    const options = ["Cámara", "Fototeca", "Archivo", "Audio", "Cancelar"];
    const cancelButtonIndex = 4;
    const disabledButtonIndices = [1, 2, 3]; // Opciones no implementadas

    showActionSheetWithOptions(
      { options, cancelButtonIndex, disabledButtonIndices },
      async (buttonIndex) => {
        // Solo implementamos la cámara por ahora
        if (buttonIndex === 0) {
          try {
            const imageMessage: Message | null = await pickImageFromCamera();
            if (!imageMessage) return;

            setIsSending(true); // Indica que se está enviando la imagen
            const response = await sendImageToServer(imageMessage, token!);
            // response contiene los metadatos generados por el backend (id, url, timestamps)
          } catch (err) {
            // Mostramos error si falla el envío
            showError(
              err instanceof Error ? err.message : "No se pudo enviar la imagen"
            );
          } finally {
            setIsSending(false); // Reset del estado de envío
          }
        }
      }
    );
  }, [pickImageFromCamera, showActionSheetWithOptions, token, showError]);

  return {
    openAttachmentOptions,
    isSending, // Exponemos el estado para mostrar loader en el UI
  };
}
