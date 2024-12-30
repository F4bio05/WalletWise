import { PlatformPressable } from "@react-navigation/elements";
import { Alert, Dimensions, FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ExternalPathString, router } from "expo-router"

import { HeaderBar } from "@/components/HeaderBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedIcon } from "@/components/ThemedIcon";
import { ItemCalendar } from "@/components/ItemCalendar";

import {
  numberToMonth,
  days,
  dayToNumber,
  itemsCalendarType,
  itemsSupabaseType,
  itemSupabaseType,
} from "@/constants/calendar";
import { useSupabase } from "@/context/supabaseProvider";

export default function Calendar() {
  const { supabase } = useSupabase();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [itemCalendar, setItemCalendar] = useState<itemsCalendarType>([]);
  const [profit, setProfit] = useState<number>(0);
  const [loss, setLoss] = useState<number>(0);

  const dimensions = Dimensions.get("screen");
  const cellWidth = ((dimensions.width / 100) * 92) / 7;

  
  const setItemCalendarFunction = async () => {
    let items = [];
    const days = daysInMonth();
    const start = dayToNumber[startDate()];
    const end = dayToNumber[endDate()];

    try {
      // Set null day before start month
      for (let i = 0; i < start - 1; i++) {
        items.push(null);
      }

      const { data, error } = await supabase.from("movements").select("*");

      if (error) new Error(error.message);

      // Set days of the month
      for (let i = 1; i <= days; i++) {
        const date = new Date(currentYear, currentMonth - 1, i);

        // Check if the date exist in the supabaseEvent
        const exist_date = data?.some(async (item) =>
          compareDate(new Date(item.date), date)
        );
        const e = exist_date
          ? (data?.filter((item) =>
              compareDate(new Date(item.date), date)
            ) as itemsSupabaseType)
          : undefined;

        items.push({
          item: i.toString(),
          date_string: date.toLocaleDateString("it-IT", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          date: date,
          events: e,
        });
      }

      // Set null day after end month
      for (let i = 0; i < 7 - ((days + start) % 7); i++) {
        items.push(null);
      }

      setItemCalendar(items);
    } catch (error: Error | any) {
      Alert.alert("Errore caricamento eventi", error.message);
    }
  };

  const getProfitLoss = async () => { 
    try {
      const days = daysInMonth();
      const { data, error } = await supabase
        .from("movements")
        .select("*")
        .gte("date", format(new Date(currentYear, currentMonth-1, 1), "yyyy-MM-dd"))
        .lte("date", format(new Date(currentYear, currentMonth-1, daysInMonth()), "yyyy-MM-dd"));
      

      if (error) new Error(error.message);

      if (data && data.length > 0) {
        let p: number = 0;
        let l: number = 0;
        data.forEach((item: itemSupabaseType) => {
          if (item.type === "Entrata") {
            p += item.amount;
          } else {
            l += item.amount;
          }
        })
        setProfit(p);
        setLoss(l);
      } else {
        setProfit(0);
        setLoss(0);
      }
    } catch (error: Error | any) {
      Alert.alert("Errore caricamento eventi", error.message);
    }
  };

  useEffect(() => {
    setItemCalendarFunction();
    getProfitLoss();
  }, [currentMonth, currentYear]);

  // Subscribe to the supabase event
  
  supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'movements' },
      (payload) => {
        
      }
    )
    .subscribe()

  // Change the date
  function handleChangeMonth(action: string): void {
    if (action === "next") {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  }

  // Compare two date from parameters
  function compareDate(date1: Date | null, date2: Date | null): boolean {
    return (
      date1?.getMonth() === date2?.getMonth() &&
      date1?.getFullYear() === date2?.getFullYear() &&
      date1?.getDate() === date2?.getDate()
    );
  }

  // Check if the current month and current year are the same as the current date
  function nowCurrentDate(): Boolean {
    return (
      new Date().getMonth() + 1 === currentMonth &&
      new Date().getFullYear() === currentYear
    );
  }

  // Check if the current full date is the same as the current date
  function nowCurrentFullDate(date: string): boolean {
    return (
      new Date().toLocaleDateString("it-IT", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }) === date
    );
  }

  // Check how many days are in the current month
  function daysInMonth() {
    return new Date(currentYear, currentMonth, 0).getDate();
  }

  // Get start date of the month
  function startDate(): keyof typeof dayToNumber {
    return new Date(currentYear, currentMonth - 1, 1).toLocaleDateString(
      "it-IT",
      {
        weekday: "short",
      }
    ) as keyof typeof dayToNumber;
  }

  // Get end date of the month
  function endDate(): keyof typeof dayToNumber {
    return new Date(
      currentYear,
      currentMonth,
      daysInMonth()
    ).toLocaleDateString("it-IT", {
      weekday: "short",
    }) as keyof typeof dayToNumber;
  }

  function showEvents(events: itemsSupabaseType | []) {
    if (events && events.length > 0)
      router.push({
        pathname: "/modals/modalShowEvents" as ExternalPathString,
        params: { events: JSON.stringify(events) },
      });
  }

  return (
    <ThemedView className="flex-1 justify-start items-center pt-[17rem]">
      <HeaderBar namePage="Calendario" profit={profit} loss={loss} goto="settings" />
      <View className="w-full flex flex-col justify-center items-center gap-6">
        <View className="w-4/5 flex flex-row justify-between items-center">
          <PlatformPressable onPress={() => handleChangeMonth("previous")}>
            <ThemedIcon icon="ChevronLeft" size={42} typeIcon="red" />
          </PlatformPressable>

          <ThemedText
            className={
              nowCurrentDate()
                ? "text-3xl text-center underline"
                : "text-3xl text-center"
            }
            typeText={nowCurrentDate() ? "primary" : "text"}
          >
            {numberToMonth[currentMonth as keyof typeof numberToMonth]}{" "}
            {currentYear}
          </ThemedText>

          <PlatformPressable
            id="nxt_btn"
            onPress={() => handleChangeMonth("next")}
          >
            <ThemedIcon icon="ChevronRight" size={42} typeIcon="green" />
          </PlatformPressable>
        </View>

        <View className="w-full flex flex-col justify-center items-center ">
          <View className="w-11/12 flex flex-row justify-between items-center">
            {days.map((day, index) => (
              <View
                key={index}
                style={{
                  width: cellWidth,
                  height: cellWidth,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText key={index} className="text-xl text-center">
                  {day}
                </ThemedText>
              </View>
            ))}
          </View>

          <FlatList
            className="w-11/12"
            data={itemCalendar}
            numColumns={7}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  width: cellWidth,
                  height: cellWidth,
                  padding: 3,
                }}
              >
                {item === null ? null : (
                  <ItemCalendar
                    index={index}
                    item={item}
                    today={nowCurrentFullDate(item?.date_string)}
                    onClick={(events) => showEvents(events)}
                  />
                )}
              </View>
            )}
          />
        </View>
      </View>
    </ThemedView>
  );
}
