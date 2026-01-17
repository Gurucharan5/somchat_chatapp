import HomeHeader from "@/components/HomeHeader";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const chats = [
  {
    id: "1",
    name: "Aii",
    message: "It's like I find a solution...",
    time: "1:50 PM",
    avatar: "https://i.pravatar.cc/150?img=3",
    delivered: true,
  },
  {
    id: "2",
    name: "Priya Prachi",
    message: "My brother totally reset my phone",
    time: "Fri",
    avatar: "https://i.pravatar.cc/150?img=7",
    delivered: true,
  },
  {
    id: "3",
    name: "Saved Messages",
    message: "Aii https://google.com",
    time: "Thu",
    avatar: "https://via.placeholder.com/100/4fb5f5",
  },
];

export default function Home() {
  return (
    <View className="flex-1 bg-[#1c1b1e]">
      {/* Header */}
      <View className="pt-12 pb-2">
        <HomeHeader />
      </View>
      

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 6 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row items-center px-4 py-3">
            <Image
              source={{ uri: item.avatar }}
              className="w-12 h-12 rounded-full"
            />
            <View className="flex-1 ml-3">
              <Text className="text-white font-semibold text-base">{item.name}</Text>
              <Text className="text-gray-400 mt-0.5" numberOfLines={1}>
                {item.message}
              </Text>
            </View>
            <View className="items-end ml-2">
              <Text className="text-gray-400 text-xs">{item.time}</Text>
              {item.delivered && (
                <Ionicons name="checkmark-done" size={18} color="#ff2bac" style={{ marginTop: 4 }} />
              )}
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View className="ml-16 border-b border-gray-800" />
        )}
      />
    </View>
  );
}
