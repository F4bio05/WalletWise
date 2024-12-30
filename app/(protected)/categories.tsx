import React, { useContext, useEffect, useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBar } from "@/components/HeaderBar";
import { View } from "react-native";
import { ButtonListCategories } from "@/components/ButtonListCategories";
import { categoriesType, categoryType } from "@/types/categories";
import { useSupabase } from "@/context/supabaseProvider";
import { AnimatedScroll } from "@/components/AnimatedScroll";
import { PlatformPressable } from "@react-navigation/elements";
import { ThemeContext } from "@/context/themeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedAnimatedView } from "@/components/ThemedAnimatedView";
import { MyButton } from "@/components/MyButton";
import { router } from "expo-router";

export default function Categories() {
  const { supabase } = useSupabase();
  const [currentCategory, setCurrentCategory] = useState<categoryType>();
  const [categories, setCategories] = useState<categoriesType>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [indexList, setIndexList] = useState<boolean[]>(); // List of opened index

  const { theme } = useContext(ThemeContext);
  const openColor = useThemeColor({ theme: theme }, "primary");
  const closeColor = useThemeColor({ theme: theme }, "secondary");

  // subscribe to insert event on movements table
  supabase
    .channel("custom-insert-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "movements" },
      (payload) => {
        // console.log("Change received!", payload);
      }
    )
    .subscribe();

  // subscribe to all events on categories table
  supabase
    .channel("custom-insert-channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "movements" },
      (payload) => {
        fetchCategories();
      }
    )
    .subscribe();

  const changeCategory = (cat: categoryType) => {
    setCurrentCategory(cat);
    if (cat.id === 0) fetchAllMovements();
    else fetchMovements(cat);
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("name, id, color");
      if (error) throw error;
      if (data) {
        const allCat = { name: "Tutte", id: 0, color: useThemeColor({ theme: theme }, "primary") };
        data.unshift(allCat);
        setCategories(data as categoriesType);
        setCurrentCategory(data[0] as categoryType);
        // fetchAllMovements(data[0] as categoryType);
        fetchAllMovements();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchAllMovements = async () => {
    const { data, error } = await supabase.from("movements").select("*");
    if (error) {
      console.error("error", error);
    }
    if (data) {
      setMovements(data);
      setIndexList(new Array(data.length).fill(false));
    }
  }

  const fetchMovements = async (cat: categoryType) => {
    const { data, error } = await supabase
    .from("movements")
    .select("*")
    .eq("category", cat.id);

    if (error) {
      console.error("error", error);
    }

    if (data) {
      setMovements(data);
      setIndexList(new Array(data.length).fill(false));
    }
  };

  const changeIndexOpened = (index: number) => {
    indexList!.forEach((value, i) => {
      if (i === index) {
        setIndexList((prev) => {
          prev![i] = !prev![i];
          return [...prev!];
        });
      }
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ThemedView className="flex-1 justify-start items-center pt-44 gap-6">
      <HeaderBar namePage="Categorie" goto="settings" />

      <View className="w-full px-5">
        <ButtonListCategories
          components={categories}
          onPress={changeCategory}
          current={currentCategory}
        />
      </View>

      <AnimatedScroll className="mb-52 px-5 ">
        {
          // here we will render the movements
          movements.map(
            (movement, index) => (
              // console.log(movement),
              (
                <PlatformPressable
                  key={index}
                  onPress={() => changeIndexOpened(index)}
                  pressOpacity={1}
                  className="w-full flex flex-col justify-start items-start gap-2 rounded-xl"
                  style={{
                    backgroundColor: indexList![index] ? openColor : closeColor,
                  }}
                >
                  <ThemedView
                    className="w-full flex flex-row justify-between items-center gap-2 rounded-xl px-4 py-2"
                    typeView="secondary"
                  >
                    <View className="flex flex-col justify-center items-start gap-2">
                      <ThemedText className="text-xl font-bold">
                        {movement.name}
                      </ThemedText>
                      <ThemedText className="text-lg opacity-50">
                        {movement.date}
                      </ThemedText>
                    </View>
                    <ThemedText className="text-xl">
                      {parseFloat(movement.amount).toFixed(2)} €
                    </ThemedText>
                  </ThemedView>
                  <View
                    className="w-full flex flex-col justify-start items-start gap-2 px-3"
                    style={{
                      height: indexList![index] ? "auto" : 0,
                      overflow: "hidden",
                      paddingBottom: indexList![index] ? 10 : 0,
                    }}
                  >
                    <ThemedText className="text-lg">
                      {movement.description}
                    </ThemedText>
                  </View>
                </PlatformPressable>
              )
            )
          )
        }
      </AnimatedScroll>

      <View className="w-full px-20 relative bottom-[12.5rem]">
        <MyButton title="Gestisci categorie"  onPress={() => {router.push("/modals/modalCategory")}} />
      </View>
    </ThemedView>
  );
}
