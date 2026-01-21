import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

/**
 * TEMP dummy messages (UI only)
 * We’ll replace this with Firestore next.
 */
const DUMMY_MESSAGES = [
  {
    id: "1",
    text: "Hey 👋",
    fromMe: false,
    time: "10:12",
  },
  {
    id: "2",
    text: "Hi! How are you?",
    fromMe: true,
    time: "10:13",
  },
  {
    id: "3",
    text: "I’m building Somchat 😄",
    fromMe: true,
    time: "10:13",
  },
  {
    id: "4",
    text: "Nice! Looks like WhatsApp already 😉",
    fromMe: false,
    time: "10:14",
  },
];

export default function ChatScreen() {
  const [text, setText] = useState("");

  return (
    <View className="flex-1 bg-[#0f0f12]">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-12 pb-3 border-b border-white/10 bg-[#1c1b1e]">
        <TouchableOpacity className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Avatar */}
        <View className="w-9 h-9 rounded-full bg-gray-600 mr-3" />

        <View className="flex-1">
          <Text className="text-white font-semibold text-base">
            Username
          </Text>
          <Text className="text-gray-400 text-xs">
            online
          </Text>
        </View>

        <TouchableOpacity className="ml-3">
          <Feather name="more-vertical" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={DUMMY_MESSAGES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <MessageBubble message={item} />
        )}
        inverted
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center px-3 py-2 border-t border-white/10 bg-[#1c1b1e]">
          <View className="flex-row items-center flex-1 bg-[#2a2a2e] rounded-full px-4 py-2">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Message"
              placeholderTextColor="#aaa"
              className="flex-1 text-white"
              multiline
            />
          </View>

          <TouchableOpacity className="ml-3 w-10 h-10 rounded-full bg-[#ff2bac] items-center justify-center">
            <Feather name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
function MessageBubble({
  message,
}: {
  message: {
    text: string;
    fromMe: boolean;
    time: string;
  };
}) {
  const isMe = message.fromMe;

  return (
    <View
      className={`mb-2 flex ${
        isMe ? "items-end" : "items-start"
      }`}
    >
      <View
        className={`max-w-[75%] px-3 py-2 rounded-2xl ${
          isMe
            ? "bg-[#ff2bac] rounded-br-sm"
            : "bg-[#2a2a2e] rounded-bl-sm"
        }`}
      >
        <Text className="text-white text-base">
          {message.text}
        </Text>

        <Text className="text-white/70 text-[10px] mt-1 self-end">
          {message.time}
        </Text>
      </View>
    </View>
  );
}
