// firebase.ts
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCA8gKSaAwtFDizVQpBoLB9b8Fqyd34BLY",
  authDomain: "somchat-99830.firebaseapp.com",
  projectId: "somchat-99830",
  storageBucket: "somchat-99830.firebasestorage.app",
  messagingSenderId: "239853294350",
  appId: "1:239853294350:web:5a1b168ce7d67c2e59bd5f"
};
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// export const auth = getAuth(app);
export const db = getFirestore(app);
// firebase.ts
// firebase.ts
// import { initializeApp } from "firebase/app";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyCA8gKSaAwtFDizVQpBoLB9b8Fqyd34BLY",
//   authDomain: "somchat-99830.firebaseapp.com",
//   projectId: "somchat-99830",
//   storageBucket: "somchat-99830.firebasestorage.app",
//   messagingSenderId: "239853294350",
//   appId: "1:239853294350:web:5a1b168ce7d67c2e59bd5f"
// };

// const app = initializeApp(firebaseConfig);

// // 👇 Use ReactNativeAsyncStorage instead of AsyncStorage
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

// export const db = getFirestore(app);