import React, { useCallback, useMemo } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { useChatPagination } from "../../../hooks/useChatPagination";
import { getChatEvents, getChatPagination } from "../../../redux/chat/chat.selector";
import { useAppSelector } from "../../../redux/hooks";
import Message from "./Message/Message";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

function Body() {
  const events = useAppSelector(getChatEvents);
  const pagination = useAppSelector(getChatPagination);

  /**
   * Problema de performance:
   * Antes, cada render recalculaba toda la lista de mensajes con Object.values + sort,
   * y con muchos mensajes el chat se volvía lento.
   * Solución: memoizamos la lista con useMemo para que solo se recalculen cuando cambian los mensajes.
   * En proyectos más grandes se podría optimizar aún más usando un selector memoizado en Redux.
   */
  const messages = useMemo(() => {
    if (!events) return [];
    return Object.values(events)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .reverse(); // Para FlatList con `inverted`
  }, [events]);

  const { loadMoreMessages } = useChatPagination(messages, pagination);

  // Memoiza renderItem para FlatList y evitar recrear la función en cada render
  const renderItem = useCallback(
    ({ item }: any) => (
      <View style={{ marginVertical: 10 }}>
        <Message id={item.id} />
      </View>
    ),
    []
  );

  return (
    <ImageBackground
      source={require("../../../assets/images/chat-bg-pattern.jpg")}
      style={styles.bodyContainer}
      resizeMode="repeat"
    >
      <FlatList
        data={messages} // Lista ya ordenada y memoizada
        renderItem={renderItem} // Función memoizada
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        inverted // Mantiene scroll pegado a los mensajes nuevos abajo
        overScrollMode="never"
        onEndReached={loadMoreMessages} // Carga incremental
        onEndReachedThreshold={0.3}
        initialNumToRender={30}
        maxToRenderPerBatch={18}
        updateCellsBatchingPeriod={50}
        windowSize={14}
        removeClippedSubviews
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </ImageBackground>
  );
}

export default React.memo(Body);

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    paddingBottom: 10,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
});

/*
⚠️ Resumen rápido del bug de rendimiento:

- Cada render recalculaba toda la lista de mensajes con Object.values + sort, lo que con muchos mensajes ralentizaba el chat.
- Solución aplicada:
  • Memoizamos la lista de mensajes con useMemo.
  • Memoizamos renderItem con useCallback para FlatList.
- Resultado: el Body mantiene buen rendimiento incluso con muchos mensajes.
*/
