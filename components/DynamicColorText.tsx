import React from "react";
import { View, Text } from "react-native";

interface TextWithDynamicColorProps {
  backgroundColor: string; // es. "#ff5733"
  text: string;
}

export const DynamicColorText: React.FC<TextWithDynamicColorProps> = ({
  backgroundColor,
  text,
}) => {
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

  return (
    <View style={[ { backgroundColor }]} >
      <Text style={[ { color: textColor }]} className="text-xl font-lexend">{text}</Text>
    </View>
  );
};

// Funzione luminanza
function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
