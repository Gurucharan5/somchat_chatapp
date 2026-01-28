import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useLocalUser } from "@/src/hooks/useLocalUser";
import { scale } from "@/utils/styling";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import NewChatBottomSheet from "./NewChatBottomSheet";

export default function HomeHeader() {
  const user = useLocalUser();
  const [newChatVisible, setNewChatVisible] = useState(false);

  return (
    <>
      <BlurView
        intensity={Platform.OS === "ios" ? 50 : 30}
        tint="dark"
        style={{
          paddingHorizontal: spacingX._20,
          paddingVertical: spacingY._15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        {/* Left Avatar */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: scale(36),
            height: scale(36),
            borderRadius: radius.full,
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.15)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Feather name="user" size={18} color={colors.white} />
          )}
        </TouchableOpacity>

        {/* Title */}
        <Text
          style={{
            color: colors.white,
            fontWeight: "600",
            fontSize: scale(18),
            letterSpacing: 0.3,
          }}
        >
          Chats
        </Text>

        {/* Right Actions */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacingX._15,
          }}
        >
          <TouchableOpacity
            onPress={() => setNewChatVisible(true)}
            activeOpacity={0.6}
            style={{
              width: scale(32),
              height: scale(32),
              borderRadius: radius.full,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <Feather name="edit-3" size={18} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              width: scale(32),
              height: scale(32),
              borderRadius: radius.full,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <Feather name="more-horizontal" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </BlurView>

      <NewChatBottomSheet
        visible={newChatVisible}
        onClose={() => setNewChatVisible(false)}
        onAddFriends={() => {
          setNewChatVisible(false);
        }}
        onCreateGroup={() => {
          setNewChatVisible(false);
        }}
      />
    </>
  );
}
