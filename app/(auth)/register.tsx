/* eslint-disable prettier/prettier */
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Input } from "@/components/Input";
import { MyButton } from "@/components/MyButton";
import { ThemedLink } from "@/components/ThemedLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSupabase } from "@/context/supabaseProvider";

export default function SingUp() {
  const { supabase, session } = useSupabase();
  const [userEmail, setEmail] = useState("");
  const [userPass, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  function checkCred(): void {
    setEmail(userEmail.trim());
    setPassword(userPass.trim());
    setRePassword(rePassword.trim());
    setLoading(true);

    if (
      userEmail !== "" &&
      userPass !== "" &&
      rePassword !== "" &&
      userPass === rePassword
    ) {
      if (
        userPass.length >= 8 &&
        userPass.match(/[a-z]/) &&
        userPass.match(/[A-Z]/) &&
        userPass.match(/[0-9]/) &&
        userPass.match(/[!?&#@_]/)
      ) {
        signUpWithEmail();
      } else {
        Alert.alert(
          "Errore",
          "La password non rispetta i requisiti, riprovare"
        );
      }
    } else {
      Alert.alert("Errore", "Controlla i dati inseriti");
    }
  }

  async function signUpWithEmail() {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: userEmail,
      password: userPass,
    });
    setLoading(false);

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    if (session) {
      router.push("/(auth)/updateUser");
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView className="w-full flex-1 flex-col justify-center items-center gap-24">
          <ThemedText className="text-6xl">WalletWise</ThemedText>

          <View className="w-full px-10 flex-col justify-center items-center gap-10">
            <Input
              value={userEmail}
              setValue={setEmail}
              keyBoardType="email-address"
              placeholder="Email"
              capitalize="none"
              iconName="Mail"
            />
            <Input
              value={userPass}
              setValue={setPassword}
              showText={false}
              placeholder="Password"
              capitalize="none"
              iconName="Lock"
            />
            <Input
              value={rePassword}
              setValue={setRePassword}
              showText={false}
              capitalize="none"
              placeholder="Re-Password"
              iconName="Lock"
            />
          </View>

          <View className="flex-col justify-center items-center gap-4">
            <View className="w-80 py-2 rounded-xl">
              <MyButton
                title="Continua"
                onPress={checkCred}
                disabled={loading}
              />
            </View>

            <ThemedText className="text-lg">
              Hai già un account? <ThemedLink text="Accedi" url="/" />
            </ThemedText>
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
