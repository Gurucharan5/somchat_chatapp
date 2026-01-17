import type { SignInSuccessResponse } from "@react-native-google-signin/google-signin";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Link } from "expo-router";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../services/firebase";

export default function Welcome() {
  async function handleGoogleSignIn() {
    try {
      console.log("Starting Google Sign-In");
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const signInResult = await GoogleSignin.signIn();
      console.log("Google Sign-In Result:", signInResult);

      const userInfo = signInResult as SignInSuccessResponse;
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        console.warn("❌ No idToken returned");
        return;
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      console.log("🔥 Firebase login success");
    } 
    catch (error: any) {
      console.warn("Google Sign-In error:", error.code, error.message);
    }
  }

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white dark:bg-black">
      <Text className="text-4xl font-bold text-center text-black dark:text-white mb-10">
        Welcome 👋
      </Text>

      <Link href="/signin" asChild>
        <TouchableOpacity className="w-full bg-blue-600 py-4 rounded-xl mb-3">
          <Text className="text-center text-white font-semibold text-lg">Sign In</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/signup" asChild>
        <TouchableOpacity className="w-full bg-gray-200 dark:bg-neutral-800 py-4 rounded-xl mb-3">
          <Text className="text-center text-black dark:text-white font-semibold text-lg">
            Create Account
          </Text>
        </TouchableOpacity>
      </Link>

      <Text className="text-neutral-500 dark:text-neutral-400 my-4">or</Text>

      <TouchableOpacity
        onPress={handleGoogleSignIn}
        className="w-full border border-gray-300 dark:border-neutral-700 py-4 rounded-xl"
      >
        <Text className="text-center text-gray-800 dark:text-white font-semibold text-lg">
          Continue with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
