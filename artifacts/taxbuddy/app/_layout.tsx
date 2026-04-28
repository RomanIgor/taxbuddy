import { ProfileProvider } from "@/contexts/ProfileContext";
import { IncomeProvider } from "@/contexts/IncomeContext";
import { ExpensesProvider } from "@/contexts/ExpensesContext";
import { TripsProvider } from "@/contexts/TripsContext";
import { ExportsProvider } from "@/contexts/ExportsContext";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Zurück" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="income/new" options={{ title: "Einnahme erfassen" }} />
      <Stack.Screen name="income/[id]" options={{ title: "Einnahme Details" }} />
      <Stack.Screen name="expense/new" options={{ title: "Ausgabe erfassen" }} />
      <Stack.Screen name="expense/[id]" options={{ title: "Ausgabe Details" }} />
      <Stack.Screen name="trip/new" options={{ title: "Fahrt erfassen" }} />
      <Stack.Screen name="trip/[id]" options={{ title: "Fahrt Details" }} />
      <Stack.Screen name="tip/[id]" options={{ title: "Steuer-Tipp" }} />
      <Stack.Screen name="ai" options={{ title: "KI-Assistent", presentation: "modal" }} />
      <Stack.Screen name="invoice-check" options={{ title: "Rechnungs-Check" }} />
      <Stack.Screen name="simulation" options={{ title: "Simulation" }} />
      <Stack.Screen name="forecast" options={{ title: "Prognose" }} />
      <Stack.Screen name="export" options={{ title: "Export" }} />
      <Stack.Screen name="profile" options={{ title: "Profil" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <ProfileProvider>
                <IncomeProvider>
                  <ExpensesProvider>
                    <TripsProvider>
                      <ExportsProvider>
                        <RootLayoutNav />
                      </ExportsProvider>
                    </TripsProvider>
                  </ExpensesProvider>
                </IncomeProvider>
              </ProfileProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
