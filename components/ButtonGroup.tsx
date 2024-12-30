import { useContext, useState } from "react";
import { View, ViewProps } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";

import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemeContext } from "@/context/themeContext";
import React from "react";
import { categoriesType } from "@/types/categories";
import { colorsType } from "@/types/colors";

export type ButtonGroupProps = ViewProps & {
  components: categoriesType;
  onPress: (type: string) => void;
};

export function ButtonGroup({ components, onPress }: ButtonGroupProps) {
  const {theme} = useContext(ThemeContext);
  const [activeIndex, setActiveIndex] = useState(0);

  function changeIndex(index: number) {
    setActiveIndex(index);
    onPress(components[index].label);
  }

  return (
    <View className="w-auto flex flex-row justify-center items-center rounded-xl overflow-hidden">
      {components.map((item, index) => {
        return (
          <PlatformPressable
            key={index}
            onPress={() => changeIndex(index)}
            className={
              "w-2/5 flex flex-row justify-center items-center py-4 text-center"
            }
            style={{
              backgroundColor:
                activeIndex === index ? useThemeColor({ theme: theme }, item.activeColor as colorsType) : useThemeColor({ theme: theme }, "secondary"),
            }}
          >
            <ThemedText className="font-lexend text-2xl leading-6 tracking-[-0.8px] text-center flex-1 justify-center items-center" typeText="text">
              {item.label}
            </ThemedText>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
