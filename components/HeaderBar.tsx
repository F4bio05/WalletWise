/* eslint-disable prettier/prettier */
import { View, type ViewProps } from "react-native";
import { TouchableOpacity } from "react-native";

import React from "react";

import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RelativePathString, router } from "expo-router";

export type HeaderBarPros = ViewProps & {
  name?: string;
  namePage?: string;
  profit?: number;
  loss?: number;
  goto: string;
  from?: string;
};

export function HeaderBar({
  name = "",
  namePage = "",
  profit = 0,
  loss = 0,
  goto,
  from,
  ...otherProps
}: HeaderBarPros) {
  return (
    <ThemedView
      className="w-full flex flex-col justify-start items-center gap-10 absolute top-0 left-0 rounded-b-[30px] pt-20 pb-8 px-7"
      typeView="secondary"
      {...otherProps}
    >
      <View className="w-full flex flex-row justify-between items-center">
        <ThemedText className="font-lexend text-3xl leading-6 pt-2 tracking-[-0.8px]">
          {name !== "" ? name : namePage}
        </ThemedText>
        {goto === "settings" ? (
          <TouchableOpacity
            onPress={() => router.push("/(settings)" as RelativePathString)}
          >
            <ThemedIcon icon="Bolt" size={32} strokeWidth={2} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              from === "settings"
                ? router.back()
                : router.replace("/(protected)" as RelativePathString);
            }}
          >
            <ThemedIcon icon="House" size={32} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      {/* DA SISTEMARE CON DATABASE SUPABASE */}

      {name !== "" || namePage === "Calendario" ? (
        <View className="w-full flex flex-row justify-between items-center">
          <View className="flex flex-row justify-center items-center gap-1">
            <ThemedIcon
              icon="ChevronUp"
              size={36}
              typeIcon="green"
              strokeWidth={2.5}
            />
            <ThemedText className="text-3xl" typeText="green">
              {profit.toString().replace(".", ",")}€
            </ThemedText>
          </View>
          <View className="flex flex-row justify-center items-center gap-1">
            <ThemedIcon
              icon="ChevronDown"
              size={36}
              typeIcon="red"
              strokeWidth={2.5}
            />
            <ThemedText className="text-3xl" typeText="red">
              {loss.toString().replace(".", ",")}€
            </ThemedText>
          </View>
        </View>
      ) : null}
    </ThemedView>
  );
}
