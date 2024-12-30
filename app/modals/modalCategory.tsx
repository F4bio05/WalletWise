import React, { useEffect, useRef, useState } from "react";
import { PlatformPressable } from "@react-navigation/elements";
import { Dimensions, ScrollView, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
  returnedResults,
} from "reanimated-color-picker";

import { useSupabase } from "@/context/supabaseProvider";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { categoriesType } from "@/types/categories";
import { ThemedIcon } from "@/components/ThemedIcon";
import { MyButton } from "@/components/MyButton";
import { ThemedAnimatedView } from "@/components/ThemedAnimatedView";
import { set } from "date-fns";

export default function modalShowEvents() {
  const { supabase } = useSupabase();
  const [categories, setCategories] = useState<categoriesType>();

  const [currentColor, setCurrentColor] = useState<returnedResults["hex"] |undefined>();

  const { width, height } = Dimensions.get("window");

  const animatedListValue = useSharedValue(width / 2);
  const animatedCreateValue = useSharedValue(width + width / 2);

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

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error(error);
    } else {
      setCategories(data);
    }
  };

  const removeCategory = async (id: number) => {
    const { data, error } = await supabase
      .from("categories")
      .delete()
      .match({ id });

    if (error) {
      console.error(error);
    } else {
      fetchCategories();
    }
  };

  const changeView = () => {
    setListView(!listView);
  };

  const setColorCategory = (hex: returnedResults) => {
    console.log(hex);
    setCurrentColor(hex.hex);
  }

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
          <ThemedText className="w-full px-5 text-3xl text-left opacity-50">
            Gestisci categorie
          </ThemedText>

          <ScrollView
            contentContainerClassName=" items-start justify-center gap-4"
            className="flex-1 w-full relative top-6"
          >
            {
              // here we will render the categories
              categories?.map((category, index) => (
                <ThemedView
                  key={index}
                  className="w-full flex flex-row justify-between items-center px-6"
                  typeView="secondary"
                >
                  <ThemedView
                    className="flex flex-row justify-start items-center gap-2"
                    typeView="secondary"
                  >
                    <View
                      className="w-2 h-14"
                      style={{ backgroundColor: category.color }}
                    />

                    <ThemedText className="text-xl font-bold">
                      {category.name}
                    </ThemedText>
                  </ThemedView>
                  <PlatformPressable
                    onPress={() => {
                      removeCategory(category.id);
                    }}
                  >
                    <ThemedIcon icon="Trash2" size={24} typeIcon="red" />
                  </PlatformPressable>
                </ThemedView>
              ))
            }
          </ScrollView>
          <View className="w-full px-5 pb-5 absolute bottom-20 z-50">
            <MyButton
              title="Nuova categoria"
              onPress={() => {
                changeView();
              }}
            />
          </View>
        </ThemedAnimatedView>

        <ThemedAnimatedView
          style={AnimatedCategoryCreate}
          typeView="secondary"
          className="w-full fixed top-6 px-6 rounded-t-3xl"
        >
          <View className="w-full flex flex-row justify-between items-center ">
            <ThemedText className="text-3xl  opacity-50">
              Nuova categoria
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

          <View className="w-full flex justify-center items-center pt-5">
            <ColorPicker
              value={currentColor}
              onComplete={(color) => setColorCategory(color)}
              style={{ gap: 10, flexDirection: "column", alignItems: "center", justifyContent: "center" }}
            >
              <Panel1 style={{ width: 150, height: 150, overflow: "hidden"}} boundedThumb />
              <HueSlider style={{width: 200}} />
              <Swatches />
            </ColorPicker>
          </View>
        </ThemedAnimatedView>
      </View>
    </ThemedView>
  );
}
