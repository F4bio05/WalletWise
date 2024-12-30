import { HeaderBar } from "@/components/HeaderBar";
import { MyButton } from "@/components/MyButton";
import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/supabaseProvider";
import { ThemeContext } from "@/context/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { Easing, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { PlatformPressable } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import React from "react";

export default function Settings() {
  const { theme, forcedTheme, autoTheme } = useContext(ThemeContext);
  const { supabase } = useSupabase();

  const themeChoices = ["Dark", "Light", "Auto"];
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  const changeTheme = async (theme: "light" | "dark" | "auto") => {
    if (theme === "auto") {
      autoTheme!();
    } else {
      forcedTheme!(theme);
    }
    setCurrentThemeFunction(theme);
  };

  const setCurrentThemeFunction = async (theme: string) => {
    setCurrentTheme(theme);
    await AsyncStorage.setItem("theme", theme);
  };

  const getCurrentTheme = async () => {
    const theme = await AsyncStorage.getItem("theme");
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const LogOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    getCurrentTheme();
  }, []);

  return (
    <ThemedView className="flex-1 justify-start items-center pt-56">
      <HeaderBar namePage="Impostazioni" goto="home" from="settings" />

      <View className="w-full px-10 flex flex-col justify-center items-start gap-10">
        {/* STATISTIC BUTTON */}
        <PlatformPressable
          className="w-full flex flex-row justify-start items-center gap-2"
          onPress={() => router.push("/(settings)/statistics")}
        >
          <ThemedIcon icon="ChartNoAxesCombined" size={24} />
          <ThemedText typeText="text" className="text-2xl tracking-[2px]">
            Statistiche
          </ThemedText>
        </PlatformPressable>

        {/* THEME BUTTON CHOICE */}
        <View className="w-full flex flex-row justify-between items-center">
          <View className="flex flex-row justify-start items-center gap-2">
            <ThemedIcon icon="SunMoon" size={24} />
            <ThemedText className="text-2xl tracking-[2px]">Tema</ThemedText>
          </View>
          <SelectDropdown
            data={themeChoices}
            onSelect={(selectedItem) => {
              changeTheme(
                selectedItem.toLowerCase() as "light" | "dark" | "auto"
              );
            }}
            renderButton={(selectedItem, isOpened) => (
              <View
                className="w-[45%]  flex flex-row justify-between items-center py-2 px-3 text-center rounded-xl"
                style={{
                  backgroundColor: Colors[theme].secondary,
                }}
              >
                <ThemedText typeText="text" className="text-2xl">
                  {selectedItem
                    ? selectedItem
                    : currentTheme
                    ? currentTheme.charAt(0).toUpperCase() +
                      currentTheme.slice(1)
                    : "Auto"}
                </ThemedText>

                <ThemedIcon
                  icon={isOpened ? "ChevronUp" : "ChevronDown"}
                  size={24}
                />
              </View>
            )}
            renderItem={(item, index) => (
              <ThemedView className="px-4 py-3">
                <ThemedText typeText="text" className="text-xl font-lexend">
                  {" "}
                  {item}{" "}
                </ThemedText>
              </ThemedView>
            )}
            showsVerticalScrollIndicator={false}
            dropdownStyle={{
              backgroundColor: Colors[theme].secondary,
              borderRadius: 10,
            }}
          />
        </View>

        {/* ASSISTANT BUTTON */}
        <PlatformPressable className="w-full flex flex-row justify-start items-center gap-2">
          <ThemedIcon icon="LifeBuoy" size={24} />
          <ThemedText typeText="text" className="text-2xl tracking-[2px]">
            Aiuto
          </ThemedText>
        </PlatformPressable>
      </View>

      <View className="w-full absolute bottom-20 px-20 ">
        <MyButton
          backgroundColor="red"
          onPress={() => LogOut()}
          title="Log Out"
        />
      </View>
    </ThemedView>
  );
}

export const customTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      },
    },
  },
};