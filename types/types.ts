// src/services/postRequest.ts
import { ReactNode } from "react";
import type { Message } from "../src/api/domain/chat/chat.types";

export type RequestPayload = Record<string, any> | FormData;

export type RequestOptions = {
  token?: string;       
  timeout?: number;     
  headers?: Record<string, string>; 
};

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
  };
}

export interface SocketProviderProps {
  children: React.ReactNode;
}

export interface MessageContextType {
  id: string;
}

export interface MessageProviderProps {
  id: string;          
  children: ReactNode; 
}

export interface ImageMessageProps {
  message: Message;
}

export interface ErrorContextType {
  showError: (message: string) => void;
}


export interface ErrorProviderProps {
  children: ReactNode;
}
