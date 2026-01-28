import { auth } from "@/services/firebase";
import { subscribeUserUpdates } from "@/src/db/events";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";

export function useLocalUser() {
  const sqlite = useSQLiteContext();
  const drizzleDb = useMemo(() => drizzle(sqlite), [sqlite]);
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLocalUser(null);
      return;
    }

    const load = async () => {
      const rows = await drizzleDb.select().from(users).where(eq(users.uid, uid));
      setLocalUser(rows[0] ?? null);
    };

    load();

    const unsub = subscribeUserUpdates(load);
    return () => unsub();
  }, [drizzleDb]);

  return localUser;
}
