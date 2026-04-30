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
  withRepeat,
  withSequence,
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

const imgThumbs = require("@/assets/images/raccoon_suit_thumbs_nobg.png");
const imgCircle = require("@/assets/images/raccoon_logo_circle.jpeg");
const imgBadge  = require("@/assets/images/raccoon_suit_badge.jpeg");

const NAVY  = "#0F2B4C";
const BLUE  = "#0066B3";
const GREEN = "#3DB54A";
const RED   = "#EF4444";
const AMBER = "#F59E0B";

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

/* ══════════════════════════════════════════════
   SLIDE 0 — AUFMERKSAMKEIT
   "Mehr behalten. Weniger zahlen."
══════════════════════════════════════════════ */
function Slide0() {
  return (
    <View style={[sl.root, { backgroundColor: BLUE, flexDirection: "row" }]}>
      <Animated.View entering={FadeInLeft.duration(500).springify()} style={sl.left}>
        <Text style={sl.taxWord}>TAX</Text>
        <Text style={sl.buddyWord}>buddy</Text>
        <View style={sl.divider} />
        <Text style={sl.overline}>STEUERN IM GRIFF</Text>
        <Text style={sl.sub}>
          Dein smarter{"\n"}Steuer-Buddy fur{"\n"}Kleinunternehmer.
        </Text>
        <View style={{ gap: 8, marginTop: 20 }}>
          {["Probleme aufzeigen", "Risiken verstehen", "Losung prasent.", "Vertrauen aufbauen"].map((item, i) => (
            <Animated.View
              key={item}
              entering={FadeInLeft.duration(350).delay(300 + i * 60).springify()}
              style={sl.bullet}
            >
              <View style={sl.bulletDot} />
              <Text style={sl.bulletText}>{item}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInRight.duration(600).delay(100).springify()} style={sl.right}>
        <Image source={imgThumbs} style={sl.mascotThumbs} resizeMode="contain" />
      </Animated.View>

      <View style={sl.glow} />
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 1 — NUTZEN VERSTEHEN
   "Alles im Blick. Alles an einem Ort."
══════════════════════════════════════════════ */
function Slide1() {
  const features = [
    { icon: "↑", label: "Einnahmen erfassen", color: GREEN,  val: "21.132 €" },
    { icon: "↓", label: "Ausgaben tracken",   color: RED,    val:  "5.668 €" },
    { icon: "→", label: "Fahrtenbuch",         color: BLUE,   val: "0,30/km" },
    { icon: "✓", label: "Steuer-Check",        color: AMBER,  val: "Tipps" },
  ];
  return (
    <View style={[sl.root, { backgroundColor: NAVY }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={sl.centerContent}>
        <Animated.View entering={FadeIn.duration(300).delay(60)} style={sl.circleWrap}>
          <Image source={imgCircle} style={sl.mascotCircle} resizeMode="cover" />
        </Animated.View>
        <Animated.Text entering={FadeInUp.duration(400).delay(130)} style={sl.slideOverline}>
          NUTZEN VERSTEHEN
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(180)} style={sl.slideHeadline}>
          Alles im Blick.{"\n"}Alles an einem Ort.
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(240)} style={sl.slideSub}>
          Einnahmen, Ausgaben, Fahrten und Steuertipps — ubersichtlich und automatisch.
        </Animated.Text>
        <View style={sl.featureGrid}>
          {features.map((f, i) => (
            <Animated.View
              key={f.label}
              entering={FadeInUp.duration(350).delay(300 + i * 60).springify()}
              style={[sl.featureChip, { borderColor: f.color + "40" }]}
            >
              <Text style={[sl.featureIcon, { color: f.color }]}>{f.icon}</Text>
              <View>
                <Text style={sl.featureLabel}>{f.label}</Text>
                <Text style={[sl.featureVal, { color: f.color }]}>{f.val}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 2 — PROBLEM ANSPRECHEN
   "Kleine Fehler. Grosse Kosten."
══════════════════════════════════════════════ */
function Slide2() {
  const problems = [
    { label: "Steuerfallen ubersehen",    color: RED },
    { label: "Fristen verspasst",         color: RED },
    { label: "Zu hohe Steuerlast",        color: AMBER },
    { label: "Wichtige Tipps verpasst",   color: AMBER },
    { label: "Geld verschenkt",           color: RED },
  ];
  return (
    <View style={[sl.root, { backgroundColor: NAVY }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={sl.centerContent}>
        <Animated.Text entering={FadeInUp.duration(400).delay(80)} style={sl.slideOverline}>
          PROBLEM ANSPRECHEN
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(140)} style={sl.slideHeadline}>
          Kleine Fehler.{"\n"}
          <Text style={{ color: RED }}>Grosse Kosten.</Text>
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(200)} style={sl.slideSub}>
          Viele Selbstandige zahlen zu viel Steuern oder verpassen wichtige Fristen.
        </Animated.Text>
        <View style={{ gap: 10, marginTop: 8 }}>
          {problems.map((p, i) => (
            <Animated.View
              key={p.label}
              entering={FadeInLeft.duration(350).delay(280 + i * 70).springify()}
              style={[sl.problemRow, { borderColor: p.color + "30" }]}
            >
              <View style={[sl.problemDot, { backgroundColor: p.color }]} />
              <Text style={sl.problemLabel}>{p.label}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 3 — LÖSUNG PRÄSENTIEREN
   "TAXbuddy warnt dich rechtzeitig."
══════════════════════════════════════════════ */
function Slide3() {
  const solutions = [
    { label: "Fruhwarnung bei Umsatzlimit",   sub: "Sobald du dich 22.000 EUR naherst" },
    { label: "Sparpotenziale erkennen",        sub: "KI analysiert deine Ausgaben" },
    { label: "Personliche Steuertipps",        sub: "Passend zu deiner Branche" },
  ];
  return (
    <View style={[sl.root, { backgroundColor: NAVY }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={sl.centerContent}>
        <Animated.Text entering={FadeInUp.duration(400).delay(80)} style={sl.slideOverline}>
          LOSUNG PRASENTIEREN
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(140)} style={sl.slideHeadline}>
          TAXbuddy warnt{"\n"}dich rechtzeitig.
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(200)} style={sl.slideSub}>
          Bevor es teuer wird.
        </Animated.Text>
        <View style={{ gap: 12, marginTop: 8 }}>
          {solutions.map((s, i) => (
            <Animated.View
              key={s.label}
              entering={FadeInUp.duration(350).delay(280 + i * 80).springify()}
              style={sl.solutionRow}
            >
              <View style={sl.checkCircle}>
                <Text style={sl.checkMark}>✓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={sl.solutionLabel}>{s.label}</Text>
                <Text style={sl.solutionSub}>{s.sub}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 4 — SOFORT ZEIGEN
   "In 60 Sekunden startklar."
══════════════════════════════════════════════ */
function Slide4() {
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.00, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={[sl.root, { backgroundColor: NAVY }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={sl.centerContent}>
        <Animated.Text entering={FadeInUp.duration(400).delay(80)} style={sl.slideOverline}>
          SOFORT ZEIGEN
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(140)} style={sl.slideHeadline}>
          In 60 Sekunden{"\n"}startklar.
        </Animated.Text>

        <Animated.View entering={FadeIn.duration(500).delay(220)}>
          <Animated.View style={[sl.timerRing, pulseStyle]}>
            <Text style={sl.timerNum}>60</Text>
            <Text style={sl.timerSec}>Sek.</Text>
          </Animated.View>
        </Animated.View>

        <Animated.Text entering={FadeInUp.duration(400).delay(340)} style={sl.slideSub}>
          Erste Auswertung in weniger als einer Minute — kostenlos und unverbindlich.
        </Animated.Text>
        <Animated.View entering={FadeInUp.duration(400).delay(420)} style={sl.steps3Row}>
          {["Angaben eingeben", "Analyse starten", "Ergebnis erhalten"].map((s, i) => (
            <View key={s} style={sl.step3Item}>
              <View style={sl.step3Num}><Text style={sl.step3NumText}>{i + 1}</Text></View>
              <Text style={sl.step3Label}>{s}</Text>
            </View>
          ))}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 5 — HANDLUNG & VERTRAUEN
   "Kostenlos starten. Jederzeit upgraden."
══════════════════════════════════════════════ */
function Slide5() {
  const freeFeatures    = ["Basis-Ubersicht", "Einnahmen & Ausgaben", "Top-Steuertipp"];
  const premiumFeatures = ["Unbegrenzte Eintrage", "KI-Assistent", "Steuer-Check & Export"];
  return (
    <View style={[sl.root, { backgroundColor: NAVY }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={sl.centerContent}>
        <Animated.View entering={FadeIn.duration(350).delay(60)} style={sl.circleWrap}>
          <Image source={imgBadge} style={sl.mascotCircle} resizeMode="cover" />
        </Animated.View>
        <Animated.Text entering={FadeInUp.duration(400).delay(120)} style={sl.slideOverline}>
          HANDLUNG & VERTRAUEN
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(180)} style={sl.slideHeadline}>
          Kostenlos starten.{"\n"}Jederzeit upgraden.
        </Animated.Text>

        <Animated.View entering={FadeInUp.duration(500).delay(270).springify()} style={sl.pricingRow}>
          {/* Free tier */}
          <View style={[sl.pricingCard, { borderColor: "rgba(255,255,255,0.15)" }]}>
            <Text style={sl.pricingTier}>Kostenlos</Text>
            <Text style={sl.pricingPrice}>0 €</Text>
            {freeFeatures.map((f) => (
              <View key={f} style={sl.pricingFeature}>
                <Text style={[sl.checkMark, { fontSize: 11, color: GREEN }]}>✓</Text>
                <Text style={sl.pricingFeatureText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Premium tier */}
          <View style={[sl.pricingCard, { borderColor: GREEN, backgroundColor: "rgba(61,181,74,0.08)" }]}>
            <View style={sl.premiumBadge}><Text style={sl.premiumBadgeText}>Premium</Text></View>
            <Text style={sl.pricingTier}>Premium</Text>
            <Text style={[sl.pricingPrice, { color: GREEN }]}>
              ab 2,99 €
              <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>/Monat</Text>
            </Text>
            {premiumFeatures.map((f) => (
              <View key={f} style={sl.pricingFeature}>
                <Text style={[sl.checkMark, { fontSize: 11, color: GREEN }]}>✓</Text>
                <Text style={sl.pricingFeatureText}>{f}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5];

/* ══════════════════════════════════════════════
   ANIMATED PROGRESS BAR (setup phase)
══════════════════════════════════════════════ */
const TRACK_W = W - 48;

function SetupProgress({ step, total }: { step: number; total: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming((step - 1) / total, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [step]);
  const barStyle = useAnimatedStyle(() => ({ width: progress.value * TRACK_W }));
  return (
    <View style={[prog.track, { width: TRACK_W }]}>
      <Animated.View style={[prog.fill, barStyle]} />
    </View>
  );
}

/* ══════════════════════════════════════════════
   MAIN ONBOARDING SCREEN
══════════════════════════════════════════════ */
export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { updateProfile } = useProfile();

  const [phase,    setPhase]    = useState<"intro" | "setup">("intro");
  const [slideIdx, setSlideIdx] = useState(0);
  const [step,     setStep]     = useState(1);
  const [name,     setName]     = useState("");
  const [branch,   setBranch]   = useState<Branch>("sonstiges");
  const [revenue,  setRevenue]  = useState("30000");

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

  /* ── INTRO PHASE ── */
  if (phase === "intro") {
    const SlideComp = SLIDES[slideIdx];
    return (
      <View style={{ flex: 1, backgroundColor: NAVY }}>
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
              <Pressable
                onPress={goNext}
                style={[ctrl.nextBtn, { backgroundColor: isLastSlide ? GREEN : BLUE }]}
              >
                <Text style={ctrl.nextText}>
                  {isLastSlide ? "Los geht's" : "Weiter"}
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
    );
  }

  /* ── SETUP PHASE ── */
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
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

/* ══════════════════════════════════════════════
   STYLES — Slide internals
══════════════════════════════════════════════ */
const sl = StyleSheet.create({
  root:          { flex: 1 },
  glow:          { position: "absolute", bottom: -60, left: -40, width: W * 1.2, height: 180, borderRadius: 999, backgroundColor: "rgba(61,181,74,0.08)" },

  /* Slide 0 */
  left:          { flex: 1, justifyContent: "flex-end", paddingLeft: 28, paddingBottom: 60, gap: 2, zIndex: 2 },
  right:         { width: W * 0.50, alignItems: "flex-end", justifyContent: "flex-end" },
  taxWord:       { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 52, letterSpacing: -2, lineHeight: 54 },
  buddyWord:     { color: GREEN,  fontFamily: "Inter_400Regular",   fontSize: 52, letterSpacing: -2, lineHeight: 56, marginBottom: 12 },
  divider:       { width: 40, height: 2, backgroundColor: "rgba(255,255,255,0.3)", marginBottom: 10 },
  overline:      { color: "rgba(255,255,255,0.55)", fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2.8, marginBottom: 14 },
  sub:           { color: "rgba(255,255,255,0.80)", fontFamily: "Inter_500Medium", fontSize: 14, lineHeight: 20 },
  mascotThumbs:  { width: W * 0.52, height: H * 0.60 },
  bullet:        { flexDirection: "row", alignItems: "center", gap: 8 },
  bulletDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN },
  bulletText:    { color: "rgba(255,255,255,0.75)", fontFamily: "Inter_500Medium", fontSize: 12 },

  /* Slides 1–5 shared */
  centerContent: { flex: 1, alignItems: "flex-start", justifyContent: "center", paddingHorizontal: 32, gap: 14 },
  circleWrap:    { width: 72, height: 72, borderRadius: 36, overflow: "hidden", borderWidth: 3, borderColor: GREEN },
  mascotCircle:  { width: 72, height: 72 },
  slideOverline: { color: "rgba(255,255,255,0.4)", fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.8 },
  slideHeadline: { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 26, lineHeight: 32 },
  slideSub:      { color: "rgba(255,255,255,0.65)", fontFamily: "Inter_500Medium", fontSize: 14, lineHeight: 21 },

  /* Slide 1 */
  featureGrid:   { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  featureChip:   { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.06)", minWidth: "44%" },
  featureIcon:   { fontFamily: "Inter_700Bold", fontSize: 16 },
  featureLabel:  { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 12 },
  featureVal:    { fontFamily: "Inter_700Bold", fontSize: 13 },

  /* Slide 2 */
  problemRow:    { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  problemDot:    { width: 8, height: 8, borderRadius: 4 },
  problemLabel:  { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 },

  /* Slide 3 */
  solutionRow:   { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(61,181,74,0.25)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  checkCircle:   { width: 26, height: 26, borderRadius: 13, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" },
  checkMark:     { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 13 },
  solutionLabel: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 14, lineHeight: 18 },
  solutionSub:   { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 },

  /* Slide 4 */
  timerRing:     { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: GREEN, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(61,181,74,0.1)", alignSelf: "flex-start" },
  timerNum:      { color: GREEN, fontFamily: "Inter_800ExtraBold", fontSize: 38, lineHeight: 40 },
  timerSec:      { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_600SemiBold", fontSize: 11 },
  steps3Row:     { flexDirection: "row", gap: 10, marginTop: 4, flexWrap: "wrap" },
  step3Item:     { alignItems: "center", gap: 6, flex: 1, minWidth: 80 },
  step3Num:      { width: 30, height: 30, borderRadius: 15, backgroundColor: BLUE, alignItems: "center", justifyContent: "center" },
  step3NumText:  { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 14 },
  step3Label:    { color: "rgba(255,255,255,0.65)", fontFamily: "Inter_500Medium", fontSize: 11, textAlign: "center" },

  /* Slide 5 */
  pricingRow:       { flexDirection: "row", gap: 10, width: "100%" },
  pricingCard:      { flex: 1, borderWidth: 1, borderRadius: 16, padding: 14, gap: 8, backgroundColor: "rgba(255,255,255,0.04)" },
  pricingTier:      { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" },
  pricingPrice:     { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 22, lineHeight: 26 },
  pricingFeature:   { flexDirection: "row", alignItems: "center", gap: 6 },
  pricingFeatureText: { color: "rgba(255,255,255,0.7)", fontFamily: "Inter_500Medium", fontSize: 12, flex: 1 },
  premiumBadge:     { alignSelf: "flex-start", backgroundColor: GREEN, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 2 },
  premiumBadgeText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 0.5 },
});

/* ── Controls (intro bottom) ── */
const ctrl = StyleSheet.create({
  container: { paddingHorizontal: 28, gap: 16, paddingTop: 12 },
  dots:      { flexDirection: "row", justifyContent: "center", gap: 6, alignItems: "center" },
  dot:       { height: 8, borderRadius: 4 },
  row:       { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn:   { paddingHorizontal: 18, paddingVertical: 14 },
  backText:  { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  nextWrap:  { flex: 1 },
  nextBtn:   { height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  nextText:  { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 },
});

/* ── Progress bar (setup) ── */
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

  footer:    { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
  cta:       { height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  ctaText:   { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 },
});
