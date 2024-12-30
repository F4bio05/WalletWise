/* eslint-disable prettier/prettier */
import { Link } from "expo-router";
import { type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";

export type ThemedLinkProps = TextProps & {
	url: string;
	text: string;
	button?: boolean;
};

export function ThemedLink({
	url,
	text,
	button = false,
	...rest
}: ThemedLinkProps) {
	const {theme} = useContext(ThemeContext);
	const color = useThemeColor({ theme: theme }, "primary");

	return (
		<Link
			style={{color, "fontFamily": "Lexend"}}
			href={{ pathname: url as any }}
			className="underline"
		>
			{text}
		</Link>
	);
}
