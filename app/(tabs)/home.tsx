import HomeHeader from "@/components/HomeHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import { auth, db as firestore } from "@/services/firebase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const currentUid = auth.currentUser?.uid;
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!currentUid || chats.length === 0) return;

    const fetchUsers = async () => {
      const map: Record<string, any> = {};

      await Promise.all(
        chats.map(async (chat) => {
          const otherUid = chat.members.find(
            (uid: string) => uid !== currentUid
          );

          if (!otherUid || usersMap[otherUid]) return;

          const snap = await getDoc(doc(firestore, "users", otherUid));
          if (snap.exists()) {
            map[otherUid] = snap.data();
          }
        })
      );

      if (Object.keys(map).length > 0) {
        setUsersMap((prev) => ({ ...prev, ...map }));
      }
    };

    fetchUsers();
  }, [chats]);

  useEffect(() => {
    if (!currentUid) return;

    const q = query(
      collection(firestore, "chats"),
      where("members", "array-contains", currentUid),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChats(list);
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <ScreenWrapper showPattern={true}>
      <View className="flex-1">
        {/* Header */}
        <View>
          <HomeHeader />
        </View>

        {/* Chat List */}
        {loading ? (
          <Text className="text-gray-400 text-center mt-10">
            Loading chats…
          </Text>
        ) : chats.length === 0 ? (
          <Text className="text-gray-500 text-center mt-10">
            No chats yet
          </Text>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 6 }}
            renderItem={({ item }) => (
              <ChatRow
                chat={item}
                currentUid={currentUid!}
                usersMap={usersMap}
              />
            )}
            ItemSeparatorComponent={() => (
              <View className="ml-16 border-b border-gray-800" />
            )}
          />

        )}
      </View>
    </ScreenWrapper>
      
  );
}

/* ---------- Chat Row ---------- */

function ChatRow({
  chat,
  currentUid,
  usersMap,
}: {
  chat: any;
  currentUid: string;
  usersMap: Record<string, any>;
}) {
  const otherUid = chat.members.find(
    (uid: string) => uid !== currentUid
  );
  const unread =
  chat.unreadCount?.[currentUid] ?? 0;

  const user = otherUid ? usersMap[otherUid] : null;

  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3"
      onPress={() => {
        console.log("Open chat:", chat.id);
        // Reset unread count
        updateDoc(doc(firestore, "chats", chat.id), {
          [`unreadCount.${currentUid}`]: 0,
        });

        router.push(`/chat/${chat.id}`);
      }}
    >
      {/* Avatar */}
      <View className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden items-center justify-center">
        {user?.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            className="w-full h-full"
          />
        ) : (
          <Text className="text-white font-semibold">
            {user?.username?.charAt(0)?.toUpperCase() || "?"}
          </Text>
        )}
      </View>

      <View className="flex-1 ml-3">
        <Text className="text-white font-semibold text-base">
          {user?.username || "Unknown"}
        </Text>
        <Text
          className="text-gray-400 mt-0.5"
          numberOfLines={1}
        >
          {chat.lastMessage || "No messages yet"}
        </Text>
      </View>

      <View className="items-end ml-2">
        <Text className="text-gray-400 text-xs">
          {chat.lastMessageAt?.toDate
            ? chat.lastMessageAt.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </Text>

        {unread > 0 ? (
          <View className="bg-[#ff2bac] min-w-[18px] h-[18px] px-1 rounded-full items-center justify-center mt-1">
            <Text className="text-white text-[11px] font-semibold">
              {unread > 99 ? "99+" : unread}
            </Text>
          </View>
        ) : (
          <Ionicons
            name="checkmark-done"
            size={18}
            color="#888"
            style={{ marginTop: 4 }}
          />
        )}

      </View>
    </TouchableOpacity>
  );
}
