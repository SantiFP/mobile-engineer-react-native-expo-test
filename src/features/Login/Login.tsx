import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import type { LoginResponse, RequestPayload } from "../../../types/types";
import logoSource from "../../assets/images/logo_chatter_color_2.png";
import { Text } from "../../components/Text/Text";
import { ThemedView } from "../../components/ThemedView/ThemedView";
import { useError } from "../../hooks/useErrorMessage";
import { setToken } from "../../redux/global";
import type { AppDispatch } from "../../redux/store";
import { postRequest } from "../../services/postRequest";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { showError } = useError();

  // React Query: mutation para login usando postRequest
  const mutation = useMutation<LoginResponse, Error, RequestPayload>({
    mutationFn: (payload) => postRequest<LoginResponse>("/auth/login", payload),
  });

  // Maneja el login: llama la API, guarda token y redirige
  const handleLogin = async () => {
    try {
      mutation.reset();

      const data = await mutation.mutateAsync({ username, password });

      await AsyncStorage.setItem("token", data.token);
      dispatch(setToken(data.token));

      router.replace("/");
    } catch (err: any) {
      showError(err.message);
    }
  };

  return (
    <ThemedView className="flex-1 items-center justify-center bg-[#1F2937]">
      <ImageBackground
        source={require("../../assets/images/background.png")}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="w-11/12 m-auto flex-col items-center justify-center gap-4 flex-1">
            <Image
              source={logoSource}
              resizeMode="contain"
              className="w-4/5 max-h-20 mb-5 self-center"
            />

            <TextInput
              className="w-full h-16 px-4 border border-white/60 rounded-lg text-white text-base bg-transparent"
              placeholder="Nombre de usuario"
              placeholderTextColor="#fff"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <TextInput
              className="w-full h-16 px-4 border border-white/60 rounded-lg text-white text-base bg-transparent"
              placeholder="Contraseña"
              placeholderTextColor="#fff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              className="w-full bg-[#3B82F6] rounded-xl py-4 items-center justify-center"
              onPress={handleLogin}
            >
              <Text className="text-white font-bold text-base">
                Iniciar sesión
              </Text>
            </TouchableOpacity>

            {/* Indicador mientras la mutation está pendiente */}
            {mutation.isPending && (
              <Text className="mt-2 text-white">Cargando...</Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ThemedView>
  );
}

export default React.memo(Login); 
