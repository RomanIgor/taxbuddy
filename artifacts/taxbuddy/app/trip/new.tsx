import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Switch,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { useTrips } from "@/contexts/TripsContext";
import { LEGAL } from "@/constants/legal";
import { formatCurrency } from "@/utils/format";

export default function TripNewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addTrip, updateTrip, trips } = useTrips();
  const { editId } = useLocalSearchParams<{ editId?: string }>();

  const existing = editId ? trips.find((t) => t.id === editId) : undefined;
  const isEdit = !!existing;

  const [client, setClient]     = useState(existing?.client ?? "");
  const [purpose, setPurpose]   = useState(existing?.purpose ?? "");
  const [from, setFrom]         = useState(existing?.from ?? "");
  const [to, setTo]             = useState(existing?.to ?? "");
  const [km, setKm]             = useState(existing ? String(existing.km) : "");
  const [roundTrip, setRoundTrip] = useState(existing?.roundTrip ?? true);
  const [error, setError]       = useState<string | null>(null);

  const kmNum      = parseFloat(km.replace(",", "."));
  const totalKm    = !isNaN(kmNum) ? kmNum * (roundTrip ? 2 : 1) : 0;
  const pauschale  = totalKm * LEGAL.kilometerpauschale;

  const handleSave = async () => {
    if (!client.trim())                  return setError("Bitte einen Kunden eingeben.");
    if (!purpose.trim())                 return setError("Bitte einen Zweck eingeben.");
    if (isNaN(kmNum) || kmNum <= 0)      return setError("Bitte gefahrene Kilometer eingeben.");

    setError(null);

    if (isEdit && existing) {
      await updateTrip(existing.id, {
        client: client.trim(),
        purpose: purpose.trim(),
        from: from.trim(),
        to: to.trim(),
        km: kmNum,
        roundTrip,
        pauschale,
      });
    } else {
      await addTrip({
        date: new Date().toISOString(),
        client: client.trim(),
        purpose: purpose.trim(),
        from: from.trim(),
        to: to.trim(),
        km: kmNum,
        roundTrip,
        pauschale,
      });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[styles.scroll, { paddingTop: 16 }]}
        bottomOffset={140}
      >
        <View
          style={[
            styles.previewCard,
            { backgroundColor: colors.primary, borderRadius: colors.radius },
          ]}
        >
          <Text style={styles.previewLabel}>Pauschale (0,30 €/km)</Text>
          <Text style={styles.previewAmount}>{formatCurrency(pauschale)}</Text>
          <Text style={styles.previewSub}>
            {totalKm.toLocaleString("de-DE")} km{" "}
            {roundTrip ? "(Hin & Rück)" : "(einfach)"}
          </Text>
        </View>

        <Field label="Kunde" colors={colors}>
          <TextInput
            value={client}
            onChangeText={setClient}
            placeholder="z. B. Acme GmbH"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          />
        </Field>

        <Field label="Zweck" colors={colors}>
          <TextInput
            value={purpose}
            onChangeText={setPurpose}
            placeholder="z. B. Projektbesprechung"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          />
        </Field>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field label="Start" colors={colors}>
              <TextInput
                value={from}
                onChangeText={setFrom}
                placeholder="Büro"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              />
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Ziel" colors={colors}>
              <TextInput
                value={to}
                onChangeText={setTo}
                placeholder="Kunde"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              />
            </Field>
          </View>
        </View>

        <Field label="Kilometer (einfach)" colors={colors}>
          <TextInput
            value={km}
            onChangeText={setKm}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, styles.inputBig, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          />
        </Field>

        <View
          style={[
            styles.toggleCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>
              Hin- und Rückfahrt
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 }}>
              Verdoppelt die Kilometer für die Pauschale
            </Text>
          </View>
          <Switch
            value={roundTrip}
            onValueChange={(v) => { Haptics.selectionAsync(); setRoundTrip(v); }}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor="#ffffff"
          />
        </View>

        {error ? (
          <Text style={{ color: colors.critical, fontFamily: "Inter_500Medium" }}>{error}</Text>
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
            { backgroundColor: colors.primary, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_600SemiBold", fontSize: 16 }}>
            {isEdit ? "Änderungen speichern" : "Fahrt speichern"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Field({ label, children, colors }: { label: string; children: React.ReactNode; colors: any }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  scroll:       { paddingHorizontal: 20, gap: 16, paddingBottom: 140 },
  previewCard:  { padding: 18, gap: 4 },
  previewLabel: { color: "#cfe6ff", fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.4 },
  previewAmount:{ color: "#ffffff", fontSize: 32, fontFamily: "Inter_700Bold" },
  previewSub:   { color: "#cfe6ff", fontSize: 13, fontFamily: "Inter_500Medium" },
  field:        { gap: 8 },
  label:        { fontSize: 13, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.4 },
  input:        { height: 50, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, fontSize: 15, fontFamily: "Inter_500Medium" },
  inputBig:     { height: 60, fontSize: 24, fontFamily: "Inter_700Bold" },
  toggleCard:   { flexDirection: "row", alignItems: "center", padding: 14, borderWidth: 1, gap: 12 },
  footer:       { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1 },
  cta:          { height: 54, alignItems: "center", justifyContent: "center" },
});
