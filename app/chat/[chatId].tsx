import Input from "@/components/Input";
import MessageItem from "@/components/MessageItem";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { auth, db as firestore } from "@/services/firebase";
import { scale, verticalScale } from "@/utils/styling";
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
import * as Icons from 'phosphor-react-native';
import { useEffect, useState } from "react";
import {
  FlatList, Keyboard, KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
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
  const [message, setMessage] = useState('');

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const onPickFile = () => {

  }



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
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <KeyboardAvoidingView 
        behavior={keyboardVisible ? (Platform.OS === 'ios' ? 'padding' : 'height') : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // ← try 0 or small value
      >
        {/* Header */}
        
        {/* messages */}
        <View style= {styles.content}>
          <FlatList 
            data={messages}
            inverted={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageContent}
            renderItem={({item}) => (
              <MessageItem item = {item} isDirect={false}/>
            )}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.footer}>
            <Input 
              value={text}
              onChangeText={setText}
              containerStyle={{
                paddingLeft: spacingX._10,
                paddingRight: scale(65),
                borderWidth: 0,
              }}
              placeholder="Type Message..."
              icon= {
                <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                  <Icons.PlusIcon
                    color={colors.black}
                    weight="bold"
                    size={verticalScale(22)}
                  />
                </TouchableOpacity>
              }
            />
            <View style={styles.inputRightIcon}>
              <TouchableOpacity style={styles.inputIcon} onPress={sendMessage}>
                <Icons.PaperPlaneTiltIcon
                  color={colors.black}
                  weight="fill"
                  size={verticalScale(22)}
                />

              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._12,
  },
  content: {
    flex : 1,
    backgroundColor:  colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: 'hidden',
    paddingHorizontal: spacingX._15,
  },
  footer: {
    paddingTop: spacingY._7,
    paddingBottom: verticalScale(22),
  },
  messagesContainer: {
    flex: 1,
  },
  messageContent: {
    padding: spacingX._15,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  inputRightIcon: {
    position: 'absolute',
    right: scale(10),
    top: verticalScale(15),
    paddingLeft: spacingX._12,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.neutral300
  },
  selectedFile: {
    position: 'absolute',
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius.full,
    alignSelf: 'center'
  }
})