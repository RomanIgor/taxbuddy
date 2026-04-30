import React, { useMemo, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { useIncomes } from "@/contexts/IncomeContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useTrips } from "@/contexts/TripsContext";
import { formatCurrency } from "@/utils/format";
import { LEGAL } from "@/constants/legal";
import {
  IconArrowUp, IconArrowDown, IconCar, IconZap,
  IconFileText, IconSliders, IconTrendingUp, IconUpload,
  IconUser, IconInfo,
} from "@/components/DashboardIcons";

const { width: W } = Dimensions.get("window");
const PROGRESS_TRACK_W = W - 32 - 28; // 16px content padding × 2 + 14px card padding × 2

const SUCCESS_COLOR  = "#16A34A";
const SUCCESS_BG     = "#DCFCE7";
const WARNING_COLOR  = "#D97706";
const WARNING_BG     = "#FEF3C7";
const PRIMARY_BG     = "#DBEAFE";
const PURPLE_COLOR   = "#7C3AED";
const PURPLE_BG      = "#EDE9FE";
const TEAL_COLOR     = "#0D9488";
const TEAL_BG        = "#CCFBF1";
const INDIGO_COLOR   = "#4F46E5";
const INDIGO_BG      = "#E0E7FF";
const SKY_COLOR      = "#0284C7";
const SKY_BG         = "#E0F2FE";

type QuickAction = {
  key: string;
  label: string;
  IconComponent: React.FC<{ size?: number; color?: string }>;
  iconColor: string;
  iconBg: string;
  href: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { key: "income",     label: "Einnahme",   IconComponent: IconArrowUp,    iconColor: SUCCESS_COLOR, iconBg: SUCCESS_BG,  href: "/income/new" },
  { key: "expense",    label: "Ausgabe",    IconComponent: IconArrowDown,  iconColor: WARNING_COLOR, iconBg: WARNING_BG,  href: "/expense/new" },
  { key: "trip",       label: "Fahrt",      IconComponent: IconCar,        iconColor: "#0066B3",     iconBg: PRIMARY_BG,  href: "/trip/new" },
  { key: "ai",         label: "KI",         IconComponent: IconZap,        iconColor: PURPLE_COLOR,  iconBg: PURPLE_BG,   href: "/ai" },
  { key: "invoice",    label: "Beleg",      IconComponent: IconFileText,   iconColor: TEAL_COLOR,    iconBg: TEAL_BG,     href: "/invoice-check" },
  { key: "simulation", label: "Simulation", IconComponent: IconSliders,    iconColor: INDIGO_COLOR,  iconBg: INDIGO_BG,   href: "/simulation" },
  { key: "forecast",   label: "Prognose",   IconComponent: IconTrendingUp, iconColor: "#0066B3",     iconBg: PRIMARY_BG,  href: "/forecast" },
  { key: "export",     label: "Export",     IconComponent: IconUpload,     iconColor: SKY_COLOR,     iconBg: SKY_BG,      href: "/export" },
];

function statusFor(percent: number) {
  if (percent < 60) return { tone: "success", label: `Sicher — ${percent.toFixed(0)} %` };
  if (percent < 80) return { tone: "warning", label: `Im Auge behalten — ${percent.toFixed(0)} %` };
  if (percent < 100) return { tone: "warning", label: `Achtung — ${percent.toFixed(0)} %` };
  return { tone: "critical", label: `Grenze überschritten` };
}

export default function DashboardScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { profile } = useProfile();
  const { incomes, ytdRevenue } = useIncomes();
  const { expenses } = useExpenses();
  const { trips } = useTrips();

  const limit     = LEGAL.kleinunternehmerVorjahr;
  const percent   = Math.min(100, (ytdRevenue / limit) * 100);
  const status    = statusFor(percent);
  const remaining = Math.max(0, limit - ytdRevenue);

  const tripKm = useMemo(
    () => trips.reduce((sum, t) => sum + t.km * (t.roundTrip ? 2 : 1), 0),
    [trips],
  );
  const tripPauschale = tripKm * LEGAL.kilometerpauschale;
  const expenseSum    = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const monthsElapsed = new Date().getMonth() + 1;
  const projected     = monthsElapsed > 0 ? (ytdRevenue / monthsElapsed) * 12 : 0;

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(percent / 100, { duration: 900 });
  }, [percent, progress]);
  // Simulate transformOrigin:"left" scaleX by pairing translateX + scaleX
  const progressStyle = useAnimatedStyle(() => {
    const scale = progress.value;
    return {
      transform: [
        { translateX: -(PROGRESS_TRACK_W / 2) * (1 - scale) },
        { scaleX: scale },
      ],
    };
  });

  const toneColor = (tone: string) =>
    tone === "success" ? SUCCESS_COLOR : tone === "warning" ? WARNING_COLOR : colors.critical;

  const statusBgColor = (tone: string) =>
    tone === "success" ? SUCCESS_BG : tone === "warning" ? WARNING_BG : "#FEE2E2";

  const statusTextColor = (tone: string) =>
    tone === "success" ? "#15803D" : tone === "warning" ? "#92400E" : "#991B1B";

  const isWeb = Platform.OS === "web";

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: 120 + (isWeb ? 84 : insets.bottom),
          paddingTop: isWeb ? 80 : 8,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Greeting row ─────────────────────────────────── */}
      <View style={styles.greetingRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.greetingHello, { color: colors.mutedForeground }]}>Guten Tag</Text>
          <Text style={[styles.greetingName, { color: colors.foreground }]}>
            {profile?.name ?? "TAXbuddy"}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Profil"
          onPress={() => router.push("/profile")}
          style={({ pressed }) => [
            styles.headerBtn,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <IconUser size={19} color={colors.foreground} />
        </Pressable>
      </View>

      {/* ── §19 Progress banner ───────────────────────────── */}
      <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.progressCardTop}>
          <Text style={[styles.progressCardLabel, { color: colors.mutedForeground }]}>
            § 19 UStG Jahresgrenze
          </Text>
          <View style={[styles.statusPill, { backgroundColor: statusBgColor(status.tone) }]}>
            <Text style={[styles.statusPillText, { color: statusTextColor(status.tone) }]}>
              {status.label}
            </Text>
          </View>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <Animated.View
            style={[styles.progressFill, progressStyle, { backgroundColor: toneColor(status.tone) }]}
          />
        </View>
        <View style={styles.progressCardBottom}>
          <Text style={[styles.progressNote, { color: colors.mutedForeground }]}>
            {formatCurrency(ytdRevenue)} verwendet
          </Text>
          <Text style={[styles.progressNote, { color: toneColor(status.tone), fontFamily: "Inter_600SemiBold" }]}>
            {formatCurrency(remaining)} frei
          </Text>
        </View>
      </View>

      {/* ── Hero balance card ─────────────────────────────── */}
      <View style={[styles.heroCard, { borderRadius: colors.radius }]}>
        {/* decorative orbs */}
        <View style={styles.heroOrb1} />
        <View style={styles.heroOrb2} />

        <Text style={styles.heroLabel}>JAHRESUMSATZ {new Date().getFullYear()}</Text>
        <Text style={styles.heroAmount}>{formatCurrency(ytdRevenue)}</Text>
        <View style={styles.heroDivider} />
        <View style={styles.heroFooter}>
          <View>
            <Text style={styles.heroFooterLabel}>Prognose Jahresende</Text>
            <Text style={[styles.heroFooterValue, { color: WARNING_COLOR }]}>
              {formatCurrency(projected)}
            </Text>
          </View>
          <View>
            <Text style={styles.heroFooterLabel}>Absetzbare Ausgaben</Text>
            <Text style={[styles.heroFooterValue, { color: "rgba(207,230,255,0.85)" }]}>
              {formatCurrency(expenseSum)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Stat cards ───────────────────────────────────── */}
      <View style={styles.statRow}>
        <Pressable
          onPress={() => router.push("/(tabs)/bookings")}
          style={({ pressed }) => [
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <IconCar size={20} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.foreground }]}>{formatCurrency(tripPauschale)}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Fahrtkosten</Text>
          <Text style={[styles.statSub, { color: colors.mutedForeground }]}>
            {tripKm.toLocaleString("de-DE")} km · {LEGAL.kilometerpauschale.toFixed(2).replace(".", ",")} €/km
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/bookings")}
          style={({ pressed }) => [
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <IconTrendingUp size={20} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.foreground }]}>{incomes.length} Buchungen</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Einnahmen</Text>
          <Text style={[styles.statSub, { color: colors.mutedForeground }]}>
            {formatCurrency(ytdRevenue)} gesamt
          </Text>
        </Pressable>
      </View>

      {/* ── Quick actions ────────────────────────────────── */}
      <View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Schnellaktionen</Text>
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
                  opacity: pressed ? 0.75 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <View style={[styles.actionChip, { backgroundColor: a.iconBg }]}>
                <a.IconComponent size={20} color={a.iconColor} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Tax tip ──────────────────────────────────────── */}
      <View style={[styles.tipCard, { borderColor: "#BFDBFE" }]}>
        <View style={[styles.tipIcon, { backgroundColor: colors.primary }]}>
          <IconInfo size={16} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.tipTitle, { color: colors.primary }]}>Steuertipp des Tages</Text>
          <Text style={[styles.tipBody, { color: "#1E40AF" }]}>
            Homeoffice-Pauschale 2025: bis 1.260 € absetzbar — 6 € pro Heimarbeitstag.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 14,
  },

  /* greeting */
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
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /* progress banner */
  progressCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  progressCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressCardLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "100%",
    borderRadius: 4,
  },
  progressCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressNote: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },

  /* hero card */
  heroCard: {
    padding: 22,
    backgroundColor: "#0066B3",
    overflow: "hidden",
    shadowColor: "#0066B3",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroOrb1: {
    position: "absolute",
    top: -44,
    right: -44,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  heroOrb2: {
    position: "absolute",
    bottom: -32,
    left: -24,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  heroLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(207,230,255,0.85)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  heroAmount: {
    fontSize: 40,
    fontFamily: "Inter_800ExtraBold",
    color: "#ffffff",
    letterSpacing: -1,
    marginTop: 8,
  },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 14,
  },
  heroFooter: {
    flexDirection: "row",
    gap: 24,
  },
  heroFooterLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(207,230,255,0.7)",
  },
  heroFooterValue: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },

  /* stat cards */
  statRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
  statSub: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },

  /* quick actions */
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionCard: {
    width: "22.5%",
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    alignItems: "center",
    gap: 7,
  },
  actionChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },

  /* tax tip */
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EBF5FF",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipTitle: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  tipBody: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    lineHeight: 16,
  },
});
