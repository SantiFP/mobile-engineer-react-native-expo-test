import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import type { ErrorMessageProps } from "../../../types/types";

const ErrorMessage = ({
  message,
  visible,
  onClose,
  duration = 4000,
}: ErrorMessageProps) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, slideAnim, onClose]);

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute top-12 left-4 right-4 bg-red-500 p-4 rounded-lg flex-row items-center shadow-lg"
      style={{ transform: [{ translateY: slideAnim }] }}
    >
      <Text className="text-white flex-1 text-base">❌    {message}</Text>
      <TouchableOpacity onPress={onClose} className="ml-4 p-2">
        <Text className="text-white font-bold text-lg">✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ErrorMessage;
