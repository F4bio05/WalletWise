/* eslint-disable prettier/prettier */
import React from "react";
import { type ViewProps } from "react-native";
import Animated from "react-native-reanimated";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";

export type ThemedAnimatedViewProps = ViewProps & {
	lightColor?: string;
	darkColor?: string;
	typeView?: "text" | "primary" | "secondary" | "background" | "tabIconSelected" | "green" | "red";
};

export function ThemedAnimatedView({
	style,
	lightColor,
	darkColor,
	typeView = "background",
	...otherProps
}: ThemedAnimatedViewProps) {
	const {theme} = useContext(ThemeContext);
	const backgroundColor = useThemeColor({theme}, typeView);

	return <Animated.View style={[{ backgroundColor }, style]} {...otherProps} />;
}
