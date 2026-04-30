import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
  Platform,
} from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useIncomes } from "@/contexts/IncomeContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useTrips } from "@/contexts/TripsContext";
import { formatCurrency, formatDate } from "@/utils/format";
import { Expense, Income, Trip } from "@/types";
import { LEGAL } from "@/constants/legal";

type Tab = "income" | "expense" | "trip";

const TABS: { id: Tab; label: string }[] = [
  { id: "income", label: "Einnahmen" },
  { id: "expense", label: "Ausgaben" },
  { id: "trip", label: "Fahrten" },
];

export default function BookingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { incomes } = useIncomes();
  const { expenses } = useExpenses();
  const { trips } = useTrips();

  const [tab, setTab] = useState<Tab>("income");
  const [filter, setFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const filters = useMemo(() => {
    if (tab === "income")
      return [
        { id: "all", label: "Alle" },
        { id: "paid", label: "Bezahlt" },
        { id: "open", label: "Offen" },
      ];
    if (tab === "expense")
      return [
        { id: "all", label: "Alle" },
        { id: "ok", label: "OK" },
        { id: "check", label: "Prüfen" },
        { id: "critical", label: "Kritisch" },
      ];
    return [{ id: "all", label: "Alle" }];
  }, [tab]);

  const data = useMemo(() => {
    if (tab === "income")
      return filter === "all"
        ? incomes
        : incomes.filter((i) => i.status === filter);
    if (tab === "expense")
      return filter === "all"
        ? expenses
        : expenses.filter((e) => e.flag === filter);
    return trips;
  }, [tab, filter, incomes, expenses, trips]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const onAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (tab === "income") router.push("/income/new");
    else if (tab === "expense") router.push("/expense/new");
    else router.push("/trip/new");
  };

  const onImportPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/trip/import");
  };

  const renderItem = ({ item }: { item: Income | Expense | Trip }) => {
    if (tab === "income") {
      const i = item as Income;
      return (
        <Pressable
          onPress={() => router.push(`/income/${i.id}`)}
          style={({ pressed }) => [
            styles.row,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}>
            <Feather
              name={i.status === "paid" ? "check-circle" : "clock"}
              size={18}
              color={i.status === "paid" ? colors.success : colors.warning}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>
              {i.client}
            </Text>
            <Text
              style={[styles.rowSubtitle, { color: colors.mutedForeground }]}
            >
              {i.category} · {formatDate(i.date)}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.rowAmount, { color: colors.foreground }]}>
              {formatCurrency(i.amount)}
            </Text>
            <Text
              style={[
                styles.rowBadge,
                {
                  color:
                    i.status === "paid" ? colors.success : colors.warning,
                },
              ]}
            >
              {i.status === "paid" ? "bezahlt" : "offen"}
            </Text>
          </View>
        </Pressable>
      );
    }
    if (tab === "expense") {
      const e = item as Expense;
      const flagColor =
        e.flag === "ok"
          ? colors.success
          : e.flag === "check"
            ? colors.warning
            : colors.critical;
      return (
        <Pressable
          onPress={() => router.push(`/expense/${e.id}`)}
          style={({ pressed }) => [
            styles.row,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}>
            <Feather name="shopping-bag" size={18} color={flagColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>
              {e.vendor}
            </Text>
            <Text
              style={[styles.rowSubtitle, { color: colors.mutedForeground }]}
            >
              {e.category} · {formatDate(e.date)}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.rowAmount, { color: colors.foreground }]}>
              {formatCurrency(e.amount)}
            </Text>
            <Text style={[styles.rowBadge, { color: flagColor }]}>
              {e.flag === "ok"
                ? "OK"
                : e.flag === "check"
                  ? "Prüfen"
                  : "Kritisch"}
            </Text>
          </View>
        </Pressable>
      );
    }
    const t = item as Trip;
    return (
      <Pressable
        onPress={() => router.push(`/trip/${t.id}`)}
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}>
          <Feather name="navigation" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowTitle, { color: colors.foreground }]}>
            {t.client}
          </Text>
          <Text
            style={[styles.rowSubtitle, { color: colors.mutedForeground }]}
          >
            {t.from} → {t.to} · {formatDate(t.date)}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.rowAmount, { color: colors.foreground }]}>
            {formatCurrency(
              t.km * (t.roundTrip ? 2 : 1) * LEGAL.kilometerpauschale,
            )}
          </Text>
          <Text style={[styles.rowBadge, { color: colors.mutedForeground }]}>
            {(t.km * (t.roundTrip ? 2 : 1)).toLocaleString("de-DE")} km
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: 8 }]}>
        <View
          style={[
            styles.segmented,
            { backgroundColor: colors.muted, borderRadius: 12 },
          ]}
        >
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => {
                Haptics.selectionAsync();
                setTab(t.id);
                setFilter("all");
              }}
              style={[
                styles.segmentedItem,
                tab === t.id && {
                  backgroundColor: colors.card,
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 1 },
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentedText,
                  {
                    color:
                      tab === t.id
                        ? colors.foreground
                        : colors.mutedForeground,
                  },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {filters.length > 1 ? (
          <View style={styles.filterRow}>
            {filters.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setFilter(f.id);
                }}
                style={[
                  styles.filterChip,
                  {
                    borderColor:
                      filter === f.id ? colors.primary : colors.border,
                    backgroundColor:
                      filter === f.id ? colors.primary : "transparent",
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      filter === f.id
                        ? colors.primaryForeground
                        : colors.foreground,
                    fontSize: 12,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item: any) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: 120 + (Platform.OS === "web" ? 84 : insets.bottom),
          },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        scrollEnabled={data.length > 0}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View
              style={[styles.emptyIcon, { backgroundColor: colors.muted }]}
            >
              <Feather name="inbox" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Noch nichts erfasst
            </Text>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              Tippe auf das +, um deine erste{" "}
              {tab === "income"
                ? "Einnahme"
                : tab === "expense"
                  ? "Ausgabe"
                  : "Fahrt"}{" "}
              zu erfassen.
            </Text>
            <Pressable
              onPress={onAddPress}
              style={({ pressed }) => [
                styles.emptyCta,
                {
                  backgroundColor: colors.primary,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Jetzt erfassen
              </Text>
            </Pressable>
          </View>
        }
      />

      {/* Import button — only visible on Fahrten tab */}
      {tab === "trip" && (
        <Pressable
          onPress={onImportPress}
          style={({ pressed }) => [
            styles.fab,
            {
              backgroundColor: colors.card,
              borderWidth: 1.5,
              borderColor: colors.primary,
              bottom: (Platform.OS === "web" ? 168 : insets.bottom + 158),
              right: 20,
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <Feather name="upload" size={22} color={colors.primary} />
        </Pressable>
      )}

      <Pressable
        onPress={onAddPress}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: (Platform.OS === "web" ? 100 : insets.bottom + 90),
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Feather name="plus" size={26} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 12,
  },
  segmented: {
    flexDirection: "row",
    padding: 4,
  },
  segmentedItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  segmentedText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
    borderWidth: 1,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Inter_500Medium",
  },
  rowAmount: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  rowBadge: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
  empty: {
    alignItems: "center",
    gap: 12,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
  },
  emptyCta: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0066B3",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
});
