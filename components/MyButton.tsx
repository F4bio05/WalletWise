/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import { View, TouchableOpacity, type TextProps, StyleSheet } from "react-native";
import  tailwind  from 'tailwindcss-rn';

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemeContext } from "@/context/themeContext";

export type ThemedTextProps = TextProps & {
	title: string;
	onPress: () => void;
	disabled?: boolean;
	backgroundColor?: "primary" | "secondary" | "red";
};

export function MyButton({
	title,
	onPress,
	disabled = false,
	backgroundColor = "primary",
	...rest
}: ThemedTextProps) {
	const { theme } = useContext(ThemeContext);


	const colorButton = useThemeColor(
		{ theme: theme },
		backgroundColor,
	);
	return (
		<View
			style={{ backgroundColor: colorButton }}
			className="w-full py-2 rounded-xl font-lexend"
		>
			<TouchableOpacity
				onPress={onPress}
				disabled={disabled}
				className="w-full py-2 rounded-xl"
			>
				<ThemedText typeText="text" className="text-center text-xl font-lexend">
					{title}
				</ThemedText>
			</TouchableOpacity>
		</View>
	);
}
