import "lucide-react-native"
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedIconProps = {
  backgroundColor: string;
  // Icon component from lucide-react-native
  icon: string;
  size: number; 
  strokeWidth?: number;
};

export const DynamicColorIcon: React.FC<ThemedIconProps> = ({
  backgroundColor,
  icon,
  size,
  strokeWidth,
	...rest
}: ThemedIconProps) => {

  // Funzione luminanza
  function getLuminance(r: number, g: number, b: number): number {
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Funzione per convertire l'hex in RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  // Calcola il colore del testo
  const getTextColor = (bgColor: string): string => {
    const { r, g, b } = hexToRgb(bgColor);
    const luminance = getLuminance(r, g, b);
    return luminance > 128 ? "#11181C" : "#F3F5F6"; // Se luminoso, testo nero, altrimenti bianco
  };

  const textColor = getTextColor(backgroundColor);

  // return Icon component from lucide-react-native
  if (icon) {
    const Icon = require('lucide-react-native')[icon];
    return <Icon color={textColor} size={size} strokeWidth={strokeWidth} {...rest} />;
  }

}
