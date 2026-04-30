import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { Branch } from "@/types";
import { TAXbuddyLogo } from "@/components/TAXbuddyLogo";

const branches: { id: Branch; label: string }[] = [
  { id: "it", label: "IT & Software" },
  { id: "design", label: "Design & Medien" },
  { id: "beratung", label: "Beratung & Consulting" },
  { id: "handel", label: "Handel & E-Commerce" },
  { id: "handwerk", label: "Handwerk" },
  { id: "content", label: "Content Creation" },
  { id: "marketing", label: "Marketing & PR" },
  { id: "gastro", label: "Gastronomie" },
  { id: "gesundheit", label: "Gesundheit & Pflege" },
  { id: "bildung", label: "Bildung & Coaching" },
  { id: "immobilien", label: "Immobilien" },
  { id: "kfz", label: "KFZ & Transport" },
  { id: "event", label: "Event & Unterhaltung" },
  { id: "finanz", label: "Finanzen & Versicherung" },
  { id: "recht", label: "Recht & Steuern" },
  { id: "sonstiges", label: "Sonstiges" },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { updateProfile } = useProfile();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [branch, setBranch] = useState<Branch>("sonstiges");
  const [revenueGoal, setRevenueGoal] = useState("30000");

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await updateProfile({
      name,
      branch,
      revenueGoal: parseInt(revenueGoal) || 30000,
      onboardingComplete: true,
    });
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressBar,
                { backgroundColor: s <= step ? colors.primary : colors.border },
              ]}
            />
          ))}
        </View>
      </View>

      <KeyboardAwareScrollViewCompat
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        bottomOffset={40}
      >
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={[styles.logoHero, { backgroundColor: colors.primary }]}>
              <TAXbuddyLogo size="xl" showTagline lightMode />
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Willkommen!
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Dein smarter Steuerbegleiter für Kleinunternehmer. Wie dürfen wir dich nennen?
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
              ]}
              placeholder="Dein Name"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              In welcher Branche bist du tätig?
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Damit wir dir passende Steuertipps geben können.
            </Text>
            <View style={styles.grid}>
              {branches.map((b) => (
                <Pressable
                  key={b.id}
                  style={[
                    styles.gridItem,
                    {
                      backgroundColor: branch === b.id ? colors.primary : colors.card,
                      borderColor: branch === b.id ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setBranch(b.id);
                  }}
                >
                  <Text
                    style={[
                      styles.gridItemText,
                      { color: branch === b.id ? colors.primaryForeground : colors.foreground },
                    ]}
                  >
                    {b.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Was ist dein Umsatzziel für dieses Jahr?
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Die Kleinunternehmergrenze liegt aktuell bei 25.000 €.
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
              ]}
              placeholder="zz.B. 20000"
              placeholderTextColor={colors.mutedForeground}
              value={revenueGoal}
              onChangeText={setRevenueGoal}
              keyboardType="numeric"
              autoFocus
            />
          </View>
        )}
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary, opacity: (step === 1 && !name) ? 0.5 : 1 }]}
          onPress={handleNext}
          disabled={step === 1 && !name}
        >
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
            {step === 3 ? "Loslegen" : "Weiter"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  stepContainer: {
    gap: 16,
  },
  logoHero: {
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  gridItemText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
