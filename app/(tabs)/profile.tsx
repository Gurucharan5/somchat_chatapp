import { auth } from "@/services/firebase";
import { useLocalUser } from "@/src/hooks/useLocalUser";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const user = useLocalUser();

  const logout = async () => {
    await auth.signOut();
    router.replace("/(auth)/Welcome");
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black items-center pt-20 px-6">
      
      {/* Avatar */}
      <View className="w-28 h-28 rounded-full overflow-hidden bg-gray-700 mb-4">
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} className="w-full h-full" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white text-4xl font-semibold">
              {user.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Username */}
      <Text className="text-white text-2xl font-semibold">{user.username}</Text>

      {/* Email */}
      <Text className="text-gray-400 mt-1">{user.email ?? "No email"}</Text>

      {/* Bio */}
      {user.bio ? (
        <Text className="text-gray-300 mt-3 text-center">{user.bio}</Text>
      ) : (
        <Text className="text-gray-600 mt-3 italic">No bio yet.</Text>
      )}

      {/* Logout Button */}
      <TouchableOpacity
        onPress={logout}
        className="mt-10 bg-red-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
