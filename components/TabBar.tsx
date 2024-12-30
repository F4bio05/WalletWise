import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { ThemedView } from "@/components/ThemedView";
import TabBarItem from "@/components/TabBarItem";
import { ThemedAnimatedView } from "@/components/ThemedAnimatedView";

import { useEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RelativePathString, useRouter } from "expo-router";
import React from "react";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonDimension = dimensions.width / state.routes.length;
  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState<string>("");

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(-139.2);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  useEffect(() => {
    tabPositionX.value = withSpring(buttonDimension * (state.index - 2), {
      stiffness: 100, // Regola la reattività dell'animazione
      damping: 20, // Controlla lo smorzamento
    });

    // current routeName
    state.routes.map((route, index) => {
      if (state.index === index) {
        setCurrentRoute(route.name);
      }
    })
  }, [state.index, buttonDimension]);

  return (
    <ThemedView
      onLayout={onTabbarLayout}
      className="absolute z-50 bottom-24 mx-6 py-4 rounded-[50px] flex flex-row justify-center items-center overflow-hidden"
      typeView="secondary"
      // style={currentRoute === "calendar" ? {display: "none"} : {display: "flex"}}
    >
      <ThemedAnimatedView
        className="absolute rounded-full"
        style={[
          animatedStyle,
          { height: buttonDimension - 10, width: buttonDimension - 10 },
        ]}
        typeView="primary"
      />

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === "add") {
              router.push("/modals/modalAddMove");
            } else {
              const path = route.name === "index" ? "/" : `/${route.name}`;
              router.push(`/(protected)${path}` as RelativePathString);
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarItem
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            label=""
            isFocused={isFocused}
            routeName={route.name}
          />
        );
      })}
    </ThemedView>
  );
}
