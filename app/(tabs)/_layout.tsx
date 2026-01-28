import Tabbar from "@/components/Tabbar";
import { Tabs } from "expo-router";
import React from "react";

const TabLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <Tabbar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,          // ← hide all labels globally
        headerShown: false,              // most tabs don't need header
      }}
    >
      <Tabs.Screen name="home"    options={{ title: "Home"    }} />
      <Tabs.Screen name="search"  options={{ title: "Search"  }} />
      {/* <Tabs.Screen name="calls" options={{ title: "Calls" }} /> */}
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default TabLayout;