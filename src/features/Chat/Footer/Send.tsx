import React, { useCallback } from "react";
import { View } from "react-native";

import { SendMessageResponse } from "../../../api/domain/chat/chat.types";
import { Icon } from "../../../components/Icon/Icon";
import { Color } from "../../../constants/colors";
import { useSendTextMessage } from "../../../hooks/useSendMessage";
import { setAddEvent, setMessageInput } from "../../../redux/chat";
import { getMessageInput } from "../../../redux/chat/chat.selector";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

function Send() {
  const { mutate: sendMessage } = useSendTextMessage();
  const dispatch = useAppDispatch();
  const message = useAppSelector(getMessageInput);

  // Habilita el botón y cambia color según si hay texto
  const hasText = (message ?? "").trim().length > 0;
  const c = hasText ? Color.PRIMARY_500 : "#ccc";

  // Envía el mensaje solo si hay texto
  const onTouchEnd = useCallback(() => {
    if (!message) return;
    sendMessage(message, { onSuccess });
  }, [message]);

  // Al enviar correctamente, agrega el evento al store y limpia el input
  const onSuccess = useCallback((r: SendMessageResponse) => {
    dispatch(setAddEvent(r.data));
    dispatch(setMessageInput(undefined));
  }, []);

  return (
    <View onTouchEnd={onTouchEnd}>
      <Icon name="send.fill" size={24} color={c} />
    </View>
  );
}

export default React.memo(Send);

