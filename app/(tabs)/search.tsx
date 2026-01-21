import BottomSheetAddContact from "@/components/BottomSheetAddContact";
import { auth, db as firestore } from "@/services/firebase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";



export default function ExploreScreen() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(firestore, "notifications"),
      where("uid", "==", uid),
      where("seen", "==", false)
    );

    const unsub = onSnapshot(q, (snap) => {
      setUnreadCount(snap.size);
    });

    return unsub;
  }, []);


  return (
    <View className="flex-1 bg-[#0d0d0d] px-5 pt-10">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-[26px] font-bold">
            Explore
          </Text>

         <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            // later: navigation.navigate("Notifications")r
            router.push("/notifications/NotificationsScreen");
            console.log("Notifications pressed");
          }}
          className="p-2"
        >
          <View className="relative">
            <Ionicons
              name="notifications-outline"
              size={26}
              color="white"
            />

            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                <Text className="text-white text-[10px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        </View>


        {/* Add Contact */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSheetVisible(true)}
          className="bg-[#111] rounded-2xl p-4 mb-3 flex-row items-center border border-[#1f1f1f]"
        >
          <Ionicons name="person-add-outline" size={26} color="#4f46e5" />
          <View className="ml-3">
            <Text className="text-white font-semibold text-[17px]">Add Contact</Text>
            <Text className="text-gray-400 text-[13px] mt-[2px]">
              Find friends using username or QR
            </Text>
          </View>
        </TouchableOpacity>

        {/* Doodle */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-[#111] rounded-2xl p-4 mb-3 flex-row items-center border border-[#1f1f1f]"
        >
          <Ionicons name="color-palette-outline" size={26} color="#10b981" />
          <View className="ml-3">
            <Text className="text-white font-semibold text-[17px]">Doodle</Text>
            <Text className="text-gray-400 text-[13px] mt-[2px]">
              Create drawings & share privately
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Sheet */}
      <BottomSheetAddContact
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
}
