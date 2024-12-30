import React, { useState, useRef, useEffect, useContext } from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedIcon } from "@/components/ThemedIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedAnimatedView } from "./ThemedAnimatedView";
import { ThemeContext } from "@/context/themeContext";

export const AnimatedButton = ({
  btnClick,
  dropClick
}: {
  btnClick: (value: boolean) => void;
  dropClick: (value: string) => void;

}) => {
  const frequencys = [
    "Settimanale",
    "Mensile",
    "Trimestrale",
    "Semestrale",
    "Annuale",
  ];
  const [isOpen, setIsOpen] = useState(false); // Stato per controllare l'apertura
  const {theme} = useContext(ThemeContext);
  const backgroundColor = useThemeColor(
    { theme: theme },
    "secondary"
  );
  const buttonDimension = Dimensions.get("screen").width / 2;
  // const buttonPosition = useSharedValue(
  //   Dimensions.get("screen").width / 2 + buttonDimension / 2
  // ); // Posizione iniziale del bottone
  const buttonPosition = useSharedValue(0); // Posizione iniziale del bottone
  const dropPosition = useSharedValue(0); // Posizione iniziale del bottone

  const animatedStyleButton = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: buttonPosition.value }],
    };
  });
  const animatedStyleDrop = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: dropPosition.value }],
    };
  });

  // Funzione per gestire il click sul bottone
  const handlePress = () => {
    setIsOpen(!isOpen);
    btnClick(!isOpen);

    if (!isOpen) {
      dropClick("");
    }
  };

  useEffect(() => {
    buttonPosition.value = withSpring(isOpen ? 0 - buttonDimension / 2: 0, {
      stiffness: 100, // Regola la reattività dell'animazione
      damping: 20, // Controlla lo smorzamento
    });

    dropPosition.value = withSpring(isOpen ? buttonDimension / 2 + 5 : 0, {
      stiffness: 100, // Regola la reattività dell'animazione
      damping: 20, // Controlla lo smorzamento
    });
  }, [isOpen]);

  return (
    <View className="w-full relative">
      {/* Casella di testo visibile solo quando il bottone è aperto */}
      <ThemedAnimatedView style={[animatedStyleDrop]} className="w-[45%] absolute left-1/4 rounded-xl">
        <SelectDropdown
          data={frequencys}
          onSelect={(selectedItem) => {
            dropClick(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => (
            <View
              className="w-full absolute left-0  flex flex-row justify-between items-center py-3 px-2  text-center rounded-xl"
              style={{ backgroundColor: backgroundColor }}
            >
              <ThemedText className="text-xl">
                {selectedItem ? selectedItem : "Seleziona"}
              </ThemedText>
              <ThemedIcon
                icon={isOpened ? "ChevronUp" : "ChevronDown"}
                size={24}
              />
            </View>
          )}
          renderItem={(item, index) => (
            <ThemedView
              className={
                index > 0 && index < frequencys.length - 1
                  ? "px-4 py-3 border-b-2"
                  : index === 0
                  ? "px-4 py-3 border-b-2"
                  : "px-4 py-3"
              }
            >
              <ThemedText className="text-xl"> {item} </ThemedText>
            </ThemedView>
          )}
          showsVerticalScrollIndicator={false}
          dropdownStyle={{ backgroundColor: backgroundColor, borderRadius: 10 }}
        />
      </ThemedAnimatedView>

      {/* Bottone animato */}
      <ThemedAnimatedView
        typeView={isOpen ? "green" : "red"}
        className="w-[45%] absolute left-1/4 rounded-xl"
        style={[animatedStyleButton]}
      >
        <TouchableOpacity onPress={handlePress}>
          <ThemedText className="text-xl py-3 px-2 text-center">
            Abbonamento
          </ThemedText>
        </TouchableOpacity>
      </ThemedAnimatedView>
     </View >
  );
};
