import React from "react";
import { Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemeContext } from "@/context/themeContext";
import { useContext } from "react";

export type ThemedTextProps = TextProps & {
	type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
	typeText?: "text" | "primary" | "secondary" | "background" | "tabIconSelected" | "green" | "red";
};

export function ThemedText({
	type = "default",
	typeText = "text",
	...rest
}: ThemedTextProps) {
	const {theme} = useContext(ThemeContext);
	const color = useThemeColor({ theme: theme }, typeText);

	return <Text style={{ color, "fontFamily": "Lexend" }} {...rest} />;
}
