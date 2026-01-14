import io, { Socket as SocketType } from "socket.io-client";
import { config } from "../config";
import { SocketCallback, SocketEvent } from "../types/socket";

export class Socket {
  private static socket?: SocketType;

  static async start() {
    Socket.socket = io(`${config.socketUrl}`);

    Socket.socket.on("connect", () => {
      console.log("✅ CONNECT EVENT FIRED, id:", Socket.socket?.id);
    });

    Socket.socket.on("connect_error", (err) => {
      console.log("❌ ERROR EVENT FIRED:", err.message);
    });
  }

  // ✅ Método para unirse al chat y opcionalmente a otro room
  static async joinChat(data: string) {
    if (!Socket.socket) await Socket.start();

    Socket.socket?.emit("join-chat", data);
  }

  // Escucha un evento
  static async listen<T>(event: SocketEvent, callback: SocketCallback<T>) {
    if (!Socket.socket) {
      await Socket.start();
    }

    return new Promise<void>((resolve) => {
      const setupListener = () => {
        Socket.socket?.on(event, (data) => {
          callback(data);
        });
        resolve();
      };

      if (Socket.socket?.connected) {
        setupListener();
      } else {
        Socket.socket?.on("connect", setupListener);
      }
    });
  }

  // Detiene un listener
  static async stop<T>(event?: SocketEvent, callback?: SocketCallback<T>) {
    if (!Socket.socket) return;
    Socket.socket.off(event, callback);
  }

  // Verifica conexión
  static isConnected() {
    return !!Socket.socket;
  }

  // Desconecta completamente
  static async disconnect() {
    Socket.socket?.disconnect();
    Socket.socket = undefined;
  }

  // Elimina todos los listeners de un evento
  static async removeAllListeners(event?: SocketEvent) {
    Socket.socket?.removeAllListeners(event);
  }
}
