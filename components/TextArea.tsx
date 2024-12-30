/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import { TextInput, View, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemeContext } from "@/context/themeContext";

export type TextAreaProps = TextProps & {

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
  multiline?: boolean;
};

export function TextArea({
  style,

  keyBoardType = "default",
  value,
  setValue,
  placeholder,
  showText = true,
  capitalize = "sentences",
  modal = false,
  multiline = false,
  ...rest
}: TextAreaProps) {
	const {theme} = useContext(ThemeContext);

  const colorText = useThemeColor(
    { theme: theme },
    "text"
  );

  const colorButton = useThemeColor(
    { theme: theme },
    modal ? "background" : "secondary"
  );

  return (
    <View className=" w-full flex flex-row justify-center items-center">
      <TextInput
        style={{ color: colorText, backgroundColor: colorButton, height: 150,fontSize: 20, fontFamily: "Lexend" }}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        keyboardType={keyBoardType}
        className="w-full p-3.5 rounded-xl "
        secureTextEntry={!showText}
        autoCapitalize={capitalize}
        clearButtonMode="while-editing"
        multiline
        numberOfLines={4}
        editable
      />
    </View>
  );
}
