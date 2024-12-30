/* eslint-disable prettier/prettier */
import { Slot, Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import Animated, { Easing, ScreenTransition } from "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SharedTransition } from "react-native-reanimated";

// import { Animated } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // const [slideAnim] = useState(new Animated.Value(500));  // Iniziamo fuori schermo a destra

  // useEffect(() => {
  //   // Animazione di slide-in da destra
  //   Animated.timing(slideAnim, {
  //     toValue: 0,  // Vogliamo che la schermata arrivi nella posizione originale
  //     duration: 500,  // Durata della transizione (in millisecondi)
  //     useNativeDriver: true,  // Utilizza il driver nativo per ottimizzare le performance
  //   }).start();

  //   // Gestione dell'uscita (quando la schermata viene smontata)
  //   return () => {
  //     Animated.timing(slideAnim, {
  //       toValue: 500,  // Sposta la schermata di nuovo fuori schermo
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start();
  //   };
  // }, [slideAnim]);
  // const [slideAnim] = useState(new Animated.Value(500));  // Iniziamo fuori schermo
  // const [fadeAnim] = useState(new Animated.Value(0));  // Iniziamo con opacità 0

  // const transition = (
  // <ScreenTransition.SwipeLeft.belowTopScreenStyle>
  //    <Transition.In type="fade" durationMs={500} />
  //    <Transition.Out type="fade" durationMs={500} />
  // </ScreenTransition.SwipeLeft.belowTopScreenStyle>
  // );

  // useEffect(() => {
  //   Animated.parallel([
  //     // Animazione di slide
  //     Animated.timing(slideAnim, {
  //       toValue: 0,  // Arriviamo nella posizione finale
  //       duration: 500,
  //       useNativeDriver: true,
  //     }),
  //     // Animazione di fade-in
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,  // Aumentiamo l'opacità a 1
  //       duration: 500,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();

  //   return () => {
  //     // Animazioni di uscita
  //     Animated.parallel([
  //       Animated.timing(slideAnim, {
  //         toValue: 500,  // Spostiamo fuori schermo
  //         duration: 500,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(fadeAnim, {
  //         toValue: 0,  // Riduciamo l'opacità a 0
  //         duration: 500,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   };
  // }, [slideAnim, fadeAnim]);

  return (
    // <SupabaseProvider>
    // <Stack screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="index" />
    //   <Stack.Screen name="register" />
    //   <Stack.Screen
    //     name="updateUser"
    //     options={{
    //       headerBackTitle: "Indietro",
    //       title: "Dati personali",
    //       headerShown: true,
    //     }}
    //   />
    // </Stack>
    // <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
    // <Transitioning.View transition={transition} style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
    <Slot />
    // </Transitioning.View>
    // </Animated.View>
    // </SupabaseProvider>
  );
}
