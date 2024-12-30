import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View } from "react-native";
import { router } from "expo-router";

import { Input } from "@/components/Input";
import { MyButton } from "@/components/MyButton";
import { ThemedLink } from "@/components/ThemedLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSupabase } from "@/context/supabaseProvider";

export default function Login() {
  const { supabase, session } = useSupabase();
  const [userEmail, setEmail] = useState("f.fariselli05@gmail.com");
  const [userPass, setPassword] = useState("Fabio1!Linda4$");
  const [loading, setLoading] = useState(false);

  function checkCred(): void {
    setEmail(userEmail.trim());
    setPassword(userPass.trim());
    setLoading(true);

    if (userEmail !== "" && userPass !== "") {
      signInWithEmail();
    } else {
      Alert.alert("Errore", "Controlla i dati inseriti");
      setLoading(true);
    }
  }

  async function signInWithEmail() {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPass,
    });
    setLoading(false);

    if (error) {
      Alert.alert(error.message);
    } else {
      router.push("/(protected)");
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="w-full flex-1 flex-col justify-center items-center gap-24">
        <ThemedText className="text-6xl">WalletWise</ThemedText>

        <View className="w-full flex-col justify-center items-center gap-10 px-10">
          <Input
            value={userEmail}
            setValue={setEmail}
            keyBoardType="email-address"
            capitalize="none"
            placeholder="Email"
            iconName="Mail"  
          />
          <Input
            value={userPass}
            setValue={setPassword}
            showText={false}
            capitalize="none"
            placeholder="Password"
            iconName="Lock"
          />
        </View>

        <View className="flex-col justify-center items-center gap-4">
          <View className="w-80 py-2 rounded-xl">
            <MyButton
              title="Login"
              disabled={loading}
              onPress={() => {
                checkCred();
              }}
            />
          </View>

          <ThemedText className="text-lg">
            Non hai un account? <ThemedLink text="Registrati" url="/register" />
          </ThemedText>
        </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
