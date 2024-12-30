/* eslint-disable prettier/prettier */
import React from "react";
import { type ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { useContext } from "react";


import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemeContext } from "@/context/themeContext";


export function AnimatedScroll({
  style,
	...otherProps
}: ViewProps) {
	const {theme} = useContext(ThemeContext);
	const backgroundColor = useThemeColor({theme}, "background");

	return <Animated.ScrollView contentContainerStyle={{gap: 20}} style={[{ backgroundColor, height: 249, width: '100%' }, style]} {...otherProps} />;
}
