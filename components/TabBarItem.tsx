import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from '@react-navigation/native';
 
import React from "react";

import { ThemedIcon } from "@/components/ThemedIcon";
import { Icons } from "@/constants/icons";

export default function TabBarItem({
  label,
  onPress,
  onLongPress,
  routeName,
  isFocused,
}: {
  label: string;
  onPress: () => void;
  onLongPress: () => void;
  routeName: string;
  isFocused: boolean;
  }) {
  const { buildHref } = useLinkBuilder();
  
  return (
    <PlatformPressable
      href={buildHref(routeName)}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 justify-center items-center"
    >
      <ThemedIcon
        icon={Icons[routeName as keyof typeof Icons]}
        size={40}
        typeIcon="text"
        strokeWidth={isFocused ? 1.5 : 0.7}
      />
    </PlatformPressable>
  );
}
