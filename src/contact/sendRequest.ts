import { db } from "@/services/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export async function sendRequest(fromUid: string, toUid: string) {
  if (fromUid === toUid) throw new Error("Cannot send request to yourself");

  // Check if already exists
  const ref = collection(db, "friend_requests");
  const q = query(
    ref,
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    const doc = snap.docs[0].data();
    if (doc.status === "pending") throw new Error("Already sent");
  }

  await addDoc(ref, {
    fromUid,
    toUid,
    status: "pending",
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  return { ok: true };
}
