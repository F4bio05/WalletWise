import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SupabaseProvider } from "@/context/supabaseProvider";
import { ThemeProvider } from "@/context/themeContext";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

import "../global.css";

import React from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Lexend: require("@/assets/fonts/Lexend-Font.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SupabaseProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(protected)"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="modals/modalAddMove"
            options={{
              presentation: "modal",
              headerShown: true,
              headerTitle: "Nuovo movimento",
              headerTitleStyle: { fontSize: 20, fontFamily: "Lexend" },
              headerStyle: {
                backgroundColor:
                  colorScheme === "dark"
                    ? Colors.dark.primary
                    : Colors.light.primary,
              },
            }}
          />
          <Stack.Screen
            name="modals/modalShowEvents"
            options={{
              presentation: "modal",
              headerShown: false,
              headerStyle: {
                backgroundColor:
                  colorScheme === "dark"
                    ? Colors.dark.primary
                    : Colors.light.primary,
              },
              contentStyle: {
                paddingTop: "55%",
                backgroundColor: "transparent",
              },
            }}
          />
          <Stack.Screen
            name="modals/modalBudget"
            options={{
              presentation: "modal",
              headerShown: false,
              headerStyle: {
                backgroundColor:
                  colorScheme === "dark"
                    ? Colors.dark.primary
                    : Colors.light.primary,
              },
              contentStyle: {
                paddingTop: "47%",
                backgroundColor: "transparent",
              },
            }}
          />

          <Stack.Screen
            name="modals/modalCategory"
            options={{
              presentation: "modal",
              headerShown: false,
              headerStyle: {
                backgroundColor:
                  colorScheme === "dark"
                    ? Colors.dark.primary
                    : Colors.light.primary,
              },
              contentStyle: {
                paddingTop: "47%",
                backgroundColor: "transparent",
              },
            }}
          />
          <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SupabaseProvider>
  );
}
