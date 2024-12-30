/* eslint-disable prettier/prettier */
import { RelativePathString, router, Stack } from "expo-router";
import React, { useContext, useEffect } from "react";
import "react-native-gesture-handler";

import { useSupabase } from "@/context/supabaseProvider";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "@/context/themeContext";
import { Image, StatusBar, View } from "react-native";

export default function Landing() {
  const { supabase, session } = useSupabase();
  const { theme, forcedTheme, autoTheme } = useContext(ThemeContext);

  const getTheme = async () => {
    try {
      const token = await AsyncStorage.getItem("theme");
      console.log("Token recuperato:", token);
      if (token === "auto") {
        autoTheme!();
      } else {
        forcedTheme!(token as "light" | "dark");
      }
    } catch (error) {
      console.error("Errore nel recuperare il token:", error);
      return null;
    }
  };

  useEffect(() => {
    getTheme();
    setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          // console.log(session)
          // supabase.auth.setSession(session)
          router.replace("/(protected)" as RelativePathString);
        } else {
          router.replace("/(auth)" as RelativePathString);
        }
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          // console.log(session)
          // supabase.auth.setSession(session)
          router.replace("/(protected)" as RelativePathString);
        } else {
          router.replace("/(auth)" as RelativePathString);
        }
      });
    }, 2000);
  }, []);

  return (
    <ThemedView className="flex-1 flex-col justify-center items-center gap-10">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <Image source={require("@/assets/images/logo.png")} />
      <View className="w-full flex flex-col items-center justify-center gap-2">
        <ThemedText className="text-5xl font-bold">WalletWise</ThemedText>
        <ThemedText className="text-lg opacity-60">Gestisci le tue spese</ThemedText>
      </View>
    </ThemedView>
  );
}
