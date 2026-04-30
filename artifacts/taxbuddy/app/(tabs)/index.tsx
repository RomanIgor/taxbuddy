import React, { useMemo, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { useIncomes } from "@/contexts/IncomeContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useTrips } from "@/contexts/TripsContext";
import { formatCurrency } from "@/utils/format";
import { LEGAL } from "@/constants/legal";

type QuickAction = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  href: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { key: "income", label: "Einnahme", icon: "trending-up", href: "/income/new" },
  { key: "expense", label: "Ausgabe", icon: "shopping-bag", href: "/expense/new" },
  { key: "trip", label: "Fahrt", icon: "map-pin", href: "/trip/new" },
  { key: "ai", label: "KI fragen", icon: "message-circle", href: "/ai" },
  { key: "invoice", label: "Beleg-Check", icon: "camera", href: "/invoice-check" },
  { key: "simulation", label: "Simulation", icon: "sliders", href: "/simulation" },
  { key: "forecast", label: "Prognose", icon: "trending-up", href: "/forecast" },
  { key: "export", label: "Export", icon: "share", href: "/export" },
];

function statusFor(percent: number) {
  if (percent < 60) return { tone: "success", label: "Sicher im grünen Bereich" };
  if (percent < 80) return { tone: "warning", label: "Im Auge behalten" };
  if (percent < 100) return { tone: "warning", label: "Achtung – Grenze nähert sich" };
  return { tone: "critical", label: "Grenze überschritten" };
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const { incomes, ytdRevenue } = useIncomes();
  const { expenses } = useExpenses();
  const { trips } = useTrips();

  const limit = LEGAL.kleinunternehmerVorjahr;
  const percent = Math.min(100, (ytdRevenue / limit) * 100);
  const status = statusFor(percent);
  const remaining = Math.max(0, limit - ytdRevenue);

  const tripKm = useMemo(
    () =>
      trips.reduce(
        (sum, t) => sum + t.km * (t.roundTrip ? 2 : 1),
        0,
      ),
    [trips],
  );
  const tripPauschale = tripKm * LEGAL.kilometerpauschale;
  const expenseSum = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses],
  );

  const monthsElapsed = new Date().getMonth() + 1;
  const projected = monthsElapsed > 0 ? (ytdRevenue / monthsElapsed) * 12 : 0;
  const forecastStatus = statusFor((projected / limit) * 100);

  const progress = useSharedValue(0);
  const numberValue = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percent / 100, { duration: 900 });
    numberValue.value = withSpring(ytdRevenue, { damping: 15 });
  }, [percent, ytdRevenue, progress, numberValue]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const toneColor = (tone: string) =>
    tone === "success"
      ? colors.success
      : tone === "warning"
        ? colors.warning
        : colors.critical;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: 120 + (Platform.OS === "web" ? 84 : insets.bottom),
          paddingTop: Platform.OS === "web" ? 80 : 8,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.greetingRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.greetingHello, { color: colors.mutedForeground }]}>
            Guten Tag
          </Text>
          <Text style={[styles.greetingName, { color: colors.foreground }]}>
            {profile?.name ?? "TAXbuddy"}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Profil"
          onPress={() => router.push("/profile")}
          style={({ pressed }) => [
            styles.profileButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Feather name="user" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <View
        style={[
          styles.heroCard,
          { backgroundColor: colors.primary, borderRadius: colors.radius },
        ]}
      >
        <View style={styles.heroTopRow}>
          <Text style={[styles.heroLabel, { color: "#cfe6ff" }]}>
            Umsatz {new Date().getFullYear()}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: "rgba(255,255,255,0.18)" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: toneColor(status.tone) },
              ]}
            />
            <Text style={styles.statusLabel}>{status.label}</Text>
          </View>
        </View>

        <Text style={styles.heroAmount}>{formatCurrency(ytdRevenue)}</Text>
        <Text style={[styles.heroSubLabel, { color: "#cfe6ff" }]}>
          von {formatCurrency(limit)} Kleinunternehmergrenze (§ 19 UStG)
        </Text>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              progressStyle,
              { backgroundColor: toneColor(status.tone) },
            ]}
          />
        </View>

        <View style={styles.heroFooter}>
          <View>
            <Text style={[styles.heroMicroLabel, { color: "#cfe6ff" }]}>
              Spielraum
            </Text>
            <Text style={styles.heroMicroValue}>{formatCurrency(remaining)}</Text>
          </View>
          <View>
            <Text style={[styles.heroMicroLabel, { color: "#cfe6ff" }]}>
              Auslastung
            </Text>
            <Text style={styles.heroMicroValue}>
              {percent.toFixed(0).replace(".", ",")} %
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <KpiCard
          label="Prognose Jahresende"
          value={formatCurrency(projected)}
          tone={forecastStatus.tone}
          icon="trending-up"
          onPress={() => router.push("/forecast")}
        />
        <KpiCard
          label="Fahrtenbuch"
          value={formatCurrency(tripPauschale)}
          subtitle={`${tripKm.toLocaleString("de-DE")} km`}
          icon="navigation"
          onPress={() => router.push("/(tabs)/bookings")}
        />
      </View>

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
              Einnahmen
            </Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {incomes.length}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
              Ausgaben
            </Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {formatCurrency(expenseSum)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
              Fahrten
            </Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {trips.length}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        Schnellaktionen
      </Text>

      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((a) => (
          <Pressable
            key={a.key}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(a.href as never);
            }}
            style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View
              style={[
                styles.actionIconWrap,
                { backgroundColor: colors.muted },
              ]}
            >
              <Feather name={a.icon} size={20} color={colors.primary} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>
              {a.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function KpiCard({
  label,
  value,
  subtitle,
  tone,
  icon,
  onPress,
}: {
  label: string;
  value: string;
  subtitle?: string;
  tone?: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  onPress: () => void;
}) {
  const colors = useColors();
  const toneColor =
    tone === "success"
      ? colors.success
      : tone === "warning"
        ? colors.warning
        : tone === "critical"
          ? colors.critical
          : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.kpiCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.kpiHeader}>
        <Feather name={icon} size={16} color={toneColor} />
        <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.kpiValue, { color: colors.foreground }]}>
        {value}
      </Text>
      {subtitle ? (
        <Text style={[styles.kpiSubtitle, { color: colors.mutedForeground }]}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 18,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
  },
  greetingHello: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.2,
  },
  greetingName: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    padding: 22,
    gap: 14,
    shadowColor: "#0066B3",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    color: "#ffffff",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  heroAmount: {
    color: "#ffffff",
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  heroSubLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.18)",
    marginTop: 4,
  },
  progressFill: {
    height: "100%",
  },
  heroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  heroMicroLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  heroMicroValue: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginTop: 2,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  kpiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  kpiLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  kpiValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  kpiSubtitle: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  summaryCard: {
    padding: 16,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  divider: {
    width: 1,
    height: 32,
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginTop: 8,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "47.5%",
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    flexShrink: 1,
  },
});
