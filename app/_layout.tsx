import { runMigrations } from "@/src/db/runMigrations";
import { syncUsers } from "@/src/services/sync/syncUsers";
import { Slot, router } from "expo-router";
import { useEffect, useState } from "react";
import { configureGoogleSignIn } from "../services/googleConfig";
import { useAuthListener } from "../services/useAuthListener";

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const { user, loading } = useAuthListener();

  // // Run migrations BEFORE auth & sync
  // useEffect(() => {
  //   (async () => {
  //     configureGoogleSignIn();
  //     await runMigrations();
  //     console.log("DB READY");
  //     setDbReady(true);
  //   })();
  // }, []);

  // // Redirect based on auth
  // useEffect(() => {
  //   if (dbReady && !loading) {
  //     if (user) {
  //       router.replace("/(tabs)/home");
  //     } else {
  //       router.replace("/(auth)/Welcome");
  //     }
  //   }
  // }, [dbReady, user, loading]);

  // // Sync Firestore -> SQLite
  // useEffect(() => {
  //   // if (dbReady && user) {
  //   //   const unsubUsers = syncUsers();
  //   //   return () => unsubUsers();
  //   // }
  //   if (dbReady && user) {
  //     const timeout = setTimeout(() => {
  //       syncUsers();
  //     }, 500); // wait for navigation to settle

  //     return () => clearTimeout(timeout);
  //   }

  // }, [dbReady, user]);

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

  return <Slot />;
}
