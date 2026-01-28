import { useAuthListener } from "@/services/useAuthListener";
import { useOnlinePresence } from "@/services/useOnlinePresence";
import { runMigrations } from "@/src/db/runMigrations";
import { syncUsers } from "@/src/services/sync/syncUsers";
import { ToastProvider } from "@/src/toast/ToastProvider";
import { Slot, router } from "expo-router";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const sqlite = openDatabaseSync("myapp.db");
  const { user, loading } = useAuthListener();
  const [dbReady, setDbReady] = useState(false);

  // 1) Run migrations
  useEffect(() => {
    (async () => {
      await runMigrations(sqlite);
      setDbReady(true);
    })();
  }, []);

  // 2) After DB is ready and user exists → start syncing
  useEffect(() => {
    if (!dbReady || !user) return;
    const unsubscribe = syncUsers();
    return unsubscribe;
  }, [dbReady, user]);

  // 3) After auth & DB ready → navigate
  useEffect(() => {
    if (!dbReady || loading) return;
    console.log(user,"-----user-----")
    if (user) router.replace("/(tabs)/home");
    else router.replace("/(auth)/Welcome");
  }, [dbReady, loading, user]);

  // 4) Setup online presence tracking
  useOnlinePresence(user);

  if (!dbReady) return null; // TODO: Splash screen here

  return (
    <SQLiteProvider databaseName="myapp.db">
      <ToastProvider>
        <Slot />
      </ToastProvider>
    </SQLiteProvider>
  );
}

