import { auth, db as firestore } from "@/services/firebase";
import { runMigrations } from "@/src/db/runMigrations";
import { syncUsers } from "@/src/services/sync/syncUsers";
import { ToastProvider } from "@/src/toast/ToastProvider";
import { Slot, router } from "expo-router";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { configureGoogleSignIn } from "../services/googleConfig";
import { useAuthListener } from "../services/useAuthListener";


export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const { user, loading } = useAuthListener();

  useEffect(() => {
    (async () => {
      configureGoogleSignIn();
      
      // 1) Run migrations first
      await runMigrations();

      // 2) Now DB is ready to use
      setDbReady(true);
    })();
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = doc(firestore, "users", uid);

    const setOnline = () =>
      updateDoc(userRef, {
        online: true,
        lastSeen: serverTimestamp(),
      });

    const setOffline = () =>
      updateDoc(userRef, {
        online: false,
        lastSeen: serverTimestamp(),
      });

    setOnline();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") setOnline();
      else setOffline();
    });

    return () => {
      sub.remove();
      setOffline();
    };
  }, []);


  useEffect(() => {
    if (dbReady && !loading) {
      if (user) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/Welcome");
      }
    }
  }, [dbReady, user, loading]);

  useEffect(() => {
    if (dbReady && user) {
      const unsubUsers = syncUsers(); // Here SELECT is safe
      return () => unsubUsers();
    }
  }, [dbReady, user]);


  if (!dbReady) return null; // or splash screen

  return (
    <ToastProvider>
      <Slot />
    </ToastProvider>
    
  );
}
