/* eslint-disable prettier/prettier */
import { Tabs } from "expo-router";
import React from "react";

import TabBar from "@/components/TabBar";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemeProvider } from "@/context/themeContext";

export default function TabLayout() {
  return (
    // <ThemeProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props: React.JSX.IntrinsicAttributes & BottomTabBarProps) => (
        <TabBar {...props} />
      )}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
      <Tabs.Screen name="add" options={{ title: "Add" }} />
      <Tabs.Screen name="categories" options={{ title: "Categories" }} />
      <Tabs.Screen name="budget" options={{ title: "Budget" }} />
    </Tabs>
    // </ThemeProvider>
  );
}
