import { auth, db as firestore } from "@/services/firebase";
import { useLocalUser } from "@/src/hooks/useLocalUser";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const PREDEFINED_HOBBIES = [
  "Football",
  "Basketball",
  "Chess",
  "Gaming",
  "Coding",
  "Music",
  "Drawing",
  "Photography",
  "Cooking",
];


export default function ProfileScreen() {
  const user = useLocalUser();
  const [editModal, setEditModal] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [customHobby, setCustomHobby] = useState("");
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (user) {
      console.log("Setting temp fields from user:", user);

      setTempUsername(user.username ?? "");
      setTempBio(user.bio ?? "");

      let parsedHobbies: string[] = [];

      if (Array.isArray(user.hobbies)) {
        parsedHobbies = user.hobbies;
      } else if (typeof user.hobbies === "string") {
        try {
          parsedHobbies = JSON.parse(user.hobbies);
        } catch {
          parsedHobbies = [];
        }
      }

      setHobbies(parsedHobbies);
    }
  }, [user]);



  const logout = async () => {
    await auth.signOut();
    router.replace("/(auth)/Welcome");
  };


  const saveChanges = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const userRef = doc(firestore, "users", user.uid);

      await updateDoc(userRef, {
        username: tempUsername,
        bio: tempBio,
        hobbies: hobbies,
        updatedAt: Date.now(),
      });

      console.log("[SAVE] Saving to Firestore", {
        username: tempUsername,
        bio: tempBio,
        hobbies,
      });

      // Firestore updated — syncUsers() will update SQLite
      setEditModal(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setSaving(false);
    }
  };



  const openEditModal = () => {
    setTempUsername(user?.username ?? "");
    setTempBio(user?.bio ?? "");
    setEditModal(true);
  };

  const chooseAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      // TODO: upload to Cloudinary & update Firestore
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingTop: 60 }}>
        {/* Edit Icon Button */}
        <TouchableOpacity
          onPress={openEditModal}
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 10,
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: 8,
            borderRadius: 999,
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={22} color="white" />
        </TouchableOpacity>
        {/* Avatar */}
        <TouchableOpacity onPress={chooseAvatar} activeOpacity={0.8}>
          <View className="w-32 h-32 rounded-full items-center justify-center mb-4"
            style={{
              backgroundColor: "#111",
              borderWidth: 2,
              borderColor: "#4f46e5",
              shadowColor: "#4f46e5",
              shadowRadius: 12,
              shadowOpacity: 0.6,
            }}
          >
            {user.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Text className="text-white text-4xl font-semibold">
                {user.username?.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Username */}
        <Text className="text-white text-2xl font-semibold">{user.username}</Text>

        {/* Email */}
        <Text className="text-gray-400 mt-1 text-sm">{user.email}</Text>

        {/* Bio */}
        <View className="mt-4 px-4">
          {user.bio ? (
            <Text className="text-gray-300 text-center text-base">{user.bio}</Text>
          ) : (
            <Text className="text-gray-600 italic text-center">No bio yet.</Text>
          )}
        </View>

        {/* Hobbies */}
        {hobbies.length > 0 ? (
          <View className="flex-row flex-wrap justify-center gap-2 mt-3 px-4">
            {hobbies.map((hobby) => (
              <View key={hobby} className="px-3 py-1 rounded-full bg-neutral-800">
                <Text className="text-white text-sm">{hobby}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-600 mt-3 italic">
            No hobbies added yet.
          </Text>
        )}


        

        {/* Logout Button */}
        <TouchableOpacity
          onPress={logout}
          className="mt-3 px-6 py-3 rounded-full bg-red-500"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/70 px-6">
          <View className="w-full bg-neutral-900 rounded-2xl p-6">
            <Text className="text-white text-lg font-semibold mb-4">Edit Profile</Text>

            <Text className="text-gray-400 mb-1">Username</Text>
            <TextInput
              value={tempUsername}
              onChangeText={setTempUsername}
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg mb-4"
            />

            <Text className="text-gray-400 mb-1">Bio</Text>
            <TextInput
              value={tempBio}
              onChangeText={setTempBio}
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg h-24"
              multiline
            />

            <Text className="text-gray-400 mb-2 mt-4">Hobbies</Text>

            <View className="flex-row flex-wrap gap-2 mb-3">
              {PREDEFINED_HOBBIES.map((hobby) => {
                const active = hobbies.includes(hobby);
                return (
                  <TouchableOpacity
                    key={hobby}
                    onPress={() => {
                      if (active) setHobbies(hobbies.filter(h => h !== hobby));
                      else setHobbies([...hobbies, hobby]);
                    }}
                    className={`px-3 py-1.5 rounded-full ${
                      active ? "bg-blue-600" : "bg-neutral-800"
                    }`}
                  >
                    <Text className="text-white text-sm">{hobby}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Hobby Input */}
            <TextInput
              placeholder="Add custom hobby..."
              placeholderTextColor="#666"
              value={customHobby}
              onChangeText={setCustomHobby}
              onSubmitEditing={() => {
                if (customHobby && !hobbies.includes(customHobby)) {
                  setHobbies([...hobbies, customHobby]);
                  setCustomHobby("");
                }
              }}
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg"
            />


            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={() => setEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700"
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveChanges}
                disabled={saving}
                className={`px-4 py-2 rounded-lg ${saving ? "bg-gray-600" : "bg-blue-600"}`}
              >
                <Text className="text-white">
                  {saving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
