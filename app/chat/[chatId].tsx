import { auth, db as firestore } from "@/services/firebase";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
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
 * TEMP UI-only messages
 * Will be replaced with Firestore later
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
    text: "Somchat is coming along nicely 😄",
    fromMe: true,
    time: "10:13",
  },
  {
    id: "4",
    text: "Nice! Feels like WhatsApp already 😉",
    fromMe: false,
    time: "10:14",
  },
];

export default function ChatScreen() {

  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [otherUser, setOtherUser] = useState<any>(null);

  const router = useRouter();
  const [text, setText] = useState("");
  const currentUid = auth.currentUser?.uid;
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);



  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(firestore, "chats", chatId, "messages"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setMessages(list);
    });

    return unsub;
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !currentUid) return;

    const unsub = onSnapshot(doc(firestore, "chats", chatId), (snap) => {
      const typing = snap.data()?.typing || {};
      const otherUid = Object.keys(typing).find(
        (u) => u !== currentUid
      );
      if (otherUid) {
        setOtherTyping(typing[otherUid]);
      }
    });

    return unsub;
  }, [chatId]);


  useEffect(() => {
    if (!chatId || !currentUid) return;

    const chatRef = doc(firestore, "chats", chatId);

    const unsub = onSnapshot(chatRef, async (snap) => {
      const members = snap.data()?.members || [];
      const otherUid = members.find((u: string) => u !== currentUid);
      if (!otherUid) return;

      const userSnap = await getDoc(doc(firestore, "users", otherUid));
      if (userSnap.exists()) {
        setOtherUser(userSnap.data());
      }
    });

    return unsub;
  }, [chatId]);


  useEffect(() => {
    if (!chatId || !currentUid) return;

    updateDoc(doc(firestore, "chats", chatId), {
      [`unreadCount.${currentUid}`]: 0,
    });
  }, [chatId]);
  const sendMessage = async () => {
    if (!text.trim() || !currentUid) return;

    const chatRef = doc(firestore, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    const messageText = text.trim();
    setText("");

    // 1️⃣ Add message
    await addDoc(messagesRef, {
      text: messageText,
      senderId: currentUid,
      createdAt: serverTimestamp(),
    });

    // 2️⃣ Find receiver
    // We already know this is 1-to-1
    // Fetch chat members once
    const chatSnap = await getDoc(chatRef);
    const members = chatSnap.data()?.members || [];
    const otherUid = members.find((u: string) => u !== currentUid);

    // 3️⃣ Update chat meta
    await updateDoc(chatRef, {
      lastMessage: messageText,
      lastMessageAt: serverTimestamp(),
      [`unreadCount.${otherUid}`]: increment(1),
    });
  };

  let typingTimeout: any;

  const setTyping = async (typing: boolean) => {
    if (!currentUid) return;

    await updateDoc(doc(firestore, "chats", chatId), {
      [`typing.${currentUid}`]: typing,
    });

    if (typingTimeout) clearTimeout(typingTimeout);

    if (typing) {
      typingTimeout = setTimeout(() => {
        updateDoc(doc(firestore, "chats", chatId), {
          [`typing.${currentUid}`]: false,
        });
      }, 1500);
    }
  };


  return (
    <View className="flex-1 bg-[#0f0f12]">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-12 pb-3 border-b border-white/10 bg-[#1c1b1e]">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Avatar */}
        <View className="w-9 h-9 rounded-full bg-gray-600 mr-3" />

        {/* Title */}
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">
            Username
          </Text>
          <Text className="text-gray-400 text-xs">
            {otherTyping
              ? "typing…"
              : otherUser?.online
              ? "online"
              : otherUser?.lastSeen?.toDate
              ? `last seen ${otherUser.lastSeen
                  .toDate()
                  .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : ""}
          </Text>

        </View>

        <TouchableOpacity>
          <Feather name="more-vertical" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <MessageBubble
            message={{
              text: item.text,
              fromMe: item.senderId === currentUid,
              time: item.createdAt?.toDate
                ? item.createdAt.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
            }}
          />
        )}
      />


      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-end px-3 py-2 border-t border-white/10 bg-[#1c1b1e]">
          <View className="flex-row items-center flex-1 bg-[#2a2a2e] rounded-full px-4 py-2">
            <TextInput
              value={text}
              onChangeText={(t) => {
                setText(t);
                setTyping(true);
              }}
              placeholder="Message"
              placeholderTextColor="#aaa"
              className="flex-1 text-white max-h-[120px]"
              multiline
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            className="ml-3 w-10 h-10 rounded-full bg-[#ff2bac] items-center justify-center"
          >
            <Feather name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------- Message Bubble ---------- */

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
      className={`mb-2 ${
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
