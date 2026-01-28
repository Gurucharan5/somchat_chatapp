import { db as firestore } from "@/services/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { AppState } from "react-native";

export function useOnlinePresence(user: any) {
  useEffect(() => {
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);

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
  }, [user]);
}
