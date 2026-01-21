import BottomSheetUserProfile from "@/components/BottomSheetUserProfile";
import { auth, db as firestore } from "@/services/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function NotificationsScreen() {
  const currentUid = auth.currentUser?.uid;
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string>("");

  useEffect(() => {
    markAllAsSeen();
  }, []);


  useEffect(() => {
    if (!currentUid) return;

    const q = query(
      collection(firestore, "notifications"),
      where("uid", "==", currentUid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setNotifications(list);
    });

    return unsub;
  }, []);

  const markAllAsSeen = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(firestore, "notifications"),
      where("uid", "==", uid),
      where("seen", "==", false)
    );

    const snap = await getDocs(q);
    if (snap.empty) return;

    const batch = writeBatch(firestore);

    snap.docs.forEach((docSnap) => {
      batch.update(docSnap.ref, { seen: true });
    });

    await batch.commit();
  };
  const openUserProfile = async (fromUid: string) => {
    console.log("Open user profile for UID:", fromUid);
    const snap = await getDoc(doc(firestore, "users", fromUid));
    if (!snap.exists()) return;

    setSelectedUser({
      id: snap.id,
      ...snap.data(),
    });

    setSheetVisible(true);
  };


  return (
    <View className="flex-1 bg-black px-4 pt-6">
      <Text className="text-white text-xl font-semibold mb-4">
        Notifications
      </Text>

      {notifications.length === 0 ? (
        <Text className="text-gray-400 text-center mt-10">
          No notifications yet
        </Text>
      ) : (
        notifications.map((item) => (
          <NotificationItem key={item.id} item={item} onPress={()=> {
            setSelectedNotificationId(item.id);
            openUserProfile(item.fromUid)
          
          } } />
        ))
      )}
      <BottomSheetUserProfile
        visible={sheetVisible}
        user={selectedUser}
        forceRelationship="received"
        notificationId={selectedNotificationId}
        onClose={() => {
          setSheetVisible(false);
          setSelectedUser(null);
        }}
      />

    </View>
  );
}

function NotificationItem({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) {
  if (item.type !== "friend_request") return null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View className="bg-neutral-900 rounded-xl p-4 mb-3">
        <Text className="text-white font-medium">
          Friend request
        </Text>

        <Text className="text-gray-400 text-sm mt-1">
          Tap to respond
        </Text>

        <Text className="text-gray-500 text-xs mt-2">
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
