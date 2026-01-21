import { db } from "@/services/firebase";
import { addDoc, collection, deleteDoc, getDocs, query, where } from "firebase/firestore";

export async function acceptRequest(currentUid: string, fromUid: string) {
  const ref = collection(db, "friend_requests");
  const q = query(
    ref,
    where("fromUid", "==", fromUid),
    where("toUid", "==", currentUid),
    where("status", "==", "pending")
  );

  const snap = await getDocs(q);
  if (snap.empty) return { ok: false };

  // remove pending request
  await deleteDoc(snap.docs[0].ref);

  // create contact
  await addDoc(collection(db, "contacts"), {
    uid1: currentUid,
    uid2: fromUid,
    createdAt: Date.now()
  });

  return { ok: true };
}
