import { useContext, useEffect, useState } from "react";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";

import { ButtonGroup } from "@/components/ButtonGroup";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ButtonGroupItem } from "@/constants/buttonsGroupItem";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { useSupabase } from "@/context/supabaseProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DynamicColorText } from "@/components/DynamicColorText";
import { Colors } from "@/constants/Colors";
import { DynamicColorIcon } from "@/components/DynamicColorIcon";
import { MyButton } from "@/components/MyButton";
import { AnimatedButton } from "@/components/AnimatedButton";
import { router } from "expo-router";
import { ThemeContext } from "@/context/themeContext";
import React from "react";

export default function modalAddMove() {
  const { theme } = useContext(ThemeContext);
  const unselectedColor = useThemeColor({ theme: theme }, "secondary");

  const { supabase, session } = useSupabase();

  const [type, setType] = useState("Entrata");
  const [nameMove, setNameMove] = useState("");
  const [value, setValue] = useState<string>("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<{
    color: string;
    created_at: Date;
    created_by: null | number;
    id: number;
    name: string;
  }>();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sub, setSub] = useState(false);
  const [period, setPeriod] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const changeType = (type: string) => {
    setType(type);
  };

  const getCategoris = async () => {
    let tmp = [];

    const { data: categories1, error: e1 } = await supabase
      .from("categories")
      .select("*")
      .is("created_by", null);
    if (e1) {
      Alert.alert("Get Admin Category Error", e1.message);
    }

    const { data: categories2, error: e2 } = await supabase
      .from("categories")
      .select("*")
      .eq("created_by", session?.user?.id);
    if (e2) {
      Alert.alert("Get User Category Error", e2.message);
    }

    tmp = [...categories1!, ...categories2!];

    setCategories(tmp);
  };

  useEffect(() => {
    getCategoris();
  }, []);

  const addMovement = async () => {
    if (!nameMove) {
      Alert.alert("Errore Movimento", "Inserire il nome del movimento");
      return;
    } else if (!value) {
      Alert.alert("Errore Movimento", "Inserire l'importo del movimento");
      return;
    } else if (!category) {
      Alert.alert("Errore Movimento", "Selezionare una categoria");
      return;
    } else if (!selectedDate) {
      Alert.alert("Errore Movimento", "Selezionare una data");
      return;
    } else {
      const { data, error } = await supabase.from("movements").insert([
        {
          type: type,
          name: nameMove,
          description: description,
          subscription: sub,
          date: format(selectedDate!, "yyyy-MM-dd"),
          period_sub: period,
          category: category!.id,
          amount: parseFloat(value),
        },
      ]);

      if (error) Alert.alert("Errore Movimento", error.message);
      else router.back();
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView className="flex-1 flex-col justify-start items-center gap-8 pt-10 px-5">
          <ButtonGroup components={ButtonGroupItem} onPress={changeType} />

          <View className="w-full">
            <Input
              value={nameMove}
              setValue={setNameMove}
              placeholder="Nome movimento"
            />
          </View>

          <View className="w-full">
            <Input
              value={value}
              setValue={setValue}
              placeholder="Importo"
              keyBoardType="numeric"
            />
          </View>

          <View className="w-full">
            <TextArea
              value={description}
              setValue={setDescription}
              placeholder="Descrizione"
            />
          </View>

          <View className="w-full flex flex-row justify-between items-center">
            <SelectDropdown
              data={categories}
              onSelect={(selectedItem) => {
                setCategory(selectedItem);
              }}
              renderButton={(selectedItem, isOpened) => (
                <View
                  className="w-[45%] flex flex-row justify-between items-center py-3 px-2  text-center rounded-xl"
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
                    text={selectedItem ? selectedItem.name : "Seleziona"}
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
                    index > 0 && index < categories.length - 1
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

            <View className="w-[45%] py-0">
              <MyButton
                title={
                  selectedDate
                    ? selectedDate.toLocaleDateString("it-IT", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })
                    : "Scegli data"
                }
                style={{ paddingVertical: 0 }}
                onPress={showDatePicker}
                backgroundColor="secondary"
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                className="font-lexend"
              />
            </View>
          </View>
          <View className="w-full flex justify-center items-center pl-4 -mt-2">
            <AnimatedButton btnClick={setSub} dropClick={setPeriod} />
          </View>

          <View className="w-full flex justify-center items-center pt-14 px-20">
            <MyButton title="Aggiungi Movimento" onPress={addMovement} />
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
