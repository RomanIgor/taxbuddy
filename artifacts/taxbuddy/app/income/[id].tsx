import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useIncomes } from "@/contexts/IncomeContext";
import { formatCurrency, formatDate } from "@/utils/format";

export default function IncomeDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { incomes, removeIncome, updateIncome } = useIncomes();
  const item = incomes.find((i) => i.id === id);

  if (!item) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text style={{ color: colors.mutedForeground }}>
          Eintrag nicht gefunden.
        </Text>
      </View>
    );
  }

  const togglePaid = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await updateIncome(item.id, {
      status: item.status === "paid" ? "open" : "paid",
    });
  };

  const handleDelete = () => {
    const doDelete = async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await removeIncome(item.id);
      router.back();
    };
    if (Platform.OS === "web") {
      doDelete();
      return;
    }
    Alert.alert("Löschen?", "Diese Einnahme wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Löschen", style: "destructive", onPress: doDelete },
    ]);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.hero,
          {
            backgroundColor: colors.primary,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={styles.heroLabel}>Einnahme</Text>
        <Text style={styles.heroAmount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.heroSub}>{item.client}</Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Row label="Kategorie" value={item.category} colors={colors} />
        <Row label="Datum" value={formatDate(item.date)} colors={colors} />
        <Row
          label="Status"
          value={item.status === "paid" ? "Bezahlt" : "Offen"}
          colors={colors}
        />
      </View>

      <Pressable
        onPress={togglePaid}
        style={({ pressed }) => [
          styles.cta,
          {
            backgroundColor: colors.primary,
            borderRadius: colors.radius,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Feather
          name={item.status === "paid" ? "clock" : "check-circle"}
          size={18}
          color={colors.primaryForeground}
        />
        <Text
          style={{
            color: colors.primaryForeground,
            fontFamily: "Inter_600SemiBold",
            fontSize: 15,
          }}
        >
          {item.status === "paid" ? "Auf offen setzen" : "Als bezahlt markieren"}
        </Text>
      </Pressable>

      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [
          styles.cta,
          {
            backgroundColor: colors.card,
            borderColor: colors.critical,
            borderWidth: 1,
            borderRadius: colors.radius,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Feather name="trash-2" size={18} color={colors.critical} />
        <Text
          style={{
            color: colors.critical,
            fontFamily: "Inter_600SemiBold",
            fontSize: 15,
          }}
        >
          Löschen
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>
        {label}
      </Text>
      <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 60,
  },
  hero: {
    padding: 22,
    gap: 6,
  },
  heroLabel: {
    color: "#cfe6ff",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  heroAmount: {
    color: "#ffffff",
    fontSize: 36,
    fontFamily: "Inter_700Bold",
  },
  heroSub: {
    color: "#cfe6ff",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  card: {
    padding: 4,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cta: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
