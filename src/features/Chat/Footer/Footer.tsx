import React, { useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAttachmentMenu } from "../../../hooks/useAttachmentMenu";
import { setMessageInput } from "../../../redux/chat";
import { getMessageInput } from "../../../redux/chat/chat.selector";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Loading from "../Body/Loading";
import Send from "./Send";

function Footer() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const message = useAppSelector(getMessageInput);

  const { openAttachmentOptions, isSending } = useAttachmentMenu(); 

  // Memoizamos la actualización del input para no recrear la función en cada render
  const onChangeText = useCallback(
    (text: string) => {
      dispatch(setMessageInput(text));
    },
    [dispatch]
  );

  return (
    <>
    {/* // Muestra un loader mientras se está enviando un mensaje o archivo */}
      {isSending && <Loading />}  

      {/* Evita que el teclado tape el input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.bottom}
      >
        <View
          className="flex-row items-center justify-between w-full border-t bg-black border-gray-300 px-4 py-2 gap-2"
          style={{ paddingBottom: insets.bottom + 8 }}
        >
          <TouchableOpacity
            onPress={openAttachmentOptions}
            disabled={isSending} 
            className={`w-12 h-12 rounded-full justify-center items-center ${
              isSending ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            <Text className="text-white text-2xl font-bold">+</Text>
          </TouchableOpacity>

          <TextInput
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base bg-white min-h-[44px] max-h-[110px]"
            value={message}
            onChangeText={onChangeText}
            placeholder="Escribe un mensaje..."
            multiline
            numberOfLines={4}
            maxLength={1000}
            textAlignVertical="center"
          />

          <Send />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}


export default React.memo(Footer);
