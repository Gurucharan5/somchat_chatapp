import { db } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function checkRelationship(currentUid: string, targetUid: string) {
  if (currentUid === targetUid) return "self";

  // Check contacts
  const contactsRef = collection(db, "contacts");
  const c1 = query(contactsRef, where("uid1", "==", currentUid), where("uid2", "==", targetUid));
  const c2 = query(contactsRef, where("uid1", "==", targetUid), where("uid2", "==", currentUid));

  const [r1, r2] = await Promise.all([getDocs(c1), getDocs(c2)]);
  if (!r1.empty || !r2.empty) return "friends";

  // Check pending outgoing
  const frRef = collection(db, "friend_requests");
  const outgoing = query(frRef, where("fromUid", "==", currentUid), where("toUid", "==", targetUid));
  const r3 = await getDocs(outgoing);
  if (!r3.empty) return "sent";

  // Check pending incoming
  const incoming = query(frRef, where("fromUid", "==", targetUid), where("toUid", "==", currentUid));
  const r4 = await getDocs(incoming);
  if (!r4.empty) return "received";

  return "none";
}
