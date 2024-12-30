import { BarChart } from "react-native-gifted-charts";
import { useContext, useEffect, useRef, useState } from "react";
import { PlatformPressable } from "@react-navigation/elements";
import { format } from "date-fns";
import { Alert, Dimensions, View, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSupabase } from "@/context/supabaseProvider";

import { monthToNumberShort, numberToMonthShort } from "@/constants/calendar";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/context/themeContext";
import { ThemedIcon } from "@/components/ThemedIcon";
import { HeaderBar } from "@/components/HeaderBar";
import { AnimatedScrollRef } from "@/components/listStats";
import ListStats from "@/components/listStats";
import { DataStatType } from "@/types/statistics";
import { TypeInfo } from "@/types/statistics";


export default function StatisticsPage() {
  const statRef = useRef<AnimatedScrollRef>(null);
  const { supabase } = useSupabase();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(-1);
  const [empty, setEmpty] = useState<boolean>(false);
  const [data, setData] = useState<DataStatType>([]);
  const { theme } = useContext(ThemeContext);

  const { width, height } = Dimensions.get("window");

  const [typeInfo, setTypeInfo] = useState<TypeInfo>("year");
  const [monthSelected, setMonthSelected] = useState<string>("");

  const fetchStatistics = async () => {
    const { data, error } = await supabase
      .from("movements")
      .select("*")
      .gte("date", format(new Date(year, 1, 1), "yyyy-MM-dd"))
      .lte("date", format(new Date(year, 12, 31), "yyyy-MM-dd"));

    if (error) {
      console.error(error.message);
      return;
    }

    // array con data sui movimenti ottenuti con successo
    if (data && data.length > 0) {
      setEmpty(false);

      const months: DataStatType = [];

      Object.keys(numberToMonthShort).map((key) => {
        let profit: number = 0;
        let loss: number = 0;

        if (
          data.filter((item) => format(new Date(item.date), "MM") == key)
            .length === 0
        ) {
          months.push({
            value: 0,
            label:
              numberToMonthShort[
                parseInt(key) as keyof typeof numberToMonthShort
              ],
            spacing: 10,
            labelWidth: 38,
          });
          months.push({ value: 0 });
          return;
        }

        const events = data.filter(
          (item) => format(new Date(item.date), "MM") == key
        );

        if (events.length !== 0) {
          events.forEach((item) => {
            if (item.type === "Entrata") profit += item.amount;
            else loss += item.amount;
          });

          months.push({
            value: profit,
            label:
              numberToMonthShort[
                parseInt(key) as keyof typeof numberToMonthShort
              ],
            frontColor: Colors[theme].green,
            spacing: 10,
            labelWidth: 38,
          });
          months.push({
            value: loss,
            frontColor: Colors[theme].red,
          });
        }
      });

      setData(months);
    } else {
      // array vuoto
      setEmpty(true);

      const months: Array<{
        value: number;
        label?: string;
        frontColor?: string;
        spacing?: number;
        labelWidth?: number;
      }> = [];
      Object.keys(numberToMonthShort).map((key) => {
        months.push({
          value: 0,
          label:
            numberToMonthShort[
              parseInt(key) as keyof typeof numberToMonthShort
            ],
          spacing: 10,
          labelWidth: 38,
        });
        months.push({ value: 0 });
      });
      setData(months);
    }
  };

  const handleChangeYear = (type: "next" | "previous") => {
    if (type === "next") {
      setYear(year + 1);
    } else {
      setYear(year - 1);
    }
  };

  const nowCurrentYear = (): boolean => {
    return year === new Date().getFullYear();
  };

  const showMoreStats = () => {
    if (
      data.find((item) => item.label == monthSelected && item.value != 0) &&
      !empty
    ) {
      router.push("/modals/modalStats");
    } else {
      Alert.alert("Nessun dato", "Non ci sono dati da mostrare");
    }
  };

  const resetStatsView = () => {
    setTypeInfo("year");
    setMonth(-1);
  }

  useEffect(() => {
    fetchStatistics(); 
  }, [year]);

  return (
    <TouchableWithoutFeedback onPress={() => resetStatsView()}>
    <ThemedView className="flex-1 justify-start items-center pt-44 ">
      <HeaderBar namePage="Statistiche" goto="home" />

      <View className="w-full flex-1 justify-start items-center px-5">
        <View className="w-4/5 flex flex-row justify-between items-center">
          <PlatformPressable
            onPress={() => {
              handleChangeYear("previous");
              setMonth(-1);
              setTypeInfo("year");
            }}
          >
            <ThemedIcon icon="ChevronLeft" size={42} typeIcon="red" />
          </PlatformPressable>

          <ThemedText
            className={
              nowCurrentYear()
                ? "text-3xl text-center underline"
                : "text-3xl text-center"
            }
            typeText={nowCurrentYear() ? "primary" : "text"}
          >
            {year}
          </ThemedText>

          <PlatformPressable
            id="nxt_btn"
            onPress={() => {
              handleChangeYear("next");
              setMonth(-1);
              setTypeInfo("year");
            }}
          >
            <ThemedIcon icon="ChevronRight" size={42} typeIcon="green" />
          </PlatformPressable>
        </View>

        <ThemedView className="w-full py-4  rounded-3xl">
          <BarChart
            data={data}
            barWidth={14}
            spacing={30}
            roundedTop
            roundedBottom
            // hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            noOfSections={empty ? 1 : 8}
            showFractionalValues={false}
            xAxisColor={Colors[theme].text}
            yAxisColor={Colors[theme].text}
            activeOpacity={1}
            xAxisLabelTextStyle={{
              color: Colors[theme].text,
              opacity: 0.5,
              textAlign: "center",
              fontSize: 20,
              fontFamily: "Lexend",
              height: 28,
            }}
            yAxisTextStyle={{
              color: Colors[theme].text,
              opacity: 0.5,
              textAlign: "center",
              fontSize: 20,
              fontFamily: "Lexend",
            }}
            width={(width / 4) * 3}
            onPress={(
              item: { label?: keyof typeof monthToNumberShort },
              index: number
            ) => {
              if (item.label !== undefined) {
                setMonth(monthToNumberShort[item.label]);
                setTypeInfo("month");
                setMonthSelected(item.label);
              } else {
                setMonth(-1);
                setTypeInfo("year");
                setMonthSelected("");
              }
            }}
          />
        </ThemedView>

        {/* DIVIDER */}
        <View className="h-4" />

        {/* <PlatformPressable onPress={() => showMoreStats()}> */}
          {/* <ThemedView typeView="primary" className="mt-3 rounded-xl"> */}
            <ThemedText
              typeText="text"
              className="text-3xl tracking-[2px] py-1.5 px-5 "
            >
              Più info
            </ThemedText>
          {/* </ThemedView> */}
        {/* </PlatformPressable> */}

        <View className="w-full flex justify-center items-center">
          <ListStats ref={statRef} type={typeInfo} month={month} year={year} />
        </View>
      </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}
