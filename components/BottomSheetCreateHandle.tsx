import { auth, db } from "@/services/firebase";
import { useDebounce } from "@/src/hooks/useDebounce";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function BottomSheetCreateHandle({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const uid = auth.currentUser?.uid || "";
  const [handle, setHandle] = useState("");
  const [state, setState] = useState("idle"); // idle | checking | valid | taken | invalid
  const debounced = useDebounce(handle);

  const sanitize = (s: any) =>
    s.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);

  useEffect(() => {
    const h = sanitize(debounced);

    if (h.length < 3) {
      setState("invalid");
      return;
    }

    setState("checking");

    const check = async () => {
      const snap = await getDocs(
        query(collection(db, "users"), where("handle_lower", "==", h))
      );
      setState(snap.empty ? "valid" : "taken");
    };

    check();
  }, [debounced]);

  const submit = async () => {
    if (state !== "valid") return;

    await updateDoc(doc(db, "users", uid), {
      handle,
      handle_lower: handle.toLowerCase(),
      updatedAt: Date.now(),
    });

    onClose();
  };

  const color = {
    checking: "text-gray-400",
    valid: "text-green-400",
    taken: "text-red-400",
    invalid: "text-yellow-400",
    idle: "text-gray-400",
  }[state];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-neutral-900 p-6 rounded-t-3xl">
          <Text className="text-white text-xl font-semibold mb-4">
            Claim your Handle
          </Text>

          <TextInput
            value={handle}
            onChangeText={(t) => setHandle(sanitize(t))}
            placeholder="@username"
            placeholderTextColor="#666"
            className="text-white bg-neutral-800 px-4 py-3 rounded-xl"
          />

          <Text className={`mt-2 text-sm ${color}`}>
            {state === "checking" && "Checking…"}
            {state === "valid" && "Available ✓"}
            {state === "taken" && "Handle already taken"}
            {state === "invalid" && "Min 3 characters, only letters/numbers/_"}
          </Text>

          <TouchableOpacity
            disabled={state !== "valid"}
            onPress={submit}
            className={`mt-5 py-3 rounded-xl ${
              state === "valid" ? "bg-blue-600" : "bg-neutral-700"
            }`}
          >
            <Text className="text-center text-white font-semibold">
              Claim Handle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="mt-3">
            <Text className="text-center text-gray-400">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
