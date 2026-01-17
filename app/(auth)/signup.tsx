import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { registerWithEmail } from "../../services/authService";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    try {
      const user = await registerWithEmail(email, password);
      console.log("Registered", user.uid);
      router.replace("/home");
    } catch (e: any) {
      console.log(e.message);
    }
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <Text className="text-3xl font-bold text-black dark:text-white mb-8">Create Account</Text>

      <TextInput
        placeholder="Email"
        className="border border-gray-300 dark:border-neutral-700 rounded-xl px-4 py-3 mb-3 text-black dark:text-white"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        className="border border-gray-300 dark:border-neutral-700 rounded-xl px-4 py-3 mb-5 text-black dark:text-white"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleSignUp}
        className="bg-blue-600 py-4 rounded-xl"
      >
        <Text className="text-center text-white font-semibold">Sign Up</Text>
      </TouchableOpacity>

      <Text className="text-center text-neutral-500 dark:text-neutral-400 mt-4">
        Already have an account?{" "}
        <Link href="/signin" className="text-blue-600 dark:text-blue-400">
          Sign In
        </Link>
      </Text>
    </View>
  );
}
