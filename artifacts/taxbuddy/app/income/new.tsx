import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { useIncomes } from "@/contexts/IncomeContext";
import { Income } from "@/types";

const CATEGORIES: Income["category"][] = [
  "Beratung",
  "Entwicklung",
  "Verkauf",
  "Sonstiges",
];

export default function IncomeNewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addIncome } = useIncomes();

  const [amount, setAmount] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState<Income["category"]>("Beratung");
  const [status, setStatus] = useState<Income["status"]>("paid");
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const num = parseFloat(amount.replace(",", "."));
    if (!amount || isNaN(num) || num <= 0) {
      setError("Bitte einen gültigen Betrag eingeben.");
      return;
    }
    if (!client.trim()) {
      setError("Bitte einen Kunden eingeben.");
      return;
    }
    setError(null);
    await addIncome({
      amount: num,
      client: client.trim(),
      category,
      status,
      date: new Date().toISOString(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[styles.scroll, { paddingTop: 16 }]}
        bottomOffset={120}
      >
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Betrag (€)
          </Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              styles.inputBig,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
            autoFocus
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Kunde
          </Text>
          <TextInput
            value={client}
            onChangeText={setClient}
            placeholder="z. B. Acme GmbH"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Kategorie
          </Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  Haptics.selectionAsync();
                  setCategory(c);
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      category === c ? colors.primary : colors.card,
                    borderColor:
                      category === c ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      category === c
                        ? colors.primaryForeground
                        : colors.foreground,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Status
          </Text>
          <View style={styles.chipRow}>
            {(
              [
                { id: "paid", label: "Bezahlt" },
                { id: "open", label: "Offen" },
              ] as const
            ).map((s) => (
              <Pressable
                key={s.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setStatus(s.id);
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      status === s.id ? colors.primary : colors.card,
                    borderColor:
                      status === s.id ? colors.primary : colors.border,
                    flex: 1,
                    alignItems: "center",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Feather
                    name={s.id === "paid" ? "check-circle" : "clock"}
                    size={14}
                    color={
                      status === s.id
                        ? colors.primaryForeground
                        : colors.foreground
                    }
                  />
                  <Text
                    style={{
                      color:
                        status === s.id
                          ? colors.primaryForeground
                          : colors.foreground,
                      fontFamily: "Inter_500Medium",
                    }}
                  >
                    {s.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {error ? (
          <Text style={[styles.error, { color: colors.critical }]}>
            {error}
          </Text>
        ) : null}
      </KeyboardAwareScrollViewCompat>

      <View
        style={[
          styles.footer,
          {
            paddingBottom:
              (Platform.OS === "web" ? 16 : insets.bottom) + 16,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text
            style={{
              color: colors.primaryForeground,
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
            }}
          >
            Speichern
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    gap: 18,
    paddingBottom: 140,
  },
  field: { gap: 8 },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  inputBig: {
    height: 64,
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  error: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  cta: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
});
