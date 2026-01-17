import Tabbar from "@/components/Tabbar";
import { Tabs } from "expo-router";
import React from "react";

const TabLayout = () => {
  return (
    <Tabs tabBar={props => <Tabbar {...props} />}>
      <Tabs.Screen name="home" options={{title: "Home", headerShown: false}}/>
      {/* <Tabs.Screen name="calls" options={{title: "Calls"}}/> */}
      <Tabs.Screen name="settings" options={{title: "Settings"}}/> 
      <Tabs.Screen name="profile" options={{title: "Profile"}}/>
      <Tabs.Screen name="search" options={{title: "Search"}}/>
    </Tabs>
  );
}

export default TabLayout;