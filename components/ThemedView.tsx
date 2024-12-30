/* eslint-disable prettier/prettier */
import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";

export type ThemedViewProps = ViewProps & {
	typeView?: "text" | "primary" | "secondary" | "background" | "tabIconSelected" | "green" | "red";
};

export function ThemedView({
	style,
	typeView = "background",
	...otherProps
}: ThemedViewProps) {
	const {theme} = useContext(ThemeContext);
	const backgroundColor = useThemeColor({ theme: theme }, typeView);

	return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
