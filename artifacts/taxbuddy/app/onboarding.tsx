import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { Branch } from "@/types";

const { width: W, height: H } = Dimensions.get("window");

const imgThumbs  = require("@/assets/images/raccoon_suit_thumbs_nobg.png");
const imgCircle  = require("@/assets/images/raccoon_logo_circle.jpeg");
const imgBadge   = require("@/assets/images/raccoon_suit_badge.jpeg");

const NAVY  = "#0F2B4C";
const BLUE  = "#0066B3";
const GREEN = "#3DB54A";

/* ─── Branches ─── */
const branches: { id: Branch; label: string }[] = [
  { id: "it",         label: "IT & Software" },
  { id: "design",     label: "Design & Medien" },
  { id: "beratung",   label: "Beratung & Consulting" },
  { id: "handel",     label: "Handel & E-Commerce" },
  { id: "handwerk",   label: "Handwerk" },
  { id: "content",    label: "Content Creation" },
  { id: "marketing",  label: "Marketing & PR" },
  { id: "gastro",     label: "Gastronomie" },
  { id: "gesundheit", label: "Gesundheit & Pflege" },
  { id: "bildung",    label: "Bildung & Coaching" },
  { id: "immobilien", label: "Immobilien" },
  { id: "kfz",        label: "KFZ & Transport" },
  { id: "event",      label: "Event & Unterhaltung" },
  { id: "finanz",     label: "Finanzen & Versicherung" },
  { id: "recht",      label: "Recht & Steuern" },
  { id: "sonstiges",  label: "Sonstiges" },
];

/* ═══════════════════════════════════════
   INTRO SLIDES
═══════════════════════════════════════ */

function Slide0() {
  return (
    <View style={[sl.root, { backgroundColor: BLUE, flexDirection: "row" }]}>
      {/* Wordmark left */}
      <Animated.View entering={FadeInLeft.duration(500).springify()} style={sl.left}>
        <Text style={sl.taxWord}>TAX</Text>
        <Text style={sl.buddyWord}>buddy</Text>
        <View style={sl.divider} />
        <Text style={sl.tagline}>STEUERN IM GRIFF</Text>
        <Text style={sl.sub}>
          Dein smarter{"\n"}Steuer-Buddy fur{"\n"}Kleinunternehmer.
        </Text>
      </Animated.View>

      {/* Mascot right */}
      <Animated.View entering={FadeInRight.duration(600).delay(100).springify()} style={sl.right}>
        <Image source={imgThumbs} style={sl.mascotThumbs} resizeMode="contain" />
      </Animated.View>

      {/* Bottom glow */}
      <View style={sl.glow} />
    </View>
  );
}

function Slide1() {
  const features = [
    { icon: "↑", label: "Einnahmen erfassen", color: GREEN },
    { icon: "↓", label: "Ausgaben tracken",   color: "#EF4444" },
    { icon: "→", label: "Fahrtenbuch",         color: BLUE },
    { icon: "✓", label: "Steuer-Check",        color: "#F59E0B" },
  ];
  return (
    <View style={[sl.root, { backgroundColor: NAVY }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={sl.centerContent}>
        <Animated.View entering={FadeIn.duration(300).delay(80)} style={sl.circleWrap}>
          <Image source={imgCircle} style={sl.mascotCircle} resizeMode="cover" />
        </Animated.View>
        <Animated.Text entering={FadeInUp.duration(400).delay(150)} style={sl.slideHeadline}>
          Alles an einem Ort
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(220)} style={sl.slideSub}>
          Einnahmen, Ausgaben, Fahrten und Steuertipps — ubersichtlich und einfach.
        </Animated.Text>
        <View style={sl.featureGrid}>
          {features.map((f, i) => (
            <Animated.View
              key={f.label}
              entering={FadeInUp.duration(350).delay(280 + i * 70).springify()}
              style={[sl.featureChip, { borderColor: f.color + "40" }]}
            >
              <Text style={[sl.featureIcon, { color: f.color }]}>{f.icon}</Text>
              <Text style={sl.featureLabel}>{f.label}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function Slide2() {
  return (
    <View style={[sl.root, { backgroundColor: NAVY }]}>
      <Animated.View entering={FadeInDown.duration(500)} style={sl.centerContent}>
        <Animated.Text entering={FadeInUp.duration(400).delay(80)} style={sl.slideOverline}>
          KILOMETERPAUSCHALE · STEUERTIPPS · KI-ASSISTENT
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(150)} style={[sl.slideHeadline, { fontSize: 30 }]}>
          Keine Uberraschungen{"\n"}mehr beim Finanzamt
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(220)} style={sl.slideSub}>
          TAXbuddy rechnet automatisch mit — und warnt dich, bevor es teuer wird.
        </Animated.Text>
        <Animated.View entering={FadeInUp.duration(500).delay(320).springify()} style={sl.statRow}>
          <View style={sl.statCard}>
            <Text style={sl.statNum}>0,30{"\n"}<Text style={sl.statUnit}>EUR/km</Text></Text>
            <Text style={sl.statDesc}>Kilometerpauschale</Text>
          </View>
          <View style={sl.statDivider} />
          <View style={sl.statCard}>
            <Text style={sl.statNum}>25.000{"\n"}<Text style={sl.statUnit}>EUR</Text></Text>
            <Text style={sl.statDesc}>Kleinunternehmergrenze</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function Slide3() {
  return (
    <View style={[sl.root, { backgroundColor: NAVY }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={sl.centerContent}>
        <Animated.View entering={FadeIn.duration(400).delay(60)}>
          <Image source={imgBadge} style={sl.mascotBadge} resizeMode="contain" />
        </Animated.View>
        <Animated.View
          entering={FadeInUp.duration(400).delay(180)}
          style={[sl.greenPill]}
        >
          <Text style={sl.greenPillText}>Kostenlos & ohne Anmeldung</Text>
        </Animated.View>
        <Animated.Text entering={FadeInUp.duration(400).delay(240)} style={[sl.slideHeadline, { textAlign: "center" }]}>
          In 60 Sekunden startklar
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(300)} style={[sl.slideSub, { textAlign: "center" }]}>
          Drei kurze Angaben genugen. Clever. Entspannt. Steuern im Griff.
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3];

/* ═══════════════════════════════════════
   ANIMATED PROGRESS BAR
═══════════════════════════════════════ */

const TRACK_W = W - 48; // 24px horizontal padding each side

function SetupProgress({ step, total }: { step: number; total: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming((step - 1) / total, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [step]);
  const barStyle = useAnimatedStyle(() => ({
    width: progress.value * TRACK_W,
  }));
  return (
    <View style={[prog.track, { width: TRACK_W }]}>
      <Animated.View style={[prog.fill, barStyle]} />
    </View>
  );
}

/* ═══════════════════════════════════════
   MAIN ONBOARDING SCREEN
═══════════════════════════════════════ */

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { updateProfile } = useProfile();

  const [phase, setPhase]     = useState<"intro" | "setup">("intro");
  const [slideIdx, setSlideIdx] = useState(0);
  const [step, setStep]       = useState(1);
  const [name, setName]       = useState("");
  const [branch, setBranch]   = useState<Branch>("sonstiges");
  const [revenue, setRevenue] = useState("30000");

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const tapBtn = (cb: () => void) => {
    btnScale.value = withSpring(0.96, { damping: 15 }, () => {
      btnScale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    cb();
  };

  const isLastSlide = slideIdx === SLIDES.length - 1;

  const goNext = () => tapBtn(() => {
    if (isLastSlide) setPhase("setup");
    else setSlideIdx((i) => i + 1);
  });
  const goBack = () => tapBtn(() => {
    if (slideIdx > 0) setSlideIdx((i) => i - 1);
  });
  const skip = () => { Haptics.selectionAsync(); setPhase("setup"); };

  const setupNext = () => tapBtn(() => {
    if (step < 3) setStep((s) => s + 1);
    else handleComplete();
  });

  const handleComplete = async () => {
    await updateProfile({
      name,
      branch,
      revenueGoal: parseInt(revenue) || 30000,
      onboardingComplete: true,
    });
    router.replace("/(tabs)");
  };

  /* ── INTRO ── */
  if (phase === "intro") {
    const SlideComp = SLIDES[slideIdx];
    return (
      <View style={{ flex: 1, backgroundColor: NAVY }}>
        {/* Slide — key forces re-mount so entering animation fires each time */}
        <Animated.View key={slideIdx} style={{ flex: 1 }} entering={FadeIn.duration(280)}>
          <SlideComp />
        </Animated.View>

        {/* Bottom controls */}
        <View style={[ctrl.container, { paddingBottom: insets.bottom + 24 }]}>
          {/* Dots */}
          <View style={ctrl.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[ctrl.dot, {
                  backgroundColor: i === slideIdx ? GREEN : "rgba(255,255,255,0.3)",
                  width: i === slideIdx ? 22 : 8,
                }]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={ctrl.row}>
            {slideIdx > 0 ? (
              <Pressable onPress={goBack} style={ctrl.backBtn}>
                <Text style={ctrl.backText}>Zuruck</Text>
              </Pressable>
            ) : (
              <Pressable onPress={skip} style={ctrl.backBtn}>
                <Text style={ctrl.backText}>Uberspringen</Text>
              </Pressable>
            )}

            <Animated.View style={[ctrl.nextWrap, btnStyle]}>
              <Pressable onPress={goNext} style={[ctrl.nextBtn, { backgroundColor: isLastSlide ? GREEN : BLUE }]}>
                <Text style={ctrl.nextText}>{isLastSlide ? "Jetzt einrichten" : "Weiter"}</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
    );
  }

  /* ── SETUP ── */
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[styles.topBar, { paddingTop: insets.top + 16 }]}
      >
        <SetupProgress step={step} total={3} />
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>
          Schritt {step} von 3
        </Text>
      </Animated.View>

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        bottomOffset={40}
      >
        {/* Step 1 — Name */}
        {step === 1 && (
          <Animated.View key="s1" entering={FadeInUp.duration(420).springify()} style={styles.stepWrap}>
            {/* Hero banner */}
            <Animated.View entering={FadeIn.duration(350)} style={[styles.heroBanner, { backgroundColor: BLUE }]}>
              <View style={styles.heroLeft}>
                <Text style={styles.heroTAX}>TAX</Text>
                <Text style={styles.heroBuddy}>buddy</Text>
                <Text style={styles.heroTag}>STEUERN IM GRIFF</Text>
              </View>
              <Image source={imgThumbs} style={styles.heroImg} resizeMode="contain" />
            </Animated.View>

            <Animated.Text entering={FadeInDown.duration(350).delay(80)} style={[styles.title, { color: colors.foreground }]}>
              Willkommen!
            </Animated.Text>
            <Animated.Text entering={FadeInDown.duration(350).delay(140)} style={[styles.sub, { color: colors.mutedForeground }]}>
              Dein smarter Steuerbegleiter fur Kleinunternehmer. Wie durfen wir dich nennen?
            </Animated.Text>
            <Animated.View entering={FadeInDown.duration(400).delay(200).springify()}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Dein Name"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </Animated.View>
          </Animated.View>
        )}

        {/* Step 2 — Branch */}
        {step === 2 && (
          <Animated.View key="s2" entering={FadeInUp.duration(400).springify()} style={styles.stepWrap}>
            <Animated.Text entering={FadeInDown.duration(350)} style={[styles.title, { color: colors.foreground }]}>
              Deine Branche
            </Animated.Text>
            <Animated.Text entering={FadeInDown.duration(350).delay(80)} style={[styles.sub, { color: colors.mutedForeground }]}>
              Wir passen deine Steuertipps und Empfehlungen genau darauf an.
            </Animated.Text>
            <Animated.View entering={FadeIn.duration(400).delay(140)} style={styles.grid}>
              {branches.map((b, i) => (
                <Animated.View
                  key={b.id}
                  entering={FadeInUp.duration(280).delay(160 + i * 25).springify()}
                >
                  <Pressable
                    style={[
                      styles.chip,
                      {
                        backgroundColor: branch === b.id ? BLUE : colors.card,
                        borderColor: branch === b.id ? BLUE : colors.border,
                      },
                    ]}
                    onPress={() => { Haptics.selectionAsync(); setBranch(b.id); }}
                  >
                    <Text style={[styles.chipText, { color: branch === b.id ? "#fff" : colors.foreground }]}>
                      {b.label}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </Animated.View>
          </Animated.View>
        )}

        {/* Step 3 — Revenue */}
        {step === 3 && (
          <Animated.View key="s3" entering={FadeInUp.duration(400).springify()} style={styles.stepWrap}>
            <Animated.Text entering={FadeInDown.duration(350)} style={[styles.title, { color: colors.foreground }]}>
              Dein Umsatzziel
            </Animated.Text>
            <Animated.Text entering={FadeInDown.duration(350).delay(80)} style={[styles.sub, { color: colors.mutedForeground }]}>
              Die Kleinunternehmergrenze liegt bei 25.000 EUR. Wir berechnen automatisch, wie weit du bist.
            </Animated.Text>
            <Animated.View entering={FadeInDown.duration(400).delay(160).springify()}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                placeholder="z. B. 20000"
                placeholderTextColor={colors.mutedForeground}
                value={revenue}
                onChangeText={setRevenue}
                keyboardType="numeric"
                autoFocus
              />
            </Animated.View>
            <Animated.View entering={FadeIn.duration(400).delay(260)}>
              <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                  Ab 22.000 EUR empfehlen wir, das Limit im Blick zu behalten.
                  TAXbuddy warnt dich automatisch, wenn du dich der Grenze naherst.
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </KeyboardAwareScrollViewCompat>

      {/* Footer CTA */}
      <Animated.View
        entering={FadeInUp.duration(400).delay(80)}
        style={[styles.footer, { paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}
      >
        <Animated.View style={btnStyle}>
          <Pressable
            style={[styles.cta, { backgroundColor: BLUE, opacity: (step === 1 && !name.trim()) ? 0.45 : 1 }]}
            onPress={setupNext}
            disabled={step === 1 && !name.trim()}
          >
            <Text style={styles.ctaText}>{step === 3 ? "Loslegen" : "Weiter"}</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/* ═══════════════════════════════════════
   STYLES — Slide internals
═══════════════════════════════════════ */

const sl = StyleSheet.create({
  root:           { flex: 1 },
  glow:           { position: "absolute", bottom: -60, left: -40, width: W * 1.2, height: 180, borderRadius: 999, backgroundColor: "rgba(61,181,74,0.08)" },

  /* Slide 0 */
  left:           { flex: 1, justifyContent: "flex-end", paddingLeft: 28, paddingBottom: 60, paddingTop: 0, gap: 2, zIndex: 2 },
  right:          { width: W * 0.50, alignItems: "flex-end", justifyContent: "flex-end" },
  taxWord:        { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 56, letterSpacing: -2, lineHeight: 58 },
  buddyWord:      { color: GREEN,  fontFamily: "Inter_400Regular",   fontSize: 56, letterSpacing: -2, lineHeight: 60, marginBottom: 14 },
  divider:        { width: 40, height: 2, backgroundColor: "rgba(255,255,255,0.3)", marginBottom: 12 },
  tagline:        { color: "rgba(255,255,255,0.55)", fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2.8, marginBottom: 16 },
  sub:            { color: "rgba(255,255,255,0.80)", fontFamily: "Inter_500Medium",   fontSize: 14, lineHeight: 20 },
  mascotThumbs:   { width: W * 0.52, height: H * 0.62 },

  /* Slides 1–3 */
  centerContent:  { flex: 1, alignItems: "flex-start", justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  circleWrap:     { width: 88, height: 88, borderRadius: 44, overflow: "hidden", borderWidth: 3, borderColor: GREEN },
  mascotCircle:   { width: 88, height: 88 },
  slideOverline:  { color: "rgba(255,255,255,0.4)", fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.8 },
  slideHeadline:  { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 26, lineHeight: 32 },
  slideSub:       { color: "rgba(255,255,255,0.68)", fontFamily: "Inter_500Medium",   fontSize: 15, lineHeight: 22 },

  featureGrid:    { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  featureChip:    { flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.06)" },
  featureIcon:    { fontFamily: "Inter_700Bold", fontSize: 14 },
  featureLabel:   { color: "#fff", fontFamily: "Inter_500Medium", fontSize: 13 },

  statRow:        { flexDirection: "row", gap: 0, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 18, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)" },
  statCard:       { flex: 1, padding: 18, gap: 4 },
  statDivider:    { width: 1, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 12 },
  statNum:        { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 22, lineHeight: 28 },
  statUnit:       { color: GREEN,  fontFamily: "Inter_600SemiBold",   fontSize: 13 },
  statDesc:       { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_500Medium", fontSize: 11 },

  mascotBadge:    { width: W * 0.62, height: W * 0.62, alignSelf: "center" },
  greenPill:      { alignSelf: "flex-start", backgroundColor: GREEN, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  greenPillText:  { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 12 },
});

/* ── Controls (intro bottom) ── */
const ctrl = StyleSheet.create({
  container: { paddingHorizontal: 28, gap: 20, paddingTop: 12 },
  dots:      { flexDirection: "row", justifyContent: "center", gap: 6, alignItems: "center" },
  dot:       { height: 8, borderRadius: 4 },
  row:       { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn:   { paddingHorizontal: 18, paddingVertical: 14 },
  backText:  { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  nextWrap:  { flex: 1 },
  nextBtn:   { height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  nextText:  { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 },
});

/* ── Progress bar ── */
const prog = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.08)", overflow: "hidden" },
  fill:  { height: 4, borderRadius: 2, backgroundColor: BLUE },
});

/* ── Setup steps ── */
const styles = StyleSheet.create({
  root:      { flex: 1 },
  topBar:    { paddingHorizontal: 24, paddingBottom: 8, gap: 8 },
  stepLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
  scroll:    { paddingHorizontal: 24, paddingTop: 20, gap: 16 },
  stepWrap:  { gap: 16 },

  heroBanner: { borderRadius: 22, overflow: "hidden", flexDirection: "row", alignItems: "flex-end", minHeight: 190 },
  heroLeft:   { flex: 1, paddingVertical: 28, paddingLeft: 24, paddingRight: 8, gap: 2 },
  heroTAX:    { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 40, letterSpacing: -1, lineHeight: 42 },
  heroBuddy:  { color: GREEN,  fontFamily: "Inter_400Regular",   fontSize: 40, letterSpacing: -1, lineHeight: 44, marginBottom: 8 },
  heroTag:    { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 2.5 },
  heroImg:    { width: W * 0.42, height: 200 },

  title:     { fontFamily: "Inter_800ExtraBold", fontSize: 26, lineHeight: 32 },
  sub:       { fontFamily: "Inter_500Medium",   fontSize: 15, lineHeight: 22 },

  input:     { height: 56, borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 18, fontSize: 16, fontFamily: "Inter_500Medium" },

  grid:      { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip:      { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5 },
  chipText:  { fontSize: 13, fontFamily: "Inter_500Medium" },

  infoBox:   { borderWidth: 1, borderRadius: 14, padding: 16 },
  infoText:  { fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 20 },

  footer:    { paddingHorizontal: 24, paddingTop: 12, borderTopWidth: 0 },
  cta:       { height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ctaText:   { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 },
});
