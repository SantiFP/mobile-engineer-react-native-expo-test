import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "../../../components/ThemedView/ThemedView";
import { Color } from "../../../constants/colors";
import Avatar from "./Avatar";
import Data from "./Data";

import { useDispatch } from "react-redux";
import { setToken } from "../../../redux/global";
import type { AppDispatch } from "../../../redux/store";

function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  // Maneja logout: limpia React Query, AsyncStorage y Redux, y redirige al login
  const handleLogout = async () => {
    try {
      // Limpiar queries y mutations de React Query
      await queryClient.cancelQueries();
      queryClient.clear();
      queryClient.getMutationCache().clear();

      // Borrar token de AsyncStorage y limpiar Redux
      await AsyncStorage.removeItem("token");
      dispatch(setToken(undefined));

      // Redirigir al login
      router.replace("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <ThemedView
      className="flex-row items-center justify-between w-full px-5"
      style={{
        paddingTop: insets.top + 8,
        height: 80 + insets.top,
        backgroundColor: Color.PRIMARY_500,
      }}
    >
      {/* Avatar y datos del usuario */}
      <View className="flex-row items-center w-3/4 gap-4">
        <Avatar />
        <Data />
      </View>

      <TouchableOpacity
        className="px-3 py-1.5 bg-red-600 rounded-md"
        onPress={handleLogout}
      >
        <Text className="text-white font-bold">🔓 Logout</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

export default React.memo(Header);
