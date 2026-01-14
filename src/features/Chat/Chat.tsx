import { useCallback, useLayoutEffect } from "react";
import { StyleSheet } from "react-native";

import { Message } from "../../api/domain/chat/chat.types";
import Paginated from "../../api/types/paginated";
import { ThemedView } from "../../components/ThemedView/ThemedView";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../../constants/pagination";
import { useError } from "../../hooks/useErrorMessage"; // tu hook para mostrar errores
import { useGetEvents } from "../../hooks/useGetEvents";
import { setChatEvents, setChatPagination } from "../../redux/chat";
import { useAppDispatch } from "../../redux/hooks";
import Body from "./Body/Body";
import Loading from "./Body/Loading";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

export default function Chat() {
  const { mutate: getEvents, isPending } = useGetEvents();
  const dispatch = useAppDispatch();
  const { showError } = useError();

  // Callback al cargar mensajes correctamente: guarda eventos y paginación en Redux
  const onSuccess = useCallback(
    (data: Paginated<Message>) => {
      const { elements, ...pagination } = data;
      dispatch(setChatEvents(elements));
      dispatch(setChatPagination(pagination));
    },
    [dispatch]
  );

  // Callback al fallar la carga de mensajes: muestra error
  const onError = useCallback(() => {
    showError("Ocurrió un error al cargar los mensajes");
  }, [showError]);

  useLayoutEffect(() => {
    getEvents(
      { limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET },
      { onSuccess, onError } // Callbacks para éxito y error
    );
  }, [getEvents, onSuccess, onError]);

  return (
    <ThemedView style={styles.container}>
      <Header />
      {!isPending ? <Body /> : <Loading />}
      <Footer />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

