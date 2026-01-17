import { Slot, router } from "expo-router";
import { useEffect } from "react";
import { configureGoogleSignIn } from "../services/googleConfig";
import { useAuthListener } from "../services/useAuthListener";

export default function RootLayout() {
  const { user, loading } = useAuthListener();

  // Initialize native Google Sign-In SDK once
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // Auth-based navigation control
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/Welcome");
      }
    }
  }, [user, loading]);

  return <Slot />;
}
