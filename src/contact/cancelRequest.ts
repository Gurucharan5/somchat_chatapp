import { db } from "@/services/firebase";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";

export async function cancelRequest(fromUid: string, toUid: string) {
  const ref = collection(db, "friend_requests");
  const q = query(
    ref,
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid)
  );

  const snap = await getDocs(q);

  if (snap.empty) return { ok: false, reason: "Not found" };

  await deleteDoc(snap.docs[0].ref);
  return { ok: true };
}
