import { View } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";

import { ThemedView } from "@/components/ThemedView";

import { itemCalendarType, itemsSupabaseType } from "@/constants/calendar";
import { useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import { router } from "expo-router";
import React from "react";

interface Props {
  item: itemCalendarType;
  today: boolean;
  index?: number | null;
  onClick: (events: itemsSupabaseType | []) => void;
}

export function ItemCalendar({
  item,
  today,
  index,
  onClick,
}: 
Props) {
  const [isIn, setIsIn] = useState(false);
  const [isOut, setIsOut] = useState(false);

  useEffect(() => {
    if (item?.events) {
      const isIn = item.events.some((event) => event?.type === "Entrata");
      const isOut = item.events.some((event) => event?.type === "Uscita");
      setIsIn(isIn);
      setIsOut(isOut);
    }
  });

  // Show events
  function showEvents(events: itemsSupabaseType | []) {
    // if (events?.length! > 0) {
    //   router.push("/modalEvents")
    // }
    onClick(events);
  }

  return (
    <ThemedView
      key={index ? index : null}
      className="rounded-xl"
      typeView={today ? "primary" : "secondary"}
    >
      <PlatformPressable
        className="h-full flex flex-col justify-center items-center gap-1"
        onPress={() => showEvents(item!.events!)}
      >
        <ThemedText className="text-center text-xl">{item?.item}</ThemedText>

        <View className="w-full flex flex-row justify-center items-center gap-3">
          {isIn ? (
            <ThemedView typeView="green" className="w-3 h-3 rounded-full" />
          ) : null}
          {isOut ? (
            <ThemedView typeView="red" className="w-3 h-3 rounded-full" />
          ) : null}
        </View>
      </PlatformPressable>
    </ThemedView>
  );
}
