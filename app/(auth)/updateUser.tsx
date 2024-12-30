/* eslint-disable prettier/prettier */
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  type TextProps,
} from "react-native";

import { Input } from "@/components/Input";
import { MyButton } from "@/components/MyButton";
import { ThemedView } from "@/components/ThemedView";
import { useSupabase } from "@/context/supabaseProvider";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function UpdateUser({ lightColor, darkColor }: ThemedTextProps) {
  const { supabase, session } = useSupabase();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [typeIncome, setTypeIncome] = useState("");
  const [inc, setIncome] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  function checkCred() {
    setName(name.trim());
    setSurname(surname.trim());

    if (name !== "" && surname !== "") {
      updateProfile();
    } else {
      Alert.alert("Errore", "Controlla i dati inseriti");
    }
  }

  async function updateProfile() {
    setLoading(true);
    try {
      if (!session) throw new Error("No user on the session!");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session?.user.id,
          username: session?.user.email,
          full_name: name + " " + surname,
          income: parseFloat(inc),
          type_income: typeIncome,
          updated_at: new Date(),
        })
        .select();

      if (error) {
        throw error;
      }

      router.push("/(auth)");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }

    setLoading(false);
  }

  return (
    // <AniView>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView
            // className="w-full h-[72%] flex-1 flex-col justify-start items-center absolute bottom-0 px-5 py-10 gap-5 rounded-tl-3xl rounded-tr-3xl"
            className=" flex-1 flex-col justify-start items-center"
          >
            <View className="flex-1 flex-col justify-start items-center gap-10 w-full px-10 pt-32">
              <Input value={name} setValue={setName} placeholder="Nome" />
              <Input
                value={surname}
                setValue={setSurname}
                placeholder="Cognome"
                iconName="User"
              />
              <Input
                value={typeIncome}
                setValue={setTypeIncome}
                placeholder="Origine del reddito (Opzionale)"
                iconName="BriefcaseBusiness"
              />
              <Input
                value={inc}
                setValue={setIncome}
                placeholder="Reddito (Opzionale)"
                keyBoardType="numeric"
                iconName="Euro" 
              />
              <View className="w-full px-20 mt-48">
                <MyButton
                  title="Aggiorna"
                  onPress={checkCred}
                  disabled={loading}
                />
              </View>
            </View>
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    // </AniView>
  );
}
