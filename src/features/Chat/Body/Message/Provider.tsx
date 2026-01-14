import { createContext, useContext } from "react";
import type { MessageContextType, MessageProviderProps } from "../../../../../types/types";


// Contexto para compartir el ID del mensaje con componentes hijos
const MessageContext = createContext<MessageContextType | null>(null);

// Hook personalizado para consumir el contexto
export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};

// Proveedor que encapsula componentes y les da acceso al ID del mensaje
export function MessageProvider({ id, children }: MessageProviderProps) {
  const contextValue: MessageContextType = {
    id,
  };

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
}

export default MessageProvider;

