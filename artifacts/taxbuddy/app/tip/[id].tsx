import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useColors } from "@/hooks/useColors";
import { TIPS } from "@/data/tips";

export default function TipDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tip = TIPS.find((t) => t.id === id);

  if (!tip) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text style={{ color: colors.mutedForeground }}>
          Tipp nicht gefunden.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.hero,
          {
            backgroundColor: colors.primary,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={styles.heroParagraph}>{tip.paragraph}</Text>
        <Text style={styles.heroTitle}>{tip.title}</Text>
        <Text style={styles.heroSummary}>{tip.summary}</Text>
      </View>

      <Section title="Was bedeutet das?" body={tip.meaning} colors={colors} />
      <Section title="Rechenbeispiel" body={tip.example} colors={colors} />
      <Section title="Was beachten?" body={tip.attention} colors={colors} />
      <Section title="FA-Risiken" body={tip.risks} colors={colors} />
      <Section title="Grauzonen" body={tip.grayArea} colors={colors} />
      <Section
        title="Rechtliche Grundlage"
        body={tip.legalBasis}
        colors={colors}
      />

      <Text style={[styles.footnote, { color: colors.mutedForeground }]}>
        Allgemeine Information ohne Gewähr – ersetzt keine individuelle
        steuerliche Beratung.
      </Text>
    </ScrollView>
  );
}

function Section({
  title,
  body,
  colors,
}: {
  title: string;
  body: string;
  colors: any;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.sectionBody, { color: colors.foreground }]}>
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 60,
  },
  hero: {
    padding: 22,
    gap: 8,
  },
  heroParagraph: {
    color: "#cfe6ff",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  heroSummary: {
    color: "#cfe6ff",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_500Medium",
  },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
  sectionCard: {
    padding: 16,
    borderWidth: 1,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Inter_500Medium",
  },
  footnote: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Inter_500Medium",
    marginTop: 8,
    paddingHorizontal: 4,
  },
});
