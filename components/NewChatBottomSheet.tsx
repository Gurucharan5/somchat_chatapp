import { auth, db as firestore } from "@/services/firebase";
import { Feather } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddFriends: () => void;
  onCreateGroup: () => void;
};
const DUMMY_FRIENDS = Array.from({ length: 50 }).map((_, i) => ({
  id: `friend_${i}`,
  uid: `uid_${i}`,
  username: `Friend ${i + 1}`,
  handle: `friend${i + 1}`,
}));
const USE_DUMMY_DATA = false;

export default function NewChatBottomSheet({
  visible,
  onClose,
  onAddFriends,
  onCreateGroup,
}: Props) {
  const currentUid = auth.currentUser?.uid;
//   const [friends, setFriends] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>(
    USE_DUMMY_DATA ? DUMMY_FRIENDS : []
  );
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getChatId = (uid1: string, uid2: string) =>
  [uid1, uid2].sort().join("_");


  useEffect(() => {
    if (friends.length === 0) return;

    const fetchUsers = async () => {
      const map: Record<string, any> = {};

      await Promise.all(
        friends.map(async (f) => {
          if (usersMap[f.uid]) return; // already cached

          const snap = await getDoc(doc(firestore, "users", f.uid));
          if (snap.exists()) {
            map[f.uid] = snap.data();
          }
        })
      );

      if (Object.keys(map).length > 0) {
        setUsersMap((prev) => ({ ...prev, ...map }));
      }
    };

    fetchUsers();
  }, [friends]);


  useEffect(() => {
    if (!visible || !currentUid || USE_DUMMY_DATA) return;

    const q = query(collection(firestore, "contacts"));

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((doc: any) =>
          doc.id.startsWith(`${currentUid}_`)
        );

      setFriends(list);
      setLoading(false);
    });

    return unsub;
  }, [visible]);

  useEffect(() => {
    if (USE_DUMMY_DATA) setLoading(false);
  }, []);

  const openOrCreateChat = async (friendUid: string) => {
    if (!currentUid) return;

    const chatId = getChatId(currentUid, friendUid);
    const chatRef = doc(firestore, "chats", chatId);

    const snap = await getDoc(chatRef);

    if (!snap.exists()) {
      await setDoc(chatRef, {
        type: "direct",
        members: [currentUid, friendUid],
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastMessageAt: serverTimestamp(),
        unreadCount: {
          [currentUid]: 0,
          [friendUid]: 0,
        }
      });
    }

    onClose();

    // Navigate to Chat screen
    console.log("Open chat:", chatId);
    // navigation.navigate("Chat", { chatId });
  };

  const filteredFriends = useMemo(() => {
    if (!search.trim()) return friends;

    return friends.filter((f) => {
      const u = usersMap[f.uid];
      if (!u) return false;

      return (
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.handle?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [friends, usersMap, search]);


  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-[#1c1b1e] rounded-t-3xl pb-6 max-h-[90%]">

          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pt-5 pb-3">
            <View className="w-8" />
            <Text className="text-white text-lg font-semibold">
              New chat
            </Text>
            <TouchableOpacity onPress={onClose}>
              <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                <Feather name="x" size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="mx-4 mb-4 bg-white/10 rounded-xl px-3 py-2 flex-row items-center">
            <Feather name="search" size={16} color="#aaa" />
            <TextInput
              placeholder="Search name or number"
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              className="ml-2 flex-1 text-white"
            />
          </View>

          {/* Actions */}
          <View className="mx-4 mb-4 rounded-2xl bg-white/5 overflow-hidden">
            <ActionRow
              icon="users"
              label="New group"
              onPress={onCreateGroup}
            />
            <Divider />
            <ActionRow
              icon="user-plus"
              label="New contact"
              onPress={onAddFriends}
            />
          </View>

          {/* Friends */}
          {loading ? (
            <Text className="text-gray-500 text-center mt-6">
              Loading…
            </Text>
          ) : filteredFriends.length === 0 ? (
            <Text className="text-gray-500 text-center mt-6">
              No friends found
            </Text>
          ) : (
            <FlatList
              data={filteredFriends}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const user = usersMap[item.uid];
                if (!user) return null;

                return (
                  <FriendRow
                    user={user}
                    onPress={() => {
                      console.log("Start chat with", item.uid);
                      // onClose();
                      openOrCreateChat(item.uid);
                    }}
                  />
                );
              }}

            />
          )}
        </View>
      </View>
    </Modal>
  );
}

/* ---------- Sub Components ---------- */

function ActionRow({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-4"
    >
      <View className="w-9 h-9 rounded-full bg-green-600 items-center justify-center mr-4">
        <Feather name={icon} size={18} color="white" />
      </View>
      <Text className="text-white text-base font-medium">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Divider() {
  return <View className="h-px bg-white/10 ml-16" />;
}

function FriendRow({
  user,
  onPress,
}: {
  user: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3"
    >
      {/* Avatar */}
      <View className="w-11 h-11 rounded-full bg-gray-600 mr-4 overflow-hidden">
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            className="w-full h-full"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white font-semibold">
              {user.username?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Name */}
      <View>
        <Text className="text-white font-medium text-base">
          {user.username}
        </Text>
        <Text className="text-gray-400 text-xs mt-0.5">
          @{user.handle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

