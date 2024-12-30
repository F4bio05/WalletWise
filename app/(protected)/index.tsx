import React, { useDebugValue, useEffect, useState } from "react";
import { View } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";

import { ThemedView } from "@/components/ThemedView";
import { HeaderBar } from "@/components/HeaderBar";
import { ThemedIcon } from "@/components/ThemedIcon";

import { UserProps } from "@/types/types";

import { useSupabase } from "@/context/supabaseProvider";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const router = useRouter();
  const { supabase, session } = useSupabase();
  const [userData, setUserData] = useState<UserProps | null>(null);

  async function getUserData() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session?.user?.id);
    if (error) {
      console.error(error);
    }
    setUserData(data?.[0]);
  }

  useEffect(() => {
    if(session)
      getUserData();
  
  }, [session]);

  return (
    <ThemedView className="w-full min-h-screen flex flex-col justify-center items-center gap-24">
      <HeaderBar name={userData?.full_name} profit={userData?.profit} loss={userData?.loss} goto="settings" />

      <View className="w-full flex flex-row flex-wrap justify-center items-center gap-x-8 pt-20">
        <PlatformPressable
          onPress={() => {
            router.replace("/(protected)/calendar");
          }}
        >
          <ThemedView
            className="w-48 h-48 flex justify-center items-center bg-white rounded-full"
            typeView="secondary"
          >
            <ThemedIcon
              icon="Calendar"
              size={100}
              strokeWidth={0.7}
              typeIcon="text"
            />
          </ThemedView>
        </PlatformPressable>
        <PlatformPressable
          onPress={() => {
            router.replace("/(protected)/categories");
          }}
        >
          <ThemedView
            className="w-48 h-48 flex justify-center items-center bg-white rounded-full"
            typeView="secondary"
          >
            <ThemedIcon
              icon="LayoutGrid"
              size={100}
              strokeWidth={0.7}
              typeIcon="text"
            />
          </ThemedView>
        </PlatformPressable>
        <PlatformPressable
          onPress={() => {
            router.replace("/(protected)/budget");
          }}
        >
          <ThemedView
            className="w-48 h-48 flex justify-center items-center bg-white rounded-full"
            typeView="secondary"
          >
            <ThemedIcon
              icon="ChartPie"
              size={100}
              strokeWidth={0.7}
              typeIcon="text"
            />
          </ThemedView>
        </PlatformPressable>
      </View>
    </ThemedView>
  );
}
