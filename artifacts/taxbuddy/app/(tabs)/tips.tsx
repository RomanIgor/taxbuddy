import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { TIPS, tipsForBranch } from "@/data/tips";
import { branchLabel } from "@/utils/branches";

export default function TipsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const [showAll, setShowAll] = useState(false);

  const branchTips = useMemo(
    () => (profile ? tipsForBranch(profile.branch) : TIPS),
    [profile],
  );
  const data = showAll ? TIPS : branchTips;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data}
        keyExtractor={(t) => t.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Steuer-Tipps
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.mutedForeground },
              ]}
            >
              {showAll
                ? "Alle 20+ Tipps"
                : `Passend zu ${profile ? branchLabel(profile.branch) : "dir"}`}
            </Text>

            <View style={styles.toggleRow}>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync();
                  setShowAll(false);
                }}
                style={[
                  styles.toggleChip,
                  {
                    backgroundColor: !showAll ? colors.primary : "transparent",
                    borderColor: !showAll ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: !showAll ? colors.primaryForeground : colors.foreground,
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                  }}
                >
                  Meine Branche
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync();
                  setShowAll(true);
                }}
                style={[
                  styles.toggleChip,
                  {
                    backgroundColor: showAll ? colors.primary : "transparent",
                    borderColor: showAll ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: showAll ? colors.primaryForeground : colors.foreground,
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                  }}
                >
                  Alle
                </Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/tip/${item.id}`)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.paragraphPill,
                  { backgroundColor: colors.muted },
                ]}
              >
                <Text
                  style={[styles.paragraphText, { color: colors.primary }]}
                >
                  {item.paragraph}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.mutedForeground}
              />
            </View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {item.title}
            </Text>
            <Text
              style={[styles.cardSummary, { color: colors.mutedForeground }]}
            >
              {item.summary}
            </Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: 120 + (Platform.OS === "web" ? 84 : insets.bottom),
          },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 14,
    gap: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  toggleChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paragraphPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paragraphText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  cardSummary: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    lineHeight: 19,
  },
});
