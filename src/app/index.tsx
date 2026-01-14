import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import Chat from "../features/Chat/Chat";
import Login from "../features/Login/Login";
import { useAuth } from "../hooks/useAuth";

// Evita que la splash screen se esconda automáticamente al iniciar la app
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const { loading, isAuthenticated } = useAuth(); // Hook de autenticación
  const [appReady, setAppReady] = useState(false); // Controla cuando la app está lista

  // Oculta la splash screen cuando la app termina de cargar
  useEffect(() => {
    const hideSplashWhenReady = async () => {
      if (!loading) {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };
    hideSplashWhenReady();
  }, [loading]);

  if (!appReady) return null;

  return isAuthenticated ? <Chat /> : <Login />;
}
