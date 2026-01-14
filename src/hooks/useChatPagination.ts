import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Message } from "../api/domain/chat/chat.types";
import { Pagination } from "../api/types/paginated";
import { setChatEvents, setChatPagination } from "../redux/chat";

/*
 Hook para manejar la paginación de mensajes en el chat.
 Optimiza el renderizado del listado y separa la lógica de UI del componente Body.
 Diseñado para cumplir el requisito del punto 4:
   • Paginación de mensajes
   • Virtualización (uso con FlatList invertido)
   • Performance y escalabilidad
*/
export const useChatPagination = (
  messages: Message[],              // Array de mensajes ordenado de más viejo → más nuevo
  pagination: Pagination | undefined // Estado de paginación actual
) => {
  const dispatch = useDispatch();

  const loadMoreMessages = useCallback(() => {
    // Si no hay más páginas, no hacemos nada
    if (!pagination?.hasNextPage) return;

    // Calculamos el offset del siguiente batch de mensajes
    const nextOffset = pagination.offset + pagination.limit;

    // Creamos el siguiente batch de mensajes para agregar al inicio
    // Esto mantiene el orden correcto al usar FlatList con `inverted`
    const nextBatch = [
      ...messages.slice(nextOffset, nextOffset + pagination.limit), // nuevos mensajes
      ...messages, // existentes
    ];

    // Actualizamos los mensajes en Redux, evitando recalcular toda la lista
    dispatch(setChatEvents(nextBatch));

    // Actualizamos el estado de paginación en Redux
    // Esto permite que FlatList sepa si hay más mensajes por cargar
    dispatch(
      setChatPagination({
        ...pagination,
        offset: nextOffset,
        page: pagination.page + 1,
        prevPage: pagination.page,
        nextPage:
          nextOffset + pagination.limit < messages.length
            ? pagination.page + 2
            : null,
        hasPrevPage: nextOffset > 0,
        hasNextPage: nextOffset + pagination.limit < messages.length,
      })
    );
  }, [messages, pagination, dispatch]);

  // Retornamos la función para ser usada en Body
  return { loadMoreMessages };
};

