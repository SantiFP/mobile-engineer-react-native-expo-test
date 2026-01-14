import { useCallback } from "react";
import ChatService from "../api/domain/chat/chat.service";
import useQuery from "./useQuery";

const chatService = new ChatService();

export const useGetEvents = () => {
  const get = useCallback(async (data: any) => {
    try {
      const result = await chatService.getEvents(data.limit, data.offset);

      // Si result es nulo, vacío, o viene con error
      if (
        !result || // nulo o indefinido
        (Array.isArray(result) && result.length === 0) || // si fuera array vacío
        (typeof result === "object" &&
          ("error" in result || "message" in result))
      ) {
        throw new Error(
          "Ocurrió un error al cargar los mensajes"
        );
      }


      return result;
    } catch (error: any) {
      console.error("Error fetching events:", error);
      throw error; // relanzamos para que onError del padre lo capture
    }
  }, []);

  const queryResult = useQuery({ fetchFn: get });

  return queryResult;
};
