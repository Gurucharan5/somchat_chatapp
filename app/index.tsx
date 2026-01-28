import { colors } from '@/constants/theme';
import { StatusBar, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AnimatedSplash() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />
      <Animated.Image
        entering={FadeInDown.duration(800).springify().delay(300)}
        source={require("../assets/images/somchat_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "23%",
    aspectRatio: 1,
  },
});