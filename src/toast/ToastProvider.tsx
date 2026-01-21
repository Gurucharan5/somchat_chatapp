// // import React, { useCallback, useState } from "react";
// // import { Animated, Dimensions, StyleSheet, Text } from "react-native";
// // import { ToastContext, ToastOptions } from "./ToastContext";

// // const SCREEN_WIDTH = Dimensions.get("window").width;

// // export function ToastProvider({ children }: any) {
// //   const [message, setMessage] = useState("");
// //   const [visible, setVisible] = useState(false);
// //   const opacity = new Animated.Value(0);

// //   const showToast = useCallback((msg: string, options: ToastOptions = {}) => {
// //     const duration = options.duration ?? 2000;
// //     setMessage(msg);
// //     setVisible(true);

// //     // Fade In
// //     Animated.timing(opacity, {
// //       toValue: 1,
// //       duration: 200,
// //       useNativeDriver: true,
// //     }).start();

// //     // Fade Out after duration
// //     setTimeout(() => {
// //       Animated.timing(opacity, {
// //         toValue: 0,
// //         duration: 200,
// //         useNativeDriver: true,
// //       }).start(() => setVisible(false));
// //     }, duration);
// //   }, []);

// //   return (
// //     <ToastContext.Provider value={{ showToast }}>
// //       {children}

// //       {visible && (
// //         <Animated.View
// //           style={[
// //             styles.toastContainer,
// //             {
// //               opacity,
// //               transform: [
// //                 { translateY: opacity.interpolate({
// //                     inputRange: [0, 1],
// //                     outputRange: [20, 0]
// //                   })
// //                 }
// //               ],
// //             },
// //           ]}
// //         >
// //           <Text style={styles.toastText}>{message}</Text>
// //         </Animated.View>
// //       )}
// //     </ToastContext.Provider>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   toastContainer: {
// //     position: "absolute",
// //     bottom: 80,
// //     left: SCREEN_WIDTH * 0.1,
// //     width: SCREEN_WIDTH * 0.8,
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     backgroundColor: "rgba(0,0,0,0.85)",
// //     borderRadius: 10,
// //     alignItems: "center",
// //   },
// //   toastText: {
// //     color: "#fff",
// //     fontSize: 14,
// //     fontWeight: "500",
// //   },
// // });
// import React, { useCallback, useRef, useState } from "react";
// import {
//     Animated,
//     Dimensions,
//     Platform,
//     StyleSheet,
//     Text
// } from "react-native";
// import { ToastContext, ToastOptions } from "./ToastContext";

// const SCREEN_WIDTH = Dimensions.get("window").width;

// export function ToastProvider({ children }: any) {
//   const [message, setMessage] = useState("");
//   const [visible, setVisible] = useState(false);
//   const opacity = useRef(new Animated.Value(0)).current;
//   const translateY = useRef(new Animated.Value(-50)).current; // start above screen

//   const showToast = useCallback((msg: string, options: ToastOptions = {}) => {
//     const duration = options.duration ?? 2000;

//     setMessage(msg);
//     setVisible(true);

//     // Slide-down + fade in
//     Animated.parallel([
//       Animated.timing(opacity, {
//         toValue: 1,
//         duration: 180,
//         useNativeDriver: true,
//       }),
//       Animated.timing(translateY, {
//         toValue: Platform.OS === "ios" ? 60 : 40, // looks nice under status bar
//         duration: 180,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Hide after duration
//     setTimeout(() => {
//       Animated.parallel([
//         Animated.timing(opacity, {
//           toValue: 0,
//           duration: 150,
//           useNativeDriver: true,
//         }),
//         Animated.timing(translateY, {
//           toValue: -50,
//           duration: 150,
//           useNativeDriver: true,
//         }),
//       ]).start(() => {
//         setVisible(false);
//       });
//     }, duration);
//   }, []);

//   return (
//     <ToastContext.Provider value={{ showToast }}>
//       {children}

//       {visible && (
//         <Animated.View
//           style={[
//             styles.toastContainer,
//             {
//               opacity,
//               transform: [{ translateY }],
//             },
//           ]}
//         >
//           <Text style={styles.toastText}>{message}</Text>
//         </Animated.View>
//       )}
//     </ToastContext.Provider>
//   );
// }

// const styles = StyleSheet.create({
//   toastContainer: {
//     position: "absolute",
//     top: 0,
//     left: (SCREEN_WIDTH - 250) / 2,
//     width: 250,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     backgroundColor: "rgba(0,0,0,0.85)",
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 9999,
//     elevation: 8,
//   },
//   toastText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//     textAlign: "center",
//   },
// });
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text
} from "react-native";
import { ToastContext, ToastOptions, ToastType } from "./ToastContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

const TYPE_COLORS: Record<ToastType, string> = {
  success: "#2ecc71",
  error: "#e74c3c",
  warning: "#f39c12",
  info: "#3498db",
  default: "rgba(0,0,0,0.85)",
};

export function ToastProvider({ children }: any) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("default");
  const [visible, setVisible] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;

  const triggerHaptics = (toastType: ToastType) => {
    switch (toastType) {
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "warning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  };

  const showToast = useCallback(
    (msg: string, options: ToastOptions = {}) => {
      const { duration = 2000, type = "default" } = options;

      setMessage(msg);
      setType(type);
      setVisible(true);

      triggerHaptics(type);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: Platform.OS === "ios" ? 60 : 40,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -50,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setVisible(false);
        });
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity,
              transform: [{ translateY }],
              backgroundColor: TYPE_COLORS[type],
            },
          ]}
        >
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 0,
    left: (SCREEN_WIDTH - 260) / 2,
    width: 260,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 8,
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
