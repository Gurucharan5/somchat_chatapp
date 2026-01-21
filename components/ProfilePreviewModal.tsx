import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  user: any;
  onClose: () => void;
};

export default function ProfilePreviewModal({ user, onClose }: Props) {
  // mock relationship for Phase 1:
  const [relationship, setRelationship] = useState<
    "none" | "sent" | "received" | "friends" | "rejected"
  >("none");

  const buttonLabel = {
    none: "Send Friend Request",
    sent: "Request Sent",
    received: "Respond to Request",
    friends: "Message",
    rejected: "Send Friend Request",
  }[relationship];

  const buttonDisabled = relationship === "sent";

  return (
    <Modal transparent animationType="fade">
      <View className="flex-1 bg-black/70 items-center justify-center px-6">

        <View className="bg-neutral-900 rounded-2xl p-6 w-80 items-center">
          
          {/* Close button */}
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={onClose}
          >
            <Ionicons name="close" size={20} color="#888" />
          </TouchableOpacity>
          
          {/* Avatar */}
          <View className="items-center mt-2">
            {user.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <View className="w-20 h-20 rounded-full bg-neutral-700 items-center justify-center">
                <Text className="text-white text-3xl">
                  {user.username?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Username */}
          <Text className="text-white text-lg font-semibold">
            {user.username}
          </Text>

          {/* Handle */}
          <Text className="text-gray-400 text-sm mb-4">
            @{user.handle}
          </Text>

          {/* Primary Button */}
          <TouchableOpacity
            disabled={buttonDisabled}
            className={`w-full py-2 rounded-lg ${
              buttonDisabled ? "bg-gray-700" : "bg-blue-600"
            }`}
            onPress={() => {
              if (relationship === "none") {
                setRelationship("sent"); // simulate sending request
              }
            }}
          >
            <Text className="text-white text-center font-semibold">
              {buttonLabel}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
