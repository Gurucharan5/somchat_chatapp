import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-[#1c1b1e]">

      {/* Left Bubble */}
      <TouchableOpacity className="px-4 py-3 rounded-full border border-white/20 bg-white">
        <Text className="text-slate-900 font-semibold font-">Edit</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-lg font-semibold text-white">Chats</Text>

      {/* Right Bubble */}
      <View className="flex-row items-center px-4 py-2.5 rounded-full border border-white/20 bg-white">
        <TouchableOpacity className="mr-5">
          <Feather name="edit-3" size={18} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="w-8 h-8 rounded-full bg-red-400 items-center justify-center">
            <Feather name="user" size={18} color="black" />
        </TouchableOpacity>

      </View>

    </View>
  );
}
