import { db } from "@/services/firebase";
import { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

export async function createUserDocumentOnSignIn(user: User, extra?: any) {
  try {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    const deviceId = extra?.deviceId ?? `device_${Date.now()}`;
    const platform = extra?.platform ?? "android";

    const devicePayload = {
      device_id: deviceId,
      platform,
      fcm_token: extra?.fcmToken ?? null,
      active: true,
      updated_at: serverTimestamp(),
    };

    if (!snapshot.exists()) {
      // CREATE USER
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email ?? null,
        username: user.displayName ?? extra?.username ?? "User",
        avatarUrl: user.photoURL ?? null,
        bio: "",
        hobbies: [],
        created_at: serverTimestamp(),
        updatedAt: serverTimestamp(),
        app_theme: "system",
        chat_theme: "default",

        device_sessions: {
          [deviceId]: devicePayload,
        },
      });

    } else {
      // UPDATE EXISTING USER DEVICE
      await updateDoc(userRef, {
        [`device_sessions.${deviceId}`]: devicePayload,
        updated_at: serverTimestamp(),
      });
    }

  } catch (err) {
    console.error("❌ createUserDocumentOnSignIn error:", err);
  }
}
