import { db } from "@/services/firebase";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";

export async function rejectRequest(currentUid: string, fromUid: string) {
  const ref = collection(db, "friend_requests");
  const q = query(
    ref,
    where("fromUid", "==", fromUid),
    where("toUid", "==", currentUid),
    where("status", "==", "pending")
  );

  const snap = await getDocs(q);
  if (snap.empty) return { ok: false };

  await deleteDoc(snap.docs[0].ref);
  return { ok: true };
}
