import { colors } from "@/constants/theme";
import { useLocalUser } from "@/src/hooks/useLocalUser";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import NewChatBottomSheet from "./NewChatBottomSheet";
import Typo from "./Typo";

export default function HomeHeader() {
  const user = useLocalUser();
  const [newChatVisible, setNewChatVisible] = useState(false);
  return (
    <View className="flex-row items-center justify-between px-4 py-3">

      {/* Left Bubble */}
      <TouchableOpacity className="px-4 py-3 rounded-full border border-white/20 bg-white">
        <Text className="text-slate-900 font-semibold font-">Edit</Text>
      </TouchableOpacity>

      {/* Title */}
      {/* <Text className="text-lg font-semibold text-white">Chats</Text> */}
      <Typo color={colors.white} size={20} fontWeight={"bold"}>Chats</Typo>
      {/* Right Bubble */}
      <View className="flex-row items-center px-4 py-2.5 rounded-full border border-white/20 bg-white">
        <TouchableOpacity className="mr-5" onPress={()=> setNewChatVisible(true)}>
          <Feather name="edit-3" size={18} color="black" />
        </TouchableOpacity>
        {/* <TouchableOpacity className="w-8 h-8 rounded-full bg-red-400 items-center justify-center">
            <Feather name="user" size={18} color="black" />
        </TouchableOpacity> */}
        {/* Avatar bubble */}
        <TouchableOpacity className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 items-center justify-center">
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              className="w-full h-full"
            />
          ) : (
            <Feather name="user" size={18} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <NewChatBottomSheet
        visible={newChatVisible}
        onClose={() => setNewChatVisible(false)}
        onAddFriends={() => {
          setNewChatVisible(false);
          // navigate to Search / Add friends
        }}
        onCreateGroup={() => {
          setNewChatVisible(false);
          // navigate to Create Group (later)
        }}
      />


    </View>
  );
}
