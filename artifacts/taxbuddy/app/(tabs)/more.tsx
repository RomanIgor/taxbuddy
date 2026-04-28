import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { branchLabel } from "@/utils/branches";

type Item = {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  href: string;
};

const ITEMS: Item[] = [
  {
    key: "ai",
    label: "KI-Steuerassistent",
    description: "Stelle Fragen zu deinen Steuern – auf Deutsch.",
    icon: "message-circle",
    href: "/ai",
  },
  {
    key: "invoice-check",
    label: "Rechnungs-Check",
    description: "Beleg fotografieren und nach § 14 UStG prüfen.",
    icon: "camera",
    href: "/invoice-check",
  },
  {
    key: "simulation",
    label: "Simulation",
    description: "Was-wäre-wenn-Slider für deinen Umsatz.",
    icon: "sliders",
    href: "/simulation",
  },
  {
    key: "forecast",
    label: "Jahresprognose",
    description: "Hochrechnung mit Empfehlung zum Status.",
    icon: "trending-up",
    href: "/forecast",
  },
  {
    key: "export",
    label: "Export für Steuerberater",
    description: "DATEV CSV, Excel oder druckfertiger Bericht.",
    icon: "share",
    href: "/export",
  },
  {
    key: "profile",
    label: "Profil & Einstellungen",
    description: "Name, Branche, Umsatzziel, KI-API-Key.",
    icon: "settings",
    href: "/profile",
  },
];

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: 120 + (Platform.OS === "web" ? 84 : insets.bottom),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => router.push("/profile")}
        style={({ pressed }) => [
          styles.profileCard,
          {
            backgroundColor: colors.primary,
            borderRadius: colors.radius,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(profile?.name ?? "?").slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{profile?.name ?? "TAXbuddy"}</Text>
          <Text style={styles.profileMeta}>
            {profile ? branchLabel(profile.branch) : "Profil einrichten"}
          </Text>
        </View>
        <Feather name="chevron-right" size={22} color="#cfe6ff" />
      </Pressable>

      <View style={styles.list}>
        {ITEMS.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(item.href as never);
            }}
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
            <View
              style={[styles.rowIcon, { backgroundColor: colors.muted }]}
            >
              <Feather name={item.icon} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]}>
                {item.label}
              </Text>
              <Text
                style={[
                  styles.rowDescription,
                  { color: colors.mutedForeground },
                ]}
              >
                {item.description}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color={colors.mutedForeground}
            />
          </Pressable>
        ))}
      </View>

      <Text style={[styles.footnote, { color: colors.mutedForeground }]}>
        TAXbuddy ist KEIN Steuerberater. Alle Hinweise basieren auf öffentlich
        zugänglichen Gesetzen (§ 19 UStG, § 4 EStG, § 147 AO u. a.) ohne Gewähr
        und ersetzen nicht die Beratung durch einen zugelassenen Steuerberater.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 18,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  profileName: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  profileMeta: {
    color: "#cfe6ff",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
  list: {
    gap: 10,
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
  rowDescription: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
  footnote: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 4,
  },
});
