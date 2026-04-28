import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useExpenses } from "@/contexts/ExpensesContext";
import { formatCurrency, formatDate } from "@/utils/format";

export default function ExpenseDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { expenses, removeExpense } = useExpenses();
  const item = expenses.find((e) => e.id === id);

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

  const flagColor =
    item.flag === "ok"
      ? colors.success
      : item.flag === "check"
        ? colors.warning
        : colors.critical;

  const flagLabel =
    item.flag === "ok"
      ? "Alles in Ordnung"
      : item.flag === "check"
        ? "Bitte prüfen"
        : "Kritisch";

  const handleDelete = () => {
    const doDelete = async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await removeExpense(item.id);
      router.back();
    };
    if (Platform.OS === "web") {
      doDelete();
      return;
    }
    Alert.alert("Löschen?", "Diese Ausgabe wirklich löschen?", [
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
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <View style={styles.heroTop}>
          <View
            style={[
              styles.flagBadge,
              {
                backgroundColor: flagColor + "22",
                borderColor: flagColor,
              },
            ]}
          >
            <View style={[styles.flagDot, { backgroundColor: flagColor }]} />
            <Text style={[styles.flagText, { color: flagColor }]}>
              {flagLabel}
            </Text>
          </View>
          <Text style={[styles.heroDate, { color: colors.mutedForeground }]}>
            {formatDate(item.date)}
          </Text>
        </View>
        <Text style={[styles.heroAmount, { color: colors.foreground }]}>
          {formatCurrency(item.amount)}
        </Text>
        <Text style={[styles.heroVendor, { color: colors.mutedForeground }]}>
          {item.vendor}
        </Text>
      </View>

      <Section title="Übersicht" colors={colors}>
        <Row label="Anbieter" value={item.vendor} colors={colors} />
        <Row label="Kategorie" value={item.category} colors={colors} />
        {item.description ? (
          <Row label="Beschreibung" value={item.description} colors={colors} />
        ) : null}
      </Section>

      <Section title="Steuerwirkung" colors={colors}>
        <Row
          label="Geschätzter Effekt"
          value={
            item.taxImpact
              ? formatCurrency(item.taxImpact)
              : "—"
          }
          colors={colors}
        />
        <Row
          label="Brutto"
          value={formatCurrency(item.amount)}
          colors={colors}
        />
      </Section>

      <Section title="Paragraph" colors={colors}>
        <Text style={[styles.bodyText, { color: colors.foreground }]}>
          {item.paragraph ?? "Keine Zuordnung."}
        </Text>
      </Section>

      <Section title="Risiko" colors={colors}>
        <View style={styles.flagRow}>
          <View style={[styles.flagDot, { backgroundColor: flagColor }]} />
          <Text style={[styles.bodyText, { color: colors.foreground }]}>
            {flagLabel}
          </Text>
        </View>
      </Section>

      <Section title="Hinweise" colors={colors}>
        <Text style={[styles.bodyText, { color: colors.foreground }]}>
          Beleg sicher aufbewahren (8 Jahre, § 147 AO). Bei Bewirtung den
          Anlass und die Teilnehmer auf der Rückseite notieren.
        </Text>
      </Section>

      <Section title="Beleg" colors={colors}>
        <View style={styles.belegPlaceholder}>
          <Feather name="image" size={28} color={colors.mutedForeground} />
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: "Inter_500Medium",
            }}
          >
            Noch kein Beleg-Foto hinterlegt
          </Text>
        </View>
      </Section>

      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.critical,
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

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        {children}
      </View>
    </View>
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
      <Text
        style={{
          color: colors.mutedForeground,
          fontFamily: "Inter_500Medium",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: colors.foreground,
          fontFamily: "Inter_600SemiBold",
          flexShrink: 1,
          textAlign: "right",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 60,
  },
  hero: {
    padding: 22,
    borderWidth: 1,
    gap: 8,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  flagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  flagText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  heroDate: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  heroAmount: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  heroVendor: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
  sectionCard: {
    borderWidth: 1,
    padding: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
    padding: 14,
  },
  flagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  belegPlaceholder: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  deleteButton: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    marginTop: 4,
  },
});
