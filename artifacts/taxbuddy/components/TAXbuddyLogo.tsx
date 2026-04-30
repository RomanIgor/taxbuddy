import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BRAND_NAVY  = "#0F2B4C";
const BRAND_GREEN = "#3DB54A";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  lightMode?: boolean;
};

const SIZES = {
  sm: { tax: 18, buddy: 18, tagline: 9, letterSpacing: -0.3 },
  md: { tax: 26, buddy: 26, tagline: 11, letterSpacing: -0.5 },
  lg: { tax: 36, buddy: 36, tagline: 13, letterSpacing: -0.8 },
  xl: { tax: 48, buddy: 48, tagline: 15, letterSpacing: -1.2 },
};

export function TAXbuddyLogo({ size = "md", showTagline = false, lightMode = false }: Props) {
  const s = SIZES[size];
  const navyColor = lightMode ? "#FFFFFF" : BRAND_NAVY;

  return (
    <View style={styles.container}>
      <View style={styles.wordmark}>
        <Text
          style={[
            styles.tax,
            { fontSize: s.tax, color: navyColor, letterSpacing: s.letterSpacing },
          ]}
        >
          TAX
        </Text>
        <Text
          style={[
            styles.buddy,
            { fontSize: s.buddy, color: BRAND_GREEN, letterSpacing: s.letterSpacing },
          ]}
        >
          buddy
        </Text>
      </View>
      {showTagline && (
        <Text
          style={[
            styles.tagline,
            { fontSize: s.tagline, color: lightMode ? "rgba(255,255,255,0.7)" : "#64748B" },
          ]}
        >
          STEUERN IM BLICK. ZUKUNFT IM GRIFF.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  tax: {
    fontFamily: "Inter_800ExtraBold",
    includeFontPadding: false,
  },
  buddy: {
    fontFamily: "Inter_400Regular",
    includeFontPadding: false,
  },
  tagline: {
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.2,
    textAlign: "center",
  },
});
