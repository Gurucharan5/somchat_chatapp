import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { Button, Text, View } from "react-native";
import { auth } from "../../services/firebase";

export default function Home() {
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/signin");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-black dark:text-white">
        Welcome to Home! 🎉
      </Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
