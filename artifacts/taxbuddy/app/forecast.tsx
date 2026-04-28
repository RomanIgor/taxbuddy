import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useIncomes } from "@/contexts/IncomeContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import { LEGAL } from "@/constants/legal";
import { formatCurrency } from "@/utils/format";

export default function ForecastScreen() {
  const colors = useColors();
  const { incomes, ytdRevenue } = useIncomes();
  const { expenses } = useExpenses();

  const monthsElapsed = new Date().getMonth() + 1;
  const projected =
    monthsElapsed > 0 ? (ytdRevenue / monthsElapsed) * 12 : 0;
  const expensesYtd = expenses.reduce((s, e) => s + e.amount, 0);
  const projectedExpenses =
    monthsElapsed > 0 ? (expensesYtd / monthsElapsed) * 12 : 0;
  const projectedProfit = projected - projectedExpenses;
  const percent = (projected / LEGAL.kleinunternehmerVorjahr) * 100;

  const status = useMemo(() => {
    if (percent < 60)
      return {
        tone: colors.success,
        title: "Sicher im grünen Bereich",
        hint: "Aktuelles Tempo bleibt deutlich unter der Kleinunternehmergrenze – Du brauchst nichts zu ändern.",
      };
    if (percent < 80)
      return {
        tone: colors.warning,
        title: "Im Auge behalten",
        hint: "Plane konservativ. Größere Aufträge im Q4 könnten dich über die 25.000 € bringen.",
      };
    if (percent < 100)
      return {
        tone: colors.warning,
        title: "Grenze rückt näher",
        hint: "Erwäge, weitere Rechnungen ins Folgejahr zu verschieben oder den Wechsel zur Regelbesteuerung zu planen.",
      };
    return {
      tone: colors.critical,
      title: "Hochrechnung über der Grenze",
      hint: "Im Folgejahr wirst du USt-pflichtig. Steuerberater einbeziehen, Preisstrategie anpassen.",
    };
  }, [percent, colors]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.intro, { color: colors.mutedForeground }]}>
        Lineare Hochrechnung auf das Jahresende basierend auf deinem
        bisherigen Run-Rate. {monthsElapsed} von 12 Monaten sind erfasst.
      </Text>

      <View
        style={[
          styles.heroCard,
          { backgroundColor: colors.primary, borderRadius: colors.radius },
        ]}
      >
        <Text style={styles.heroLabel}>Prognose Jahresende</Text>
        <Text style={styles.heroAmount}>{formatCurrency(projected)}</Text>
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
          styles.statusCard,
          {
            backgroundColor: colors.card,
            borderColor: status.tone,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Feather
          name={
            status.tone === colors.success
              ? "check-circle"
              : status.tone === colors.warning
                ? "alert-triangle"
                : "alert-circle"
          }
          size={20}
          color={status.tone}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: status.tone, fontFamily: "Inter_700Bold", fontSize: 15 }}>
            {status.title}
          </Text>
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: "Inter_500Medium",
              fontSize: 13,
              marginTop: 2,
              lineHeight: 19,
            }}
          >
            {status.hint}
          </Text>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <Kpi
          label="Bisher Umsatz"
          value={formatCurrency(ytdRevenue)}
          colors={colors}
        />
        <Kpi
          label="Bisher Ausgaben"
          value={formatCurrency(expensesYtd)}
          colors={colors}
        />
      </View>
      <View style={styles.kpiRow}>
        <Kpi
          label="Hochrechnung Ausgaben"
          value={formatCurrency(projectedExpenses)}
          colors={colors}
        />
        <Kpi
          label="Hochrechnung Gewinn"
          value={formatCurrency(projectedProfit)}
          colors={colors}
        />
      </View>

      <View
        style={[
          styles.detailCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text
          style={{
            color: colors.mutedForeground,
            fontSize: 11,
            fontFamily: "Inter_600SemiBold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Datenbasis
        </Text>
        <Text
          style={{
            color: colors.foreground,
            fontFamily: "Inter_500Medium",
            fontSize: 13,
            lineHeight: 19,
            marginTop: 6,
          }}
        >
          {incomes.length} Einnahmen · {expenses.length} Ausgaben · Hochrechnung
          linear über Restmonate. Saisonalität nicht berücksichtigt.
        </Text>
      </View>
    </ScrollView>
  );
}

function Kpi({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.kpi,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <Text
        style={{
          color: colors.mutedForeground,
          fontSize: 12,
          fontFamily: "Inter_500Medium",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: colors.foreground,
          fontSize: 18,
          fontFamily: "Inter_700Bold",
          marginTop: 4,
        }}
      >
        {value}
      </Text>
    </View>
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
  statusCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    gap: 12,
    borderWidth: 1,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
  },
  kpi: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
  },
  detailCard: {
    padding: 14,
    borderWidth: 1,
  },
});
