import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { itemsSupabaseType, itemSupabaseType } from "@/constants/calendar";
import { useSearchParams } from "expo-router/build/hooks";
import { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import { useSupabase } from "@/context/supabaseProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemeContext } from "@/context/themeContext";
import React from "react";


export default function modalShowEvents() {
  const { supabase } = useSupabase();

  const searchParams = useSearchParams();
  const events = JSON.parse(searchParams.get("events")!); // Parsed once

  const [profit, setProfit] = useState<itemsSupabaseType | []>([]);
  const [loss, setLoss] = useState<itemsSupabaseType | []>([]);
  const [profitIndexList, setProfitIndexList] = useState<boolean[]>([]); // List of opened index
  const [lossIndexList, setLossIndexList] = useState<boolean[]>([]); // List of opened index

  const [categories, setCategories] = useState<any[] | null>(null);

  const {theme} = useContext(ThemeContext);
  const openColor = useThemeColor(
    { theme: theme },
    "primary"
  );
  const closeColor = useThemeColor(
    { theme: theme },
    "secondary"
  );

  const resetList = (type: string) => {
    if (type === "profit") {
      setProfitIndexList(new Array(profit.length).fill(false));
    } else {
      setLossIndexList(new Array(loss.length).fill(false));
    }
  };

  const changeIndexOpened = (type: string, index: number) => {
    if (type === "profit") {
      profitIndexList.forEach((value, i) => {
        if (i === index) {
          setProfitIndexList((prev) => {
            prev[i] = !prev[i];
            return [...prev];
          });
        }
      });

      resetList("loss");
    } else {
      lossIndexList.forEach((value, i) => {
        if (i === index) {
          setLossIndexList((prev) => {
            prev[i] = !prev[i];
            return [...prev];
          });
        }
      });
      resetList("profit");
    }
  };

  useEffect(() => {
    // Get categories
    supabase
      .from("categories")
      .select("*")
      .then(({ data }) => {
        setCategories(data);
      });

    // Set profit and loss with filter events
    const profitEvents = events.filter(
      (event: itemSupabaseType) => event.type === "Entrata"
    );
    const lossEvents = events.filter(
      (event: itemSupabaseType) => event.type === "Uscita"
    );
    setProfit(profitEvents);
    setLoss(lossEvents);

    setProfitIndexList(new Array(profitEvents.length).fill(false));
    setLossIndexList(new Array(lossEvents.length).fill(false));
  }, []);

  return (
    <ThemedView
      className="h-full flex flex-col justify-start items-center rounded-t-3xl "
      typeView="secondary"
    >
      <ThemedView
        className="w-20 h-1.5 absolute top-2 rounded-full opacity-70"
        typeView="text"
      />

      <ThemedText className="w-full px-5 pt-7 text-3xl underline text-left opacity-50">
          {events[0]?.date}
        </ThemedText>
      
      <ScrollView
        contentContainerClassName="items-start justify-center gap-10 overflow-hidden"
        className="flex-1 w-full relative top-10 overflow-hidden"
      >
        

        {profit.length > 0 ? (
          <View>
            <ThemedText typeText="green" className="text-3xl px-5">
              Entrate
            </ThemedText>
            {profit?.map((event: itemSupabaseType | null, index: number) => (
              <PlatformPressable
                onPress={() => {
                  changeIndexOpened("profit", index);
                }}
                key={index}
                className={
                  !profitIndexList[index]
                    ? "w-full px-5 flex flex-row justify-start items-center"
                    : "w-full px-5 flex flex-row justify-start items-start"
                }
                style={{
                  backgroundColor: profitIndexList[index]
                    ? openColor
                    : closeColor,
                  height: profitIndexList[index] ? 100 : 50,
                }}
              >
                <View
                  style={{
                    backgroundColor: categories?.filter(
                      (cat) => cat.id === event?.category
                    )[0]["color"],
                  }}
                  className="h-full w-2"
                ></View>
                <View className="w-full flex flex-row justify-between items-center">
                  <View className="ml-2 flex flex-col justify-center items-start">
                    <ThemedText className="text-2xl truncate">
                      {event?.name}
                    </ThemedText>
                    <ThemedText
                      className={
                        profitIndexList[index] ? "flex opacity-70 truncate max-w-80" : "hidden"
                      } // Hidden if not opened
                    >
                      {event?.description}
                    </ThemedText>
                  </View>
                  <View className="h-full flex justify-center items-center">
                    <ThemedText className="text-2xl text-nowrap">
                      {event?.amount} €
                    </ThemedText>
                  </View>
                </View>
              </PlatformPressable>
            ))}
          </View>
        ) : null}

        {loss.length > 0 ? (
          <View>
            <ThemedText typeText="red" className="text-3xl px-5">
              Uscite
            </ThemedText>
            {loss?.map((event: itemSupabaseType | null, index: number) => (
              <PlatformPressable
                onPress={() => {
                  changeIndexOpened("loss", index);
                }}
                key={index}
                className={
                  !lossIndexList[index]
                    ? "w-full px-5 flex flex-row justify-start items-center"
                    : "w-full px-5 flex flex-row justify-start items-start"
                }
                style={{
                  backgroundColor: lossIndexList[index]
                    ? openColor
                    : closeColor,
                  height: lossIndexList[index] ? 100 : 50,
                }}
              >
                <View
                  style={{
                    backgroundColor: categories?.filter(
                      (cat) => cat.id === event?.category
                    )[0]["color"],
                  }}
                  className="h-full w-2"
                ></View>
                <View className="w-full flex flex-row justify-between items-center">
                  <View className="ml-2 flex flex-col justify-center items-start">
                    <ThemedText className="text-2xl truncate">
                      {event?.name}
                    </ThemedText>
                    <ThemedText
                      className={
                        lossIndexList[index] ? "flex opacity-70 truncate max-w-80" : "hidden"
                      } // Hidden if not opened
                    >
                      {event?.description}
                    </ThemedText>
                  </View>
                  <View className="h-full flex justify-center items-center">
                    <ThemedText className="text-2xl text-nowrap">
                      {event?.amount} €
                    </ThemedText>
                  </View>
                </View>
              </PlatformPressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}
