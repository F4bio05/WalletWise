import { DynamicColorIcon } from "@/components/DynamicColorIcon";
import { DynamicColorText } from "@/components/DynamicColorText";
import { Input } from "@/components/Input";
import { MyButton } from "@/components/MyButton";
import { ThemedAnimatedView } from "@/components/ThemedAnimatedView";
import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSupabase } from "@/context/supabaseProvider";
import { ThemeContext } from "@/context/themeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { budgetType } from "@/types/budgets";
import { categoriesType, categoryType } from "@/types/categories";
import { PlatformPressable } from "@react-navigation/elements";
import { parse, set } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import SelectDropdown from "react-native-select-dropdown";

export default function ModalBudget() {
  const { supabase } = useSupabase();
  const { theme } = useContext(ThemeContext);
  const unselectedColor = useThemeColor({ theme: theme }, "primary");
  const { width, height } = Dimensions.get("window");

  const animatedListValue = useSharedValue(width / 2);
  const animatedCreateValue = useSharedValue(width + width / 2);

  const { budgets } = useLocalSearchParams();
  const [categories, setCategories] = useState<categoriesType>();
  const [categoryBudget, setCategory] = useState<categoryType>();
  const [amountNewBudget, setAmountNewBudget] = useState<string>("");

  const [listView, setListView] = useState(true);

  const AnimatedCategoriesList = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animatedListValue.value }],
    };
  });

  const AnimatedCategoryCreate = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animatedCreateValue.value }],
    };
  });

  supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "budgets" },
      (payload) => {
        console.log("Change received!", payload);
      }
    )
    .subscribe();

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, color");

    if (error) Alert.alert("Error", error.message);

    if (data) {
      setCategories(data as categoriesType);
    }
  };

  const createBudget = async () => {
    if (categoryBudget === undefined || amountNewBudget === "") {
      Alert.alert("Errore", "Inserisci tutti i campi");
      return;
    }

    const amount_budget = parseFloat(amountNewBudget).toFixed(2);

    console.log(categoryBudget, amount_budget);

    const { data, error } = await supabase.from("budgets").insert([
      {
        category_id: categoryBudget.id,
        max_amount: amount_budget,
      },
    ]);

    if (error) Alert.alert("Error", error.message);

    if (data) {
      changeView();
    }
  };

  const removeBudget = async (id: number) => {
    // remove the budget from the database
    const { data, error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", id);

    if (error) Alert.alert("Error", error.message);
  };

  const changeView = () => {
    setListView(!listView);
  };

  useEffect(() => {
    fetchCategories();

    animatedListValue.value = withSpring(listView ? width / 2 : -width / 2, {
      stiffness: 100, // Regola la reattività dell'animazione
      damping: 20, // Controlla lo smorzamento
    });

    animatedCreateValue.value = withSpring(listView ? width / 2 : -width / 2, {
      stiffness: 100, // Regola la reattività dell'animazione
      damping: 20, // Controlla lo smorzamento
    });
  }, [listView]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView
        className="h-full flex flex-col justify-start items-center rounded-t-3xl "
        typeView="secondary"
      >
        <ThemedView
          className="w-20 h-1.5 fixed top-2 rounded-full opacity-70"
          typeView="text"
        />

        <View className="flex flex-row h-full ">
          <ThemedAnimatedView
            style={AnimatedCategoriesList}
            typeView="secondary"
            className="w-full fixed top-6 rounded-t-3xl"
          >
            <ThemedText className="w-full px-5 text-3xl text-center opacity-70">
              Gestisci budget
            </ThemedText>

            <ScrollView
              contentContainerClassName=" items-start justify-center gap-4"
              className="flex-1 w-full relative top-6"
            >
              {
                // here we will render the categories
                (Array.isArray(budgets) ? budgets : JSON.parse(budgets))?.map(
                  (budget: budgetType, index: number) => (
                    <ThemedView
                      key={index}
                      className="w-full flex flex-row justify-between items-center px-6"
                      typeView="secondary"
                    >
                      <PlatformPressable
                        onPress={() => {
                          removeBudget(budget.id);
                        }}
                      >
                        <ThemedIcon icon="Trash2" size={24} typeIcon="red" />
                      </PlatformPressable>
                    </ThemedView>
                  )
                )
              }
            </ScrollView>
            <View className="w-full px-5 pb-5 absolute bottom-20 z-50">
              <MyButton
                title="Nuovo budget"
                onPress={() => {
                  changeView();
                }}
              />
            </View>
          </ThemedAnimatedView>

          <ThemedAnimatedView
            style={AnimatedCategoryCreate}
            typeView="secondary"
            className="w-full flex justify-start items-center gap-8 fixed top-6 px-6 rounded-t-3xl"
          >
            <View className="w-full flex flex-row justify-between items-center ">
              <ThemedText className="text-3xl opacity-70">
                Nuova budget
              </ThemedText>

              <PlatformPressable
                onPress={() => {
                  changeView();
                }}
                className="text-center"
              >
                <ThemedText typeText="text" className="text-lg">
                  Back
                </ThemedText>
              </PlatformPressable>
            </View>

            <View className="w-full flex justify-center items-center pt-12 ">
              <SelectDropdown
                data={categories || []}
                onSelect={(selectedItem) => {
                  setCategory(selectedItem);
                }}
                renderButton={(selectedItem, isOpened) => (
                  <View
                    className="w-full flex flex-row justify-between items-center p-4 text-center rounded-xl"
                    style={{
                      backgroundColor: selectedItem
                        ? selectedItem.color
                        : unselectedColor,
                    }}
                  >
                    <DynamicColorText
                      backgroundColor={
                        selectedItem ? selectedItem.color : unselectedColor
                      }
                      text={
                        selectedItem ? selectedItem.name : "Seleziona categoria"
                      }
                    />
                    <DynamicColorIcon
                      icon={isOpened ? "ChevronUp" : "ChevronDown"}
                      size={24}
                      backgroundColor={
                        selectedItem ? selectedItem.color : unselectedColor
                      }
                    />
                  </View>
                )}
                renderItem={(item, index) => (
                  <ThemedView
                    className={
                      index > 0 && index < categories!.length - 1
                        ? "px-4 py-3 border-b-2 font-lexend"
                        : index === 0
                        ? "px-4 py-3 border-b-2 font-lexend"
                        : "px-4 py-3 font-lexend"
                    }
                  >
                    <ThemedText className="text-xl font-lexend">
                      {" "}
                      {item.name}{" "}
                    </ThemedText>
                  </ThemedView>
                )}
                showsVerticalScrollIndicator={false}
                dropdownStyle={{
                  backgroundColor: unselectedColor,
                  borderRadius: 10,
                }}
              />
            </View>

            <View>
              <Input
                placeholder="Inserisci l'importo massimo"
                keyBoardType="numeric"
                value={amountNewBudget}
                setValue={(text) => {
                  // set the amount
                  setAmountNewBudget(text);
                }}
                modal={true}
              />
            </View>

            <View className="w-full flex justify-center items-center pb-5 absolute bottom-20 z-50">
              <MyButton
                title="Crea budget"
                onPress={() => {
                  createBudget();
                }}
              />
            </View>
          </ThemedAnimatedView>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}
