import React from "react";
import { StyleSheet, View } from "react-native";
import { MessageProps } from "../../../../../types/types";
import * as MessageView from "../../../../components/MessageView/MessageView";
import { getChatEventById } from "../../../../redux/chat/chat.selector";
import { useAppSelector } from "../../../../redux/hooks";
import ImageMessage from "./Layout/Image";
import Regular from "./Layout/Regular";
import { MessageProvider } from "./Provider";

function Message(props: MessageProps) {
  const { id } = props;

  // Obtener el mensaje completo desde Redux por su ID
  const message = useAppSelector(getChatEventById(id));

  // Si el mensaje no existe, no renderiza nada
  if (!message) return null;

  // Determina si el mensaje es recibido (respuesta automática) o enviado
  const isReceived = !!message.isAutoResponse;

  return (
    // Proveedor de contexto para pasar el ID del mensaje a componentes hijos
    <MessageProvider id={id}>
      <MessageView.Root isReceived={isReceived}>
        <View style={styles.messageContent}>
          {message.type === "image" ? (
            // Renderiza un mensaje de imagen
            <ImageMessage message={message} />
          ) : (
            // Renderiza un mensaje de texto normal
            <Regular />
          )}
        </View>

        {/* Componente que muestra iconos de estado y timestamp del mensaje */}
        <MessageView.BottomComposer
          icon={"check.fill"}
          isReceived={isReceived}
          timestamp={new Date(message.timestamp ?? Date.now())}
        />
      </MessageView.Root>
    </MessageProvider>
  );
}

// Memoización para evitar renders innecesarios cuando las props no cambian
export default React.memo(Message);

const styles = StyleSheet.create({
  messageContent: {
    paddingHorizontal: 6,
    width: "100%",
    alignContent: "flex-start",
  },
});
