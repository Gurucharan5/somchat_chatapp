import { db as firestore } from "@/services/firebase";
import { db as localDB } from "@/src/db/drizzle";
import { users } from "@/src/db/schema";
import { queueWrite } from "@/src/db/writeQueue";
import { eq } from "drizzle-orm";
import { collection, onSnapshot } from "firebase/firestore";

export function syncUsers() {
  const usersRef = collection(firestore, "users");

  const unsubscribe = onSnapshot(usersRef, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      const data = doc.data();

      // STEP 1 — read exists OUTSIDE queue (reads don't lock)
      localDB
        .select()
        .from(users)
        .where(eq(users.uid, doc.id))
        .then((existing) => {
          
          // STEP 2 — serialize only writes
          if (existing.length === 0) {
            // INSERT
            queueWrite(() =>
              localDB.insert(users).values({
                uid: doc.id,
                email: data.email ?? null,
                username: data.username,
                avatarUrl: data.avatar_url ?? null,
                bio: data.bio ?? null,
                lastSeen: data.last_seen ?? 0,
                onlineStatus: data.online_status ?? "offline",
                chatTheme: data.chat_theme ?? null,
                appTheme: data.app_theme ?? null,
                updatedAt: Date.now(),
              })
            );
          } else {
            // UPDATE
            queueWrite(() =>
              localDB
                .update(users)
                .set({
                  email: data.email ?? null,
                  username: data.username,
                  avatarUrl: data.avatar_url ?? null,
                  bio: data.bio ?? null,
                  lastSeen: data.last_seen ?? 0,
                  onlineStatus: data.online_status ?? "offline",
                  chatTheme: data.chat_theme ?? null,
                  appTheme: data.app_theme ?? null,
                  updatedAt: Date.now(),
                })
                .where(eq(users.uid, doc.id))
            );
          }
        })
        .catch((err) => console.error("User SELECT error:", err));
    });
  });

  return unsubscribe;
}
