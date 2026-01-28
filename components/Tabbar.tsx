import { colors, radius, spacingX } from '@/constants/theme';
import { useLocalUser } from '@/src/hooks/useLocalUser';
import { verticalScale } from '@/utils/styling';
import { Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';


// Assume you have a profile pic URL or local asset
const PROFILE_PIC = 'https://example.com/your-avatar.jpg'; // or require('../assets/profile.jpg')

function Tabbar({ state, descriptors, navigation }: BottomTabBarProps) {
  const user = useLocalUser();
  return (
    <BlurView
      intensity={90}           // 70–100, higher = more blur
      tint="dark"              // "dark" works great for your dark capsule
      style={styles.tabBar}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Special treatment for profile tab
        if (route.name === 'profile') {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.profilePill,
                isFocused && styles.profilePillFocused,
              ]}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: user?.avatarUrl || PROFILE_PIC }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          );
        }

        // Regular icon tabs
        let iconName: keyof typeof Feather.glyphMap = 'home';
        if (route.name === 'home')    iconName = 'home';
        if (route.name === 'search')  iconName = 'search';
        if (route.name === 'settings') iconName = 'settings';
        // add more as needed (calls → 'phone' etc.)

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              isFocused && styles.tabItemFocused,
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name={iconName}
              size={24}
              color={isFocused ? colors.primary : '#aaa'}
            />
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
}

export default Tabbar;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: verticalScale(18),           // good safe-area margin
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '92%',                        // almost full-width capsule
    height: verticalScale(64),           // taller for comfort
    backgroundColor: 'transparent',      // BlurView handles it
    borderRadius: radius.full,           // perfect capsule
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },

  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabItemFocused: {
    // Optional: subtle scale or bg
    transform: [{ scale: 1.08 }],
  },

  profilePill: {
    width: verticalScale(38),
    height: verticalScale(38),
    borderRadius: radius.full,
    overflow: 'hidden',
    marginHorizontal: spacingX._10,
    borderWidth: 2,
    borderColor: 'rgba(250,204,21,0.6)', // your primary color accent
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  profilePillFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },

  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
