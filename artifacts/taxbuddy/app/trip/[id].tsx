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
import { useTrips } from "@/contexts/TripsContext";
import { formatCurrency, formatDate } from "@/utils/format";
import { LEGAL } from "@/constants/legal";

export default function TripDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, removeTrip } = useTrips();
  const item = trips.find((t) => t.id === id);

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
          Fahrt nicht gefunden.
        </Text>
      </View>
    );
  }

  const totalKm = item.km * (item.roundTrip ? 2 : 1);
  const pauschale = totalKm * LEGAL.kilometerpauschale;

  const handleDelete = () => {
    const doDelete = async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await removeTrip(item.id);
      router.back();
    };
    if (Platform.OS === "web") {
      doDelete();
      return;
    }
    Alert.alert("Löschen?", "Diese Fahrt wirklich löschen?", [
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
          { backgroundColor: colors.primary, borderRadius: colors.radius },
        ]}
      >
        <Text style={styles.heroLabel}>Pauschale</Text>
        <Text style={styles.heroAmount}>{formatCurrency(pauschale)}</Text>
        <Text style={styles.heroSub}>
          {totalKm.toLocaleString("de-DE")} km · 0,30 €/km
        </Text>
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
        <Row label="Datum"         value={formatDate(item.date)}                        colors={colors} />
        {item.time ? <Row label="Uhrzeit" value={item.time} colors={colors} /> : null}
        <Row label="Kunde"         value={item.client}                                  colors={colors} />
        <Row label="Zweck"         value={item.purpose}                                 colors={colors} />
        <Row label="Startadresse"  value={item.from || "—"}                             colors={colors} />
        <Row label="Zieladresse"   value={item.to  || "—"}                             colors={colors} />
        <Row
          label="Art"
          value={item.roundTrip ? "Hin- und Rückfahrt" : "Einfache Fahrt"}
          colors={colors}
        />
      </View>

      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          router.push(`/trip/new?editId=${item.id}`);
        }}
        style={({ pressed }) => [
          styles.cta,
          {
            backgroundColor: "#0066B3",
            borderRadius: colors.radius,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Feather name="edit-2" size={18} color="#ffffff" />
        <Text style={{ color: "#ffffff", fontFamily: "Inter_600SemiBold", fontSize: 15 }}>
          Bearbeiten
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
        <Text style={{ color: colors.critical, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>
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
    gap: 16,
    paddingBottom: 60,
  },
  hero: {
    padding: 22,
    gap: 4,
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
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  card: {
    padding: 4,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  cta: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
