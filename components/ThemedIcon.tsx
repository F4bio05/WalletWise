import "lucide-react-native"
import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";

export type ThemedIconProps =  {
  // Icon component from lucide-react-native
  icon: string;
  size: number; 
  strokeWidth?: number;
  typeIcon?: "text" | "primary" | "secondary" | "background" | "tabIconSelected" | "green" | "red"
};

export function ThemedIcon({
  icon,
  size,
  strokeWidth,
  typeIcon = "text",
	...rest
}: ThemedIconProps) {
  	const {theme} = useContext(ThemeContext);

	const color = useThemeColor({ theme: theme }, typeIcon);

  // return Icon component from lucide-react-native
  if (icon) {
    const Icon = require('lucide-react-native')[icon];
    return <Icon color={color} size={size} strokeWidth={strokeWidth} {...rest} />;
  }

}
