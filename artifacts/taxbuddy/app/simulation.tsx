import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { useIncomes } from "@/contexts/IncomeContext";
import { LEGAL } from "@/constants/legal";
import { formatCurrency } from "@/utils/format";

const STEPS = [0, 500, 1000, 2500, 5000, 7500, 10000, 15000, 20000];

function statusFor(percent: number, colors: any) {
  if (percent < 60)
    return {
      label: "Sicher unter der Grenze",
      tone: colors.success,
      hint: "Du bewegst dich klar im Kleinunternehmer-Bereich (§ 19 UStG).",
    };
  if (percent < 80)
    return {
      label: "Im Auge behalten",
      tone: colors.warning,
      hint: "Plane konservativ – die 25.000-€-Grenze rückt näher.",
    };
  if (percent < 100)
    return {
      label: "Achtung – nahe an der Grenze",
      tone: colors.warning,
      hint: "Bei Überschreitung wird im Folgejahr USt-pflichtig.",
    };
  return {
    label: "Grenze überschritten",
    tone: colors.critical,
    hint: "Wechsel in die Regelbesteuerung im Folgejahr planen.",
  };
}

export default function SimulationScreen() {
  const colors = useColors();
  const { ytdRevenue } = useIncomes();
  const [extra, setExtra] = useState(2500);

  const totalProjected = ytdRevenue + extra;
  const percent = (totalProjected / LEGAL.kleinunternehmerVorjahr) * 100;
  const status = useMemo(() => statusFor(percent, colors), [percent, colors]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.intro, { color: colors.mutedForeground }]}>
        Was passiert, wenn du noch zusätzliche Aufträge dieses Jahr
        annimmst? Hier kannst du Beträge simulieren – live mit Statusampel.
      </Text>

      <View
        style={[
          styles.heroCard,
          { backgroundColor: colors.primary, borderRadius: colors.radius },
        ]}
      >
        <Text style={styles.heroLabel}>Neuer Jahresumsatz</Text>
        <Text style={styles.heroAmount}>{formatCurrency(totalProjected)}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, percent)}%`,
                backgroundColor: status.tone,
              },
            ]}
          />
        </View>
        <Text style={styles.heroSub}>
          {percent.toFixed(0).replace(".", ",")} % von 25.000 €
        </Text>
      </View>

      <View
        style={[
          styles.statusBox,
          {
            backgroundColor: colors.card,
            borderColor: status.tone,
            borderRadius: colors.radius,
          },
        ]}
      >
        <View
          style={[styles.statusDot, { backgroundColor: status.tone }]}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: status.tone, fontFamily: "Inter_700Bold", fontSize: 15 }}>
            {status.label}
          </Text>
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: "Inter_500Medium",
              fontSize: 13,
              marginTop: 2,
            }}
          >
            {status.hint}
          </Text>
        </View>
      </View>

      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
        Zusätzlicher Umsatz: {formatCurrency(extra)}
      </Text>
      <View style={styles.stepsGrid}>
        {STEPS.map((s) => (
          <Pressable
            key={s}
            onPress={() => {
              Haptics.selectionAsync();
              setExtra(s);
            }}
            style={({ pressed }) => [
              styles.stepChip,
              {
                backgroundColor: extra === s ? colors.primary : colors.card,
                borderColor: extra === s ? colors.primary : colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={{
                color:
                  extra === s ? colors.primaryForeground : colors.foreground,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              +{formatCurrency(s)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View
        style={[
          styles.legalCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Feather name="info" size={18} color={colors.primary} />
        <Text
          style={{
            color: colors.foreground,
            fontFamily: "Inter_500Medium",
            fontSize: 13,
            lineHeight: 19,
            flex: 1,
          }}
        >
          Kleinunternehmergrenze (§ 19 UStG): 25.000 € Vorjahr und 100.000 € im
          laufenden Jahr (jeweils netto). Bei Überschreitung der 100.000 €
          endet der Status sofort.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 60,
  },
  intro: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Inter_500Medium",
  },
  heroCard: {
    padding: 22,
    gap: 8,
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
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
  },
  progressFill: { height: "100%" },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderWidth: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
  stepsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stepChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  legalCard: {
    flexDirection: "row",
    padding: 14,
    gap: 10,
    borderWidth: 1,
  },
});
