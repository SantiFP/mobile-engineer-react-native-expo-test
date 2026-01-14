import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch } from "react-redux";
import "../../global.css";
import { useColorScheme } from "../hooks/useColorSchemeWeb";
import { ErrorProvider } from "../hooks/useErrorMessage";
import { setToken } from "../redux/global";
import { AppDispatch, store } from "../redux/store";
import SocketProvider from "./socketProvider";

// Instancia única de QueryClient para toda la app.
// Esto evita que se recree en cada render, manteniendo el cache de React Query estable.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { enabled: false },
  },
});

function ReduxRootLayoutWrapper() {
  // Detecta el tema del sistema (claro/oscuro)
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();

  // Al iniciar la app, recupera el token guardado en AsyncStorage
  // y lo guarda en Redux para mantener la sesión del usuario
  useEffect(() => {
    const hydrateToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        dispatch(setToken(storedToken));
      }
    };

    hydrateToken();
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SocketProvider>
          <ActionSheetProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="light" />
            </GestureHandlerRootView>
          </ActionSheetProvider>
        </SocketProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  // Proveedor Redux y manejo de errores
  return (
    <Provider store={store}>
      <ErrorProvider>
        <ReduxRootLayoutWrapper />
      </ErrorProvider>
    </Provider>
  );
}
