/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import { View, TextInput, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemeContext } from "@/context/themeContext";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  keyBoardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad";
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  showText?: boolean;
  capitalize?: "none" | "sentences" | "words" | "characters";
  modal?: boolean;
  iconName?: string | null;
  typeInput?: "text" | "primary" | "secondary" | "background" | "tabIconSelected" | "green" | "red"
};

export function Input({
  lightColor,
  darkColor,
  keyBoardType = "default",
  value,
  setValue,
  placeholder,
  showText = true,
  capitalize = "sentences",
  modal = false,
  iconName = null,
  typeInput = "text",
  ...rest
}: ThemedTextProps) {
  const { theme } = useContext(ThemeContext);
  const colorText = useThemeColor(
    { theme: theme },
    typeInput
  );

  const colorButton = useThemeColor(
    { theme: theme },
    modal ? "text" : "secondary"
  );

  return (
    <View className=" w-full relative flex flex-row justify-center items-center">
      {iconName ? (
        <View className="z-50 absolute left-3 top-2/4 -translate-y-2/4 ">
          <ThemedIcon icon={iconName} size={24} typeIcon="text" />
        </View>
      ) : null}
      <TextInput
        style={{ color: colorText, backgroundColor: colorButton, fontSize: 20, fontFamily: "Lexend" }}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        keyboardType={keyBoardType}
				className={iconName ? "w-full py-3 pr-3 pl-12 rounded-xl z-10 text-left" : "w-full p-3 rounded-xl z-10 text-left"}
        secureTextEntry={!showText}
        autoCapitalize={capitalize}
        clearButtonMode="while-editing"
      />
        
    </View>
  );
}
