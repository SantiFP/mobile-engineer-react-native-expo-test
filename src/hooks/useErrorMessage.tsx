import { createContext, useContext, useState } from "react";
import type { ErrorContextType, ErrorProviderProps } from "../../types/types";
import ErrorMessage from "../components/Error/ErrorMessage";

// Contexto para exponer una API mínima de manejo de errores
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}

      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          visible={true}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </ErrorContext.Provider>
  );
};
