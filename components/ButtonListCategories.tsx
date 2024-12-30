import React, { useContext } from "react";
import { View } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import { categoriesType, categoryType } from "@/types/categories";
import { DynamicColorText } from "./DynamicColorText";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemeContext } from "@/context/themeContext";

export function ButtonListCategories({
  components,
  onPress,
  current,
}: {
  components: categoriesType;
  onPress: (type: categoryType) => void;
  current: categoryType | undefined;
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <View className="w-full flex flex-row justify-start items-center gap-4">
      {components.map(
        (component, index) => (
          (
            <PlatformPressable
              key={index}
              onPress={() => onPress(component)}
              pressOpacity={1}
              style={{
                backgroundColor:
                  component.name === current?.name
                    ? (component.color as string)
                    : (useThemeColor({ theme: theme }, "secondary") as string),
              }}
              className="flex justify-center items-center rounded-xl py-2 px-4"
            >
              <DynamicColorText
                text={component.name}
                backgroundColor={
                  component.name === current?.name
                    ? (component.color as string)
                    : (useThemeColor({ theme: theme }, "secondary") as string)
                }
              />
            </PlatformPressable>
          )
        )
      )}
    </View>
  );
}