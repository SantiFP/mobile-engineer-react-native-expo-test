import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import type { SocketProviderProps } from "../../types/types";
import { Message } from "../api/domain/chat/chat.types";
import { Socket } from "../api/sockets/Sockets";
import { SocketEvent } from "../api/types/socket";
import { setAddEvent } from "../redux/chat";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";

function SocketProvider({ children }: SocketProviderProps) {
  const dispatch = useAppDispatch();

  // Obtener token desde Redux, necesario para conectar al socket
  const token = useSelector(
    (state: RootState) => state.globalStatus.token
  );

  // Handler para mensajes entrantes del socket
  const handleNewMessage = useCallback(
    (message: Message) => {
      console.log("📥 Mensaje recibido por mi app (socket):", message);
      dispatch(setAddEvent(message)); // Actualiza el store con el nuevo mensaje
    },
    [dispatch]
  );

  useEffect(() => {
    if (!token) return; // No conectamos si no hay token

    let isActive = true; // Flag para controlar si el componente sigue montado

    const connectSocket = async () => {
      await Socket.start(); // Inicializa el socket

      // Espera a que el socket esté conectado
      while (isActive && !Socket.isConnected()) {
        console.log("⏳ Esperando a que el socket se conecte...");
        await new Promise((res) => setTimeout(res, 100));
      }

      if (!isActive) return;

      console.log("✅ Socket conectado, uniéndose a chat-room");
      await Socket.joinChat("chat-room"); // Se une a la sala de chat
      await Socket.listen(SocketEvent.NEW_MESSAGE, handleNewMessage); // Escucha mensajes entrantes
      console.log("✅ Te uniste a chatroom");
    };

    connectSocket();

    // Cleanup: detiene la escucha de mensajes al desmontar el componente
    return () => {
      isActive = false;
      Socket.stop(SocketEvent.NEW_MESSAGE, handleNewMessage);
    };
  }, [token, handleNewMessage]);

  // Renderiza los children envueltos en el proveedor de socket
  return <>{children}</>;
}

export default React.memo(SocketProvider); // Memo no aporta mucho aquí, pero no genera errores
