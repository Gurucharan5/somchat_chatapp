import { auth, db as firestore } from "@/services/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  user: any;
  forceRelationship? : "none" | "sent" | "received" | "friends" | "rejected";
  notificationId?: string;
};

export default function BottomSheetUserProfile({ visible, onClose, user, forceRelationship, notificationId }: Props) {
  const currentUid = auth.currentUser?.uid;
  const [loading, setLoading] = useState(false);

  // Relationship state
  const [relationship, setRelationship] = useState<
    "none" | "sent" | "received" | "friends" | "rejected"
  >("none");

  // Build user ids safely
  const uid = user?.id ?? null;
  const requestId = currentUid && uid ? `${currentUid}_${uid}` : null;
  const reverseRequestId = currentUid && uid ? `${uid}_${currentUid}` : null;

  useEffect(() => {
    console.log("BottomSheet state:", {
      currentUid,
      uid,
      relationship,
      forceRelationship,
    });
  }, [relationship]);


  /**
   * 🔍 Check relationship state
   */
  const checkRelationship = async () => {
    if (!currentUid || !uid) return;

    if (currentUid === uid) {
      setRelationship("none");
      return;
    }

    // Check sent
    const sentSnap = await getDoc(doc(firestore, "friend_requests", requestId!));
    if (sentSnap.exists()) {
      setRelationship("sent");
      return;
    }

    // Check received
    const receivedSnap = await getDoc(doc(firestore, "friend_requests", reverseRequestId!));
    if (receivedSnap.exists()) {
      setRelationship("received");
      return;
    }

    // Check friends
    const contactSnap = await getDoc(doc(firestore, "contacts", `${currentUid}_${uid}`));
    if (contactSnap.exists()) {
      setRelationship("friends");
      return;
    }

    setRelationship("none");
  };

  useEffect(() => {
    if (!visible) return;

    if (forceRelationship === "received") {
      setRelationship("received");
      return;
    }

    checkRelationship();
  }, [visible, user]);


  /**
   * 📤 Send Friend Request
   */
  const sendFriendRequest = async () => {
    if (!currentUid || !uid) return;
    setLoading(true);
    try{
      await deleteDoc(doc(firestore, "friend_requests", requestId!)).catch(() => {});

      await setDoc(doc(firestore, "friend_requests", requestId!), {
        from: currentUid,
        to: uid,
        status: "pending",
        createdAt: Date.now(),
      });

      await addDoc(collection(firestore, "notifications"), {
        uid,
        fromUid: currentUid,
        type: "friend_request",
        seen: false,
        createdAt: Date.now(),
      });

      setRelationship("sent");
    } finally {
      setLoading(false);
    }
    
  };

  const acceptFriendRequest = async () => {
    if (!currentUid || !uid) return;
    setLoading(true);
    try {
      await setDoc(doc(firestore, "contacts", `${currentUid}_${uid}`), {
        uid,
        createdAt: Date.now(),
      });

      await setDoc(doc(firestore, "contacts", `${uid}_${currentUid}`), {
        uid: currentUid,
        createdAt: Date.now(),
      });

      await deleteDoc(
        doc(firestore, "friend_requests", reverseRequestId!)
      );
      // 3️⃣ Delete notification (KEY STEP)
      if (notificationId) {
        await deleteDoc(
          doc(firestore, "notifications", notificationId)
        );
      }

      setRelationship("friends");
      onClose();
    } finally {
      setLoading(false);
    }
    
  };

  const rejectFriendRequest = async () => {
    if (!currentUid || !uid) return;
    setLoading(true);
    try {
      await deleteDoc(
        doc(firestore, "friend_requests", reverseRequestId!)
      );
      // 2️⃣ Delete notification
      if (notificationId) {
        await deleteDoc(
          doc(firestore, "notifications", notificationId)
        );
      }

      setRelationship("rejected");
      onClose();
    } finally {
      setLoading(false);
    }
    
  };

  const buttonLabel = {
    none: "Add Contact",
    sent: "Request Sent",
    received: "Respond to Request",
    friends: "Message",
    rejected: "Add Contact",
  }[relationship];

  const buttonDisabled =
    loading || relationship === "sent" || relationship === "friends" || !currentUid || !uid;

  if (!visible) return null; // Modal hidden safely

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-neutral-900 p-6 rounded-t-3xl">

          {/* Close */}
          <TouchableOpacity className="absolute right-4 top-4" onPress={onClose}>
            <Text className="text-white text-xl">✕</Text>
          </TouchableOpacity>

          {/* If user not yet loaded */}
          {!user ? (
            <View className="py-10">
              <Text className="text-white text-center">Loading...</Text>
            </View>
          ) : (
            <>
              {/* Avatar */}
              <View className="items-center mt-2">
                {user.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} className="w-20 h-20 rounded-full" />
                ) : (
                  <View className="w-20 h-20 rounded-full bg-neutral-700 items-center justify-center">
                    <Text className="text-white text-3xl">
                      {user.username?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Name */}
              <Text className="text-white text-xl font-semibold text-center mt-3">
                {user.username}
              </Text>
              <Text className="text-gray-400 text-center">@{user.handle}</Text>

              {user.bio && (
                <Text className="text-gray-300 text-center mt-2 px-6">{user.bio}</Text>
              )}

              {currentUid !== uid && relationship === "received" ? (
                <View className="mt-5 flex-row gap-3">
                  <TouchableOpacity
                    disabled={loading}
                    onPress={acceptFriendRequest}
                    className="flex-1 bg-green-600 py-3 rounded-xl"
                  >
                    <Text className="text-white font-semibold text-center">
                      Accept
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={loading}
                    onPress={rejectFriendRequest}
                    className="flex-1 bg-red-600 py-3 rounded-xl"
                  >
                    <Text className="text-white font-semibold text-center">
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : currentUid !== uid ? (
                <View className="mt-5 mb-2">
                  <TouchableOpacity
                    disabled={buttonDisabled}
                    onPress={sendFriendRequest}
                    className={`mx-auto px-5 py-3 rounded-xl w-full ${
                      buttonDisabled ? "bg-gray-700" : "bg-blue-600"
                    }`}
                  >
                    <Text className="text-white font-semibold text-center">
                      {loading ? "Processing..." : buttonLabel}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

            </>
          )}

        </View>
      </View>
    </Modal>
  );
}
