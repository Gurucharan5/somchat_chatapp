import { auth } from "@/services/firebase";
import { db } from "@/src/db/drizzle";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";

// export function useLocalUser() {
//   const [localUser, setLocalUser] = useState<any>(null);

//   useEffect(() => {
//     const uid = auth.currentUser?.uid;

//     // TS + runtime guard
//     if (uid === undefined) {
//       console.log("No UID yet, skipping local user fetch");
//       return;
//     }

//     // UID is now a guaranteed string type
//     const fetchUser = async (userId: string) => {
//       const rows = await db
//         .select()
//         .from(users)
//         .where(eq(users.uid, userId));

//       if (rows.length > 0) {
//         setLocalUser(rows[0]);
//       }
//     };

//     fetchUser(uid);

//   }, []);

//   return localUser;
// }
import { subscribeUserUpdates } from "@/src/db/events";

export function useLocalUser() {
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const load = async () => {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.uid, uid));

      if (rows.length > 0) {
        setLocalUser(rows[0]);
      }
    };

    load(); // initial fetch

    const unsubscribe = subscribeUserUpdates(load);
    return unsubscribe;
  }, []);

  return localUser;
}
