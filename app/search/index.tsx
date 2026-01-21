import BottomSheetUserProfile from "@/components/BottomSheetUserProfile";
import { db } from "@/services/firebase";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SearchScreen() {
  const [input, setInput] = useState("");
  const debounced = useDebounce(input, 300);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    const run = async () => {
      const text = debounced.trim().toLowerCase();

      if (!text.startsWith("@")) {
        setResults([]);
        return;
      }

      const handle = text.replace("@", "");
      if (handle.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const snap = await getDocs(
          query(
            collection(db, "users"),
            where("handle_lower", "==", handle)
          )
        );

        const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setResults(users);
      } catch (e) {
        console.error("Search error:", e);
      }

      setLoading(false);
    };

    run();
  }, [debounced]);

  return (
    <View className="flex-1 bg-black px-4 pt-14">

      {/* Search Bar */}
      <View className="flex-row items-center bg-neutral-900 px-4 py-3 rounded-xl">
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Search handle..."
          placeholderTextColor="#666"
          autoCapitalize="none"
          className="ml-3 flex-1 text-white"
        />
        {input.length > 0 && (
          <TouchableOpacity onPress={() => setInput("")}>
            <Ionicons name="close" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <View className="mt-5 flex-1">
        {loading && <Text className="text-gray-400">Searching...</Text>}

        {!loading && results.length === 0 && input.length > 0 && (
          <Text className="text-gray-500">No results found.</Text>
        )}

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedUser(item);
                setSheetVisible(true);
              }}
              className="p-3 border-b border-neutral-800"
            >
              <Text className="text-white font-semibold">{item.username}</Text>
              <Text className="text-gray-400">@{item.handle}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Bottom Sheet for User */}
      <BottomSheetUserProfile
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        user={selectedUser}
      />

    </View>
  );
}
