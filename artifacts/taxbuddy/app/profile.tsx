import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { BRANCHES, branchLabel } from "@/utils/branches";
import { Branch } from "@/types";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile, resetProfile } = useProfile();

  const [name, setName] = useState(profile?.name ?? "");
  const [revenueGoal, setRevenueGoal] = useState(
    String(profile?.revenueGoal ?? 30000),
  );
  const [branch, setBranch] = useState<Branch>(profile?.branch ?? "sonstiges");
  const [apiKey, setApiKey] = useState(profile?.apiKey ?? "");

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateProfile({
      name: name.trim() || (profile?.name ?? "TAXbuddy"),
      branch,
      revenueGoal: parseInt(revenueGoal) || 30000,
      apiKey: apiKey.trim() || undefined,
      onboardingComplete: true,
    });
    router.back();
  };

  const handleReset = () => {
    const doReset = async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await AsyncStorage.multiRemove([
        "taxbuddy.profile",
        "taxbuddy.incomes",
        "taxbuddy.expenses",
        "taxbuddy.trips",
        "taxbuddy.exports",
      ]);
      await resetProfile();
      router.replace("/onboarding");
    };
    if (Platform.OS === "web") {
      doReset();
      return;
    }
    Alert.alert(
      "App zurücksetzen?",
      "Alle Daten gehen verloren – Profil, Einnahmen, Ausgaben, Fahrten und Exports.",
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Zurücksetzen", style: "destructive", onPress: doReset },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={styles.content}
        bottomOffset={120}
      >
        <View
          style={[
            styles.identityCard,
            {
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(name || profile?.name || "?").slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.identityName}>
              {name || profile?.name || "TAXbuddy"}
            </Text>
            <Text style={styles.identityMeta}>{branchLabel(branch)}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
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
            Branche
          </Text>
          <View style={styles.chipRow}>
            {BRANCHES.map((b) => (
              <Pressable
                key={b.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setBranch(b.id);
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      branch === b.id ? colors.primary : colors.card,
                    borderColor:
                      branch === b.id ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      branch === b.id
                        ? colors.primaryForeground
                        : colors.foreground,
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                  }}
                >
                  {b.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Umsatzziel (€)
          </Text>
          <TextInput
            value={revenueGoal}
            onChangeText={setRevenueGoal}
            keyboardType="number-pad"
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
            Anthropic API-Key (optional)
          </Text>
          <TextInput
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="sk-ant-..."
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
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
          <Text
            style={{
              color: colors.mutedForeground,
              fontSize: 12,
              fontFamily: "Inter_500Medium",
              lineHeight: 17,
            }}
          >
            Wird ausschließlich auf deinem Gerät gespeichert. Aktuell wird die
            KI komplett offline ohne API-Aufrufe betrieben.
          </Text>
        </View>

        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [
            styles.dangerRow,
            {
              backgroundColor: colors.card,
              borderColor: colors.critical,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="trash-2" size={18} color={colors.critical} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.critical,
                fontFamily: "Inter_700Bold",
                fontSize: 15,
              }}
            >
              App zurücksetzen
            </Text>
            <Text
              style={{
                color: colors.mutedForeground,
                fontFamily: "Inter_500Medium",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Löscht alle Daten und startet neu mit Onboarding.
            </Text>
          </View>
        </Pressable>
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
              fontSize: 16,
            }}
          >
            Speichern
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 140,
  },
  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  identityName: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  identityMeta: {
    color: "#cfe6ff",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
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
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderWidth: 1,
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
});
