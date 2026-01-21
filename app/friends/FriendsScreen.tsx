import { auth, db as firestore } from "@/services/firebase";
import {
    collection,
    onSnapshot,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function FriendsScreen() {
  const currentUid = auth.currentUser?.uid;
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUid) return;

    // Listen to ALL contacts and filter client-side (TEMP, safe for now)
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
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-gray-400">Loading friends…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-4 pt-6">
      <Text className="text-white text-xl font-semibold mb-4">
        Friends
      </Text>

      {friends.length === 0 ? (
        <Text className="text-gray-500 mt-10 text-center">
          No friends yet
        </Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FriendItem friend={item} />
          )}
        />
      )}
    </View>
  );
}
function FriendItem({ friend }: { friend: any }) {
  return (
    <TouchableOpacity
      className="p-4 border-b border-neutral-800"
      activeOpacity={0.8}
      onPress={() => {
        console.log("Open chat with", friend.uid);
      }}
    >
      <Text className="text-white font-semibold">
        {friend.uid}
      </Text>

      <Text className="text-gray-500 text-xs mt-1">
        Friend
      </Text>
    </TouchableOpacity>
  );
}
