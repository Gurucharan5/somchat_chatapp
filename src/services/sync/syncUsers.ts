import { db as firestore } from "@/services/firebase";
import { db as localDB } from "@/src/db/drizzle";
import { emitUserUpdated } from "@/src/db/events";
import { queueRead } from "@/src/db/readQueue";
import { users } from "@/src/db/schema";
import { queueWrite } from "@/src/db/writeQueue";
import { eq } from "drizzle-orm";
import { collection, onSnapshot } from "firebase/firestore";

export function syncUsers() {
  const usersRef = collection(firestore, "users");

  const unsubscribe = onSnapshot(usersRef, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const hobbiesArray = Array.isArray(data.hobbies) ? data.hobbies : [];
      const remoteUpdatedAt = data.updatedAt ?? 0;

      // 🔹 SERIALIZED READ
      queueRead(() =>
        localDB
          .select()
          .from(users)
          .where(eq(users.uid, doc.id))
      )
        .then((existing) => {

          if (existing.length === 0) {
            console.log("[SYNC] Inserting new local user:", doc.id);

            // 🔹 SERIALIZED WRITE
            queueWrite(async () => {
              await localDB.insert(users).values({
                uid: doc.id,
                email: data.email ?? null,
                username: data.username,
                avatarUrl: data.avatarUrl ?? null,
                bio: data.bio ?? null,
                hobbies: JSON.stringify(hobbiesArray),
                handle: data.handle ?? null,
                handleLower: data.handle_lower ?? null,
                lastSeen: data.last_seen ?? 0,
                onlineStatus: data.online_status ?? "offline",
                chatTheme: data.chat_theme ?? null,
                appTheme: data.app_theme ?? null,
                updatedAt: remoteUpdatedAt,
              });

              emitUserUpdated();
            });

          } else {
            const local = existing[0];
            console.log("[SYNC] Local user before update:", local);

            // compare timestamps
            if ((local.updatedAt ?? 0) < remoteUpdatedAt) {
              console.log("[SYNC] Updating local user:", doc.id);

              // 🔹 SERIALIZED WRITE
              queueWrite(async () => {
                await localDB
                  .update(users)
                  .set({
                    email: data.email ?? null,
                    username: data.username,
                    avatarUrl: data.avatarUrl ?? null,
                    bio: data.bio ?? null,
                    hobbies: JSON.stringify(hobbiesArray),
                    handle: data.handle ?? null,
                    handleLower: data.handle_lower ?? null,
                    lastSeen: data.last_seen ?? 0,
                    onlineStatus: data.online_status ?? "offline",
                    chatTheme: data.chat_theme ?? null,
                    appTheme: data.app_theme ?? null,
                    updatedAt: remoteUpdatedAt,
                  })
                  .where(eq(users.uid, doc.id));

                emitUserUpdated();
              });
            }
          }
        })
        .catch((err) => console.error("User SELECT error:", err));
    });
  });

  return unsubscribe;
}
