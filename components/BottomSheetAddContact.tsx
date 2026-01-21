import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function BottomSheetAddContact({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="slide">
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50"
      />

      {/* Sheet */}
      <View className="bg-[#111] p-5 border-t border-[#1f1f1f] rounded-t-2xl">
        <Text className="text-white text-lg font-semibold mb-4">
          Add Contact
        </Text>

        {/* Search Username */}
        <TouchableOpacity className="flex-row items-center py-3 border-b border-[#1f1f1f]" onPress={() => router.push("/search")}>
          <Ionicons name="search-outline" size={22} color="white" />
          <Text className="text-white text-[15px] ml-3">Search by Username</Text>
        </TouchableOpacity>

        {/* Scan QR */}
        <TouchableOpacity className="flex-row items-center py-3 border-b border-[#1f1f1f]">
          <Ionicons name="qr-code-outline" size={22} color="white" />
          <Text className="text-white text-[15px] ml-3">Scan QR Code</Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity onPress={onClose} className="py-3">
          <Text className="text-red-500 text-center text-[15px] font-semibold">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

