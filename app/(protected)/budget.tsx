import React, { useEffect, useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBar } from "@/components/HeaderBar";
import { categoriesType } from "@/types/categories";
import { useSupabase } from "@/context/supabaseProvider";
import { Alert, ScrollView, View } from "react-native";
import { budgetsType } from "@/types/budgets";
import { MyButton } from "@/components/MyButton";
import { RelativePathString, router } from "expo-router";

export default function Budget() {
  const { supabase } = useSupabase();
  const [categories, setCategories] = useState<categoriesType>([]);
  const [budgets, setBudgets] = useState<budgetsType>([]);

  const fetchCategories = async () => {};

  const fetchBudgets = async () => {
    const { data, error } = await supabase.from("budgets").select("*");

    if (error) Alert.alert("Error", error.message);

    if (data) {
      setBudgets(data);
    }
  };

  useEffect(() => {
    fetchBudgets();
  });

  return (
    <ThemedView className="flex-1 justify-start items-center pt-44 gap-6">
      <HeaderBar namePage="Budget" goto="settings" />

      {budgets.length > 0 ? (
        <ScrollView className="w-full h-96">
          {budgets.map((budget, index) => {
            return (
              <View
                key={index}
                className="flex-row justify-between items-center w-11/12 bg-gray-300 p-2 rounded-lg"
              >
                <ThemedText className="text-lg">{budget.amount}</ThemedText>
                <ThemedText className="text-lg">
                  {budget.current_amount}
                </ThemedText>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <ThemedText className="text-lg">
          Non ci sono budget impostati
        </ThemedText>
      )}

      <View className="w-full px-20 absolute bottom-[12.5rem]">
        <MyButton
          title="Gestisci budget"
          onPress={() => {
            router.push({pathname: "modals/modalBudget" as RelativePathString, params: { budgets: JSON.stringify(budgets) }});
          }}
        />
      </View>
    </ThemedView>
  );
}
