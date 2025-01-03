import React from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function Add() {
  return (
    <ThemedView className="h-full flex flex-col justify-start items-center rounded-t-3xl">
      <ThemedText>ModalBudget</ThemedText>
    </ThemedView>
  )
}