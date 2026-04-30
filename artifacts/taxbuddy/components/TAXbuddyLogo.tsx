import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const BRAND_NAVY  = "#0F2B4C";
const BRAND_GREEN = "#3DB54A";

const raccoonCircle = require("@/assets/images/raccoon_logo_circle.jpeg");
const raccoonThumbs = require("@/assets/images/raccoon_suit_thumbs.jpeg");
const raccoonBadge  = require("@/assets/images/raccoon_suit_badge.jpeg");

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  lightMode?: boolean;
  showMascot?: boolean;
};

const SIZES = {
  sm: { tax: 18, buddy: 18, tagline: 9,  letterSpacing: -0.3, mascot: 24 },
  md: { tax: 26, buddy: 26, tagline: 11, letterSpacing: -0.5, mascot: 34 },
  lg: { tax: 36, buddy: 36, tagline: 13, letterSpacing: -0.8, mascot: 48 },
  xl: { tax: 48, buddy: 48, tagline: 15, letterSpacing: -1.2, mascot: 64 },
};

function RaccoonHead({ diameter }: { diameter: number }) {
  return (
    <View style={{ width: diameter, height: diameter, overflow: "hidden", borderRadius: diameter / 2, backgroundColor: "#fff" }}>
      <Image source={raccoonCircle} style={{ width: diameter, height: diameter }} resizeMode="cover" />
    </View>
  );
}

export function TAXbuddyLogo({ size = "md", showTagline = false, lightMode = false, showMascot = false }: Props) {
  const s = SIZES[size];
  const navyColor = lightMode ? "#FFFFFF" : BRAND_NAVY;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {showMascot && (
          <View style={{ marginRight: 8 }}>
            <RaccoonHead diameter={s.mascot} />
          </View>
        )}
        <View style={styles.wordmark}>
          <Text numberOfLines={1} style={[styles.tax, { fontSize: s.tax, color: navyColor, letterSpacing: s.letterSpacing }]}>
            TAX
          </Text>
          <Text numberOfLines={1} style={[styles.buddy, { fontSize: s.buddy, color: BRAND_GREEN, letterSpacing: s.letterSpacing, paddingRight: Math.abs(s.letterSpacing) + 2 }]}>
            buddy
          </Text>
        </View>
      </View>
      {showTagline && (
        <Text style={[styles.tagline, { fontSize: s.tagline, color: lightMode ? "rgba(255,255,255,0.7)" : "#64748B" }]}>
          CLEVER. ENTSPANNT. STEUERN IM GRIFF.
        </Text>
      )}
    </View>
  );
}

export function RaccoonHero({ width, height }: { width: number; height: number }) {
  return <Image source={raccoonThumbs} style={{ width, height }} resizeMode="contain" />;
}

export function RaccoonBadgeFull({ width, height }: { width: number; height: number }) {
  return <Image source={raccoonBadge} style={{ width, height }} resizeMode="contain" />;
}

export function RaccoonCircle({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", backgroundColor: "#fff" }}>
      <Image source={raccoonCircle} style={{ width: size, height: size }} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 4 },
  row:       { flexDirection: "row", alignItems: "center" },
  wordmark:  { flexDirection: "row", alignItems: "baseline" },
  tax:       { fontFamily: "Inter_800ExtraBold", includeFontPadding: false },
  buddy:     { fontFamily: "Inter_400Regular", includeFontPadding: false },
  tagline:   { fontFamily: "Inter_500Medium", letterSpacing: 1.2, textAlign: "center" },
});
