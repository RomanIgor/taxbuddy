import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { useExports } from "@/contexts/ExportsContext";
import { useIncomes } from "@/contexts/IncomeContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useTrips } from "@/contexts/TripsContext";
import { formatCurrency, formatDate } from "@/utils/format";

const FORMATS = [
  { id: "datev", label: "DATEV CSV" },
  { id: "excel", label: "Excel CSV" },
  { id: "pdf", label: "HTML / PDF-Bericht" },
];

function makeProtocolId() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `EXP-${n}`;
}

export default function ExportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { exports, addExport } = useExports();
  const { incomes, ytdRevenue } = useIncomes();
  const { expenses } = useExpenses();
  const { trips } = useTrips();

  const [recipient, setRecipient] = useState("Steuerberater");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<string[]>(["datev"]);
  const [protocolId, setProtocolId] = useState<string | null>(null);

  const toggleFormat = (id: string) => {
    Haptics.selectionAsync();
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  };

  const handleExport = async () => {
    if (selected.length === 0) return;
    const newId = makeProtocolId();
    await addExport({
      protocolId: newId,
      recipient,
      email: email || undefined,
      periodFrom: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      periodTo: new Date().toISOString(),
      formats: selected,
      notes: notes || undefined,
      stats: {
        incomes: incomes.length,
        expenses: expenses.length,
        trips: trips.length,
        revenue: ytdRevenue,
      },
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setProtocolId(newId);
  };

  if (protocolId) {
    return (
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.successCard,
            {
              backgroundColor: colors.success + "18",
              borderColor: colors.success,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View
            style={[styles.successIcon, { backgroundColor: colors.success }]}
          >
            <Feather name="check" size={28} color="#ffffff" />
          </View>
          <Text
            style={{
              color: colors.foreground,
              fontFamily: "Inter_700Bold",
              fontSize: 22,
              textAlign: "center",
            }}
          >
            Export erstellt
          </Text>
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: "Inter_500Medium",
              fontSize: 14,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Dein Protokoll{" "}
            <Text
              style={{ color: colors.foreground, fontFamily: "Inter_700Bold" }}
            >
              {protocolId}
            </Text>{" "}
            ist bereit. Sende den Link an deinen Steuerberater oder lade die
            Datei herunter.
          </Text>
          <Pressable
            onPress={() => setProtocolId(null)}
            style={({ pressed }) => [
              styles.successCta,
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
              }}
            >
              Neuen Export starten
            </Text>
          </Pressable>
        </View>

        {exports.length > 0 ? (
          <>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              Verlauf
            </Text>
            {exports.map((e) => (
              <View
                key={e.id}
                style={[
                  styles.historyRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.foreground,
                      fontFamily: "Inter_700Bold",
                      fontSize: 14,
                    }}
                  >
                    {e.protocolId}
                  </Text>
                  <Text
                    style={{
                      color: colors.mutedForeground,
                      fontFamily: "Inter_500Medium",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {e.recipient} · {formatDate(e.createdAt)}
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.mutedForeground,
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                  }}
                >
                  {e.formats.length} Format(e)
                </Text>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={styles.content}
        bottomOffset={120}
      >
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Stat label="Umsatz" value={formatCurrency(ytdRevenue)} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Stat
            label="Einnahmen"
            value={`${incomes.length}`}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Stat
            label="Ausgaben"
            value={`${expenses.length}`}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Stat label="Fahrten" value={`${trips.length}`} colors={colors} />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Formate
          </Text>
          <View style={{ gap: 8 }}>
            {FORMATS.map((f) => {
              const isSelected = selected.includes(f.id);
              return (
                <Pressable
                  key={f.id}
                  onPress={() => toggleFormat(f.id)}
                  style={({ pressed }) => [
                    styles.formatRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderRadius: colors.radius,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : "transparent",
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    {isSelected ? (
                      <Feather
                        name="check"
                        size={14}
                        color={colors.primaryForeground}
                      />
                    ) : null}
                  </View>
                  <Text
                    style={{
                      color: colors.foreground,
                      fontFamily: "Inter_600SemiBold",
                    }}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Empfänger
          </Text>
          <TextInput
            value={recipient}
            onChangeText={setRecipient}
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
            E-Mail (optional)
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="berater@kanzlei.de"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
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
            Notiz (optional)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="z. B. Quartal 4 vorbereitet"
            placeholderTextColor={colors.mutedForeground}
            multiline
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
                minHeight: 80,
                paddingTop: 12,
              },
            ]}
          />
        </View>

        {exports.length > 0 ? (
          <View>
            <Text
              style={[styles.sectionLabel, { color: colors.mutedForeground }]}
            >
              Bisherige Exporte
            </Text>
            {exports.slice(0, 3).map((e) => (
              <View
                key={e.id}
                style={[
                  styles.historyRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.foreground,
                      fontFamily: "Inter_700Bold",
                      fontSize: 14,
                    }}
                  >
                    {e.protocolId}
                  </Text>
                  <Text
                    style={{
                      color: colors.mutedForeground,
                      fontFamily: "Inter_500Medium",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {e.recipient} · {formatDate(e.createdAt)}
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.mutedForeground,
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                  }}
                >
                  {e.formats.length} Format(e)
                </Text>
              </View>
            ))}
          </View>
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
          onPress={handleExport}
          disabled={selected.length === 0}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor:
                selected.length === 0 ? colors.muted : colors.primary,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text
            style={{
              color:
                selected.length === 0
                  ? colors.mutedForeground
                  : colors.primaryForeground,
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
            }}
          >
            Exportieren
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text
        style={{
          color: colors.mutedForeground,
          fontSize: 11,
          fontFamily: "Inter_500Medium",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: colors.foreground,
          fontSize: 14,
          fontFamily: "Inter_700Bold",
          marginTop: 2,
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
    paddingBottom: 140,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
  },
  divider: {
    width: 1,
    height: 28,
  },
  field: { gap: 8 },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  formatRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
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
  successCard: {
    padding: 24,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  successCta: {
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
});
