import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { Branch } from "@/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const raccoonBadge  = require("@/assets/images/raccoon_suit_badge.jpeg");
const raccoonThumbs = require("@/assets/images/raccoon_suit_thumbs.jpeg");
const raccoonCircle = require("@/assets/images/raccoon_logo_circle.jpeg");

const branches: { id: Branch; label: string }[] = [
  { id: "it",        label: "IT & Software" },
  { id: "design",    label: "Design & Medien" },
  { id: "beratung",  label: "Beratung & Consulting" },
  { id: "handel",    label: "Handel & E-Commerce" },
  { id: "handwerk",  label: "Handwerk" },
  { id: "content",   label: "Content Creation" },
  { id: "marketing", label: "Marketing & PR" },
  { id: "gastro",    label: "Gastronomie" },
  { id: "gesundheit",label: "Gesundheit & Pflege" },
  { id: "bildung",   label: "Bildung & Coaching" },
  { id: "immobilien",label: "Immobilien" },
  { id: "kfz",       label: "KFZ & Transport" },
  { id: "event",     label: "Event & Unterhaltung" },
  { id: "finanz",    label: "Finanzen & Versicherung" },
  { id: "recht",     label: "Recht & Steuern" },
  { id: "sonstiges", label: "Sonstiges" },
];

/* ─── Intro slide data ─── */

const INTRO_SLIDES = [
  {
    image: raccoonBadge,
    imageStyle: { width: SCREEN_WIDTH * 0.72, height: SCREEN_WIDTH * 0.72 },
    bg: "#0F2B4C",
    headline: "Willkommen bei TAXbuddy",
    sub: "Dein smarter Steuer-Buddy fur Kleinunternehmer und Freelancer in Deutschland.",
    badge: null,
  },
  {
    image: raccoonThumbs,
    imageStyle: { width: SCREEN_WIDTH * 0.68, height: SCREEN_WIDTH * 0.76 },
    bg: "#0066B3",
    headline: "Einnahmen & Ausgaben im Blick",
    sub: "Erfasse Buchungen in Sekunden. Behalte Umsatz und Steuerpflicht stets unter Kontrolle — ohne Buchhaltungskenntnisse.",
    badge: null,
  },
  {
    image: raccoonCircle,
    imageStyle: { width: SCREEN_WIDTH * 0.62, height: SCREEN_WIDTH * 0.62, borderRadius: SCREEN_WIDTH * 0.31 },
    bg: "#0F2B4C",
    headline: "Fahrtenbuch & Steuer-Check",
    sub: "Tracke betriebliche Fahrten und hole dir 0,30 EUR pro km zuruck. Erhalte personalisierte Steuertipps und Empfehlungen.",
    badge: null,
  },
  {
    image: raccoonCircle,
    imageStyle: { width: SCREEN_WIDTH * 0.52, height: SCREEN_WIDTH * 0.52, borderRadius: SCREEN_WIDTH * 0.26 },
    bg: "#0F2B4C",
    headline: "In 60 Sekunden eingerichtet",
    sub: "Wir benotigen nur drei kurze Angaben, dann bist du startklar. Clever. Entspannt. Steuern im Griff.",
    badge: "Kostenlos & ohne Anmeldung",
  },
];

/* ─── Component ─── */

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { updateProfile } = useProfile();

  const [step, setStep] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [name, setName] = useState("");
  const [branch, setBranch] = useState<Branch>("sonstiges");
  const [revenueGoal, setRevenueGoal] = useState("30000");

  const scrollRef = useRef<ScrollView>(null);

  const isIntro = step === 0;
  const isLastSlide = slideIndex === INTRO_SLIDES.length - 1;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setSlideIndex(idx);
  };

  const goNextSlide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLastSlide) {
      setStep(1);
    } else {
      const next = slideIndex + 1;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      setSlideIndex(next);
    }
  };

  const handleSetupNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 3) setStep(step + 1);
    else handleComplete();
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

  /* ── Intro carousel ── */
  if (isIntro) {
    const slide = INTRO_SLIDES[slideIndex];
    return (
      <View style={[introStyles.root, { backgroundColor: slide.bg }]}>
        {/* Slides */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          contentContainerStyle={{ alignItems: "flex-end" }}
        >
          {INTRO_SLIDES.map((s, i) => (
            <View key={i} style={[introStyles.slide, { width: SCREEN_WIDTH, backgroundColor: s.bg, paddingTop: insets.top + 40 }]}>
              {/* Image */}
              <View style={introStyles.imageWrap}>
                <Image source={s.image} style={[introStyles.mascot, s.imageStyle]} resizeMode="contain" />
              </View>

              {/* Text */}
              <View style={[introStyles.textCard, { paddingBottom: insets.bottom + 140 }]}>
                {s.badge && (
                  <View style={introStyles.badge}>
                    <Text style={introStyles.badgeText}>{s.badge}</Text>
                  </View>
                )}
                <Text style={introStyles.headline}>{s.headline}</Text>
                <Text style={introStyles.sub}>{s.sub}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={[introStyles.dotsRow, { bottom: insets.bottom + 100 }]}>
          {INTRO_SLIDES.map((_, i) => (
            <View key={i} style={[introStyles.dot, { backgroundColor: i === slideIndex ? "#fff" : "rgba(255,255,255,0.3)", width: i === slideIndex ? 20 : 8 }]} />
          ))}
        </View>

        {/* CTA button */}
        <View style={[introStyles.btnWrap, { paddingBottom: insets.bottom + 28 }]}>
          <Pressable
            onPress={goNextSlide}
            style={({ pressed }) => [introStyles.btn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={introStyles.btnText}>
              {isLastSlide ? "Jetzt einrichten" : "Weiter"}
            </Text>
          </Pressable>
          {!isLastSlide && (
            <Pressable onPress={() => setStep(1)} style={introStyles.skip}>
              <Text style={introStyles.skipText}>Uberspringen</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  /* ── Setup steps (1-3) ── */
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[styles.progressBar, { backgroundColor: s <= step ? colors.primary : colors.border }]}
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
              <View style={styles.heroRow}>
                <View style={styles.heroLeft}>
                  <Text style={styles.heroTitle}>TAX</Text>
                  <Text style={styles.heroBuddy}>buddy</Text>
                  <Text style={styles.heroTagline}>STEUERN IM GRIFF</Text>
                </View>
                <Image source={raccoonThumbs} style={styles.heroImage} resizeMode="contain" />
              </View>
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>Willkommen!</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Dein smarter Steuerbegleiter fur Kleinunternehmer. Wie durfen wir dich nennen?
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
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
            <Text style={[styles.title, { color: colors.foreground }]}>In welcher Branche bist du tatig?</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Damit wir dir passende Steuertipps geben konnen.
            </Text>
            <View style={styles.grid}>
              {branches.map((b) => (
                <Pressable
                  key={b.id}
                  style={[
                    styles.gridItem,
                    { backgroundColor: branch === b.id ? colors.primary : colors.card, borderColor: branch === b.id ? colors.primary : colors.border },
                  ]}
                  onPress={() => { Haptics.selectionAsync(); setBranch(b.id); }}
                >
                  <Text style={[styles.gridItemText, { color: branch === b.id ? colors.primaryForeground : colors.foreground }]}>
                    {b.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: colors.foreground }]}>Was ist dein Umsatzziel fur dieses Jahr?</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Die Kleinunternehmergrenze liegt aktuell bei 25.000 EUR.
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="z. B. 20000"
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
          onPress={handleSetupNext}
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

/* ─── Intro styles ─── */

const introStyles = StyleSheet.create({
  root:      { flex: 1 },
  slide:     { flex: 1, alignItems: "center" },
  imageWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  mascot:    { maxWidth: SCREEN_WIDTH * 0.8 },
  textCard:  { width: "100%", paddingHorizontal: 32, paddingTop: 24, gap: 12 },
  badge:     { alignSelf: "flex-start", backgroundColor: "#3DB54A", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 12, letterSpacing: 0.5 },
  headline:  { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 26, lineHeight: 32 },
  sub:       { color: "rgba(255,255,255,0.72)", fontFamily: "Inter_500Medium", fontSize: 15, lineHeight: 22 },
  dotsRow:   { position: "absolute", left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 6, alignItems: "center" },
  dot:       { height: 8, borderRadius: 4 },
  btnWrap:   { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 24, gap: 12, alignItems: "center" },
  btn:       { width: "100%", height: 56, borderRadius: 18, backgroundColor: "#3DB54A", alignItems: "center", justifyContent: "center" },
  btnText:   { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 },
  skip:      { paddingVertical: 6 },
  skipText:  { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_500Medium", fontSize: 14 },
});

/* ─── Setup styles ─── */

const styles = StyleSheet.create({
  container:    { flex: 1 },
  header:       { paddingHorizontal: 24, paddingBottom: 24 },
  progressContainer: { flexDirection: "row", gap: 8 },
  progressBar:  { flex: 1, height: 4, borderRadius: 2 },
  content:      { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  stepContainer: { gap: 16 },
  logoHero:     { borderRadius: 24, overflow: "hidden", marginBottom: 8 },
  heroRow:      { flexDirection: "row", alignItems: "flex-end" },
  heroLeft:     { flex: 1, paddingVertical: 32, paddingLeft: 24, paddingRight: 8, justifyContent: "center", gap: 2 },
  heroTitle:    { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 36, letterSpacing: -1 },
  heroBuddy:    { color: "#3DB54A", fontFamily: "Inter_400Regular", fontSize: 36, letterSpacing: -1 },
  heroTagline:  { color: "rgba(255,255,255,0.6)", fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 2, marginTop: 4 },
  heroImage:    { width: 160, height: 190 },
  title:        { fontSize: 26, fontFamily: "Inter_800ExtraBold", lineHeight: 32 },
  subtitle:     { fontSize: 15, fontFamily: "Inter_500Medium", lineHeight: 22, marginBottom: 8 },
  input:        { height: 56, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, fontFamily: "Inter_500Medium" },
  grid:         { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridItem:     { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  gridItemText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  footer:       { paddingHorizontal: 24, paddingTop: 16 },
  button:       { height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  buttonText:   { fontSize: 16, fontFamily: "Inter_700Bold" },
});
