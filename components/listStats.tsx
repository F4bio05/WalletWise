import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { Animated, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { DataPercentageType, TypeInfo } from "@/types/statistics";
import { AnimatedScroll } from "@/components/AnimatedScroll";
import { useSupabase } from "@/context/supabaseProvider";
import { format } from "date-fns";

export interface AnimatedScrollRef {
  show: () => void;
  hidden: () => void;
}

export interface ListStatsProps {
  type: TypeInfo;
  month: number;
  year: number;
}

const ListStats = forwardRef<AnimatedScrollRef, ListStatsProps>(
  ({ type, month, year }, ref) => {
    const [data, setData] = useState<DataPercentageType>([]);
    const { supabase } = useSupabase();
    const [emptyData, setEmptyData] = useState<{
      previous: boolean;
      current: boolean;
    }>({ previous: false, current: false });

    const tabPositionY = useSharedValue(500);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: tabPositionY.value }],
      };
    });

    const show = () => {
      tabPositionY.value = withSpring(20, {
        stiffness: 200,
        mass: 1,
        damping: 15,
      });
    };

    const hidden = () => {
      tabPositionY.value = withSpring(500, {
        stiffness: 200,
        mass: 2,
        damping: 15,
        velocity: 1.5,
      });
    };

    useImperativeHandle(ref, () => ({
      show,
      hidden,
    }));

    // Check how many days are in the current month
    const daysInMonth = () => {
      return new Date(year, month, 0).getDate();
    };

    const fetchDataYear = async () => {
      const { data, error } = await supabase
        .from("movements")
        .select("*")
        .gte("date", format(new Date(year, 1, 1), "yyyy-MM-dd"))
        .lte("date", format(new Date(year, 12, 31), "yyyy-MM-dd"));

      if (error) {
        console.error(error.message);
        return;
      }

      // nessun errore e data ottenuti con successo
      if (data && data.length > 0) {
        const categories = data.map((item) => item.category);
        const uniqueCategories = Array.from(new Set(categories));
        const result: DataPercentageType = [];
        const lenghtArray = categories.length;

        supabase
          .from("categories")
          .select("id, name, color")
          .in("id", uniqueCategories)
          .then((response) => {
            uniqueCategories.forEach((category) => {
              const categoryData = data.filter(
                (item) => item.category === category
              );

              // calcolo percentuale
              let percentage = (categoryData.length / lenghtArray) * 100;
              percentage = parseFloat(percentage.toFixed(2));

              result.push({
                color: response.data?.find((item) => item.id === category)
                  ?.color,
                label: response.data?.find((item) => item.id === category)
                  ?.name,
                percentage: percentage,
              });
            });

            hidden();

            setTimeout(() => {
              setData(result);
              show();
            }, 100);
          });
      } else {
        setData([]);
        console.log("no data");
      };
    };

    const fetchDataMonth = async () => {
      const { data, error } = await supabase
        .from("movements")
        .select("*")
        .gte("date", format(new Date(year, month - 1, 1), "yyyy-MM-dd"))
        .lte(
          "date",
          format(new Date(year, month - 1, daysInMonth()), "yyyy-MM-dd")
        );

      if (error) {
        console.error(error.message);
        return;
      }

      // nessun errore e data ottenuti con successo
      if (data && data.length > 0) {
        const categories = data.map((item) => item.category);
        const uniqueCategories = Array.from(new Set(categories));
        const result: DataPercentageType = [];
        const lenghtArray = categories.length;

        supabase
          .from("categories")
          .select("id, name, color")
          .in("id", uniqueCategories)
          .then((response) => {
            uniqueCategories.forEach((category) => {
              const categoryData = data.filter(
                (item) => item.category === category
              );

              // calcolo percentuale
              let percentage = (categoryData.length / lenghtArray) * 100;
              percentage = parseFloat(percentage.toFixed(2));

              result.push({
                color: response.data?.find((item) => item.id === category)
                  ?.color,
                label: response.data?.find((item) => item.id === category)
                  ?.name,
                percentage: percentage,
              });
            });

            hidden();

            setTimeout(() => {
              setData(result);
              show();
            }, 100);

          });
      } else {
        setData([]);
        console.log("no data");
      }
    };

    useEffect(() => {
      console.log(type, month, year);
      if (type === "year") fetchDataYear();
      else fetchDataMonth();
    }, [type, month, year]);

    return (
      <AnimatedScroll style={[animatedStyle]} className="w-full px-8">
        {data.length > 0 ? (
          data.map((item, index) => (
            <ThemedView
              key={index}
              typeView="secondary"
              className="w-full flex flex-row justify-start items-center rounded-xl py-5 px-5"
            >
              <View
                className="w-7 h-7 rounded-lg"
                style={{ backgroundColor: item.color }}
              />
              <View className="w-full pr-5 pl-3 flex-row justify-between items-center">
                <ThemedText typeText="text" className="text-2xl">
                  {item.label}
                </ThemedText>
                <ThemedText typeText="text" className="text-2xl">
                  {item.percentage}%
                </ThemedText>
              </View>
            </ThemedView>
          ))
        ) : (
          <ThemedView
            typeView="background"
            className="w-full flex justify-center items-center py-5"
          >
            <ThemedText typeText="text" className="text-2xl opacity-50">
              Nessun dato disponibile
            </ThemedText>
          </ThemedView>
        )}
      </AnimatedScroll>
    );
  }
);

export default ListStats;
