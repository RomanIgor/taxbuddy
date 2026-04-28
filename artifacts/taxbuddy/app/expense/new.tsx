import React, { useMemo, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { useExpenses } from "@/contexts/ExpensesContext";
import { ExpenseCategory } from "@/types";
import { enrichExpense } from "@/utils/expenseEnrichment";
import { formatCurrency } from "@/utils/format";

const CATEGORIES: ExpenseCategory[] = [
  "Hardware",
  "Software",
  "Reisen",
  "Bewirtung",
  "Büro",
  "Telefon/Internet",
  "Weiterbildung",
  "Sonstiges",
];

export default function ExpenseNewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addExpense } = useExpenses();

  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Software");
  const [error, setError] = useState<string | null>(null);

  const num = parseFloat(amount.replace(",", "."));
  const enrichment = useMemo(
    () => (num > 0 ? enrichExpense(num, category) : null),
    [num, category],
  );

  const flagColor = (flag: string) =>
    flag === "ok"
      ? colors.success
      : flag === "check"
        ? colors.warning
        : colors.critical;

  const handleSave = async () => {
    if (!amount || isNaN(num) || num <= 0) {
      setError("Bitte einen gültigen Betrag eingeben.");
      return;
    }
    if (!vendor.trim()) {
      setError("Bitte einen Anbieter eingeben.");
      return;
    }
    setError(null);
    const e = enrichExpense(num, category);
    await addExpense({
      amount: num,
      vendor: vendor.trim(),
      description: description.trim() || undefined,
      category,
      flag: e.flag,
      paragraph: e.paragraph,
      taxImpact: e.taxImpact,
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
            Anbieter
          </Text>
          <TextInput
            value={vendor}
            onChangeText={setVendor}
            placeholder="z. B. Adobe"
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
            Beschreibung
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="optional"
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

        {enrichment ? (
          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View style={styles.previewHeader}>
              <View
                style={[
                  styles.flagDot,
                  { backgroundColor: flagColor(enrichment.flag) },
                ]}
              />
              <Text
                style={[styles.previewTitle, { color: colors.foreground }]}
              >
                Automatische Einordnung
              </Text>
            </View>
            <Text
              style={[styles.previewParagraph, { color: colors.primary }]}
            >
              {enrichment.paragraph}
            </Text>
            <Text
              style={[styles.previewHint, { color: colors.mutedForeground }]}
            >
              {enrichment.hint}
            </Text>
            <Text
              style={[styles.previewTax, { color: colors.foreground }]}
            >
              Steuerlicher Effekt ≈ {formatCurrency(enrichment.taxImpact)}
            </Text>
          </View>
        ) : null}

        {error ? (
          <Text style={{ color: colors.critical, fontFamily: "Inter_500Medium" }}>
            {error}
          </Text>
        ) : null}
      </KeyboardAwareScrollViewCompat>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: (Platform.OS === "web" ? 16 : insets.bottom) + 16,
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
  previewCard: {
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flagDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  previewTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  previewParagraph: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  previewHint: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Inter_500Medium",
  },
  previewTax: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
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
