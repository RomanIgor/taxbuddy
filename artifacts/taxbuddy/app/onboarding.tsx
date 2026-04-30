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

const BG    = "#0A1628"; // near-black navy
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
   Text top, mascot bottom-left
══════════════════════════════════════════════ */
function Slide0() {
  const checks = ["Steuern verstehen", "Geld sparen", "Stress vermeiden"];
  return (
    <View style={[sl.root, { backgroundColor: BG }]}>
      {/* Top content */}
      <Animated.View entering={FadeInLeft.duration(480)} style={sl.s0Top}>
        {/* Wordmark */}
        <View style={sl.wordmark}>
          <Text style={sl.taxWord}>TAX</Text>
          <Text style={sl.buddyWord}>buddy</Text>
        </View>
        <Animated.Text entering={FadeInUp.duration(380).delay(120)} style={sl.s0Sub}>
          Dein smarter{" "}
          <Text style={{ color: GREEN }}>Steuer-Buddy</Text>
          {" "}fur Selbstandige & Kleinunternehmer.
        </Animated.Text>
        <View style={{ gap: 10, marginTop: 20 }}>
          {checks.map((c, i) => (
            <Animated.View
              key={c}
              entering={FadeInLeft.duration(360).delay(220 + i * 80).springify()}
              style={sl.checkRow}
            >
              <View style={sl.checkBadge}><Text style={sl.checkBadgeText}>✓</Text></View>
              <Text style={sl.checkLabel}>{c}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Bottom: mascot bottom-left */}
      <Animated.View
        entering={FadeInUp.duration(500).delay(80).springify()}
        style={sl.s0MascotWrap}
      >
        <Image source={imgThumbs} style={sl.s0Mascot} resizeMode="contain" />
      </Animated.View>

      {/* Glow */}
      <View style={sl.glow} />
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 1 — NUTZEN VERSTEHEN
   "Alles im Blick. Alles an einem Ort."
   Text top + phone mockup center
══════════════════════════════════════════════ */
function Slide1() {
  return (
    <View style={[sl.root, { backgroundColor: BG }]}>
      <Animated.View entering={FadeInDown.duration(420)} style={sl.centerPad}>
        <Animated.Text entering={FadeInUp.duration(350).delay(80)} style={sl.overline}>
          NUTZEN VERSTEHEN
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(140)} style={sl.headlineLg}>
          Alles im Blick.{"\n"}
          <Text style={{ color: BLUE }}>Alles an einem Ort.</Text>
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(380).delay(200)} style={sl.bodyGray}>
          Einnahmen, Ausgaben, Fahrten, Steuertipps und mehr — ubersichtlich und automatisch.
        </Animated.Text>

        {/* Phone mockup */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(300).springify()}
          style={sl.phoneMock}
        >
          {/* Mock status bar */}
          <View style={sl.mockBar}>
            <Text style={sl.mockBarText}>9:41</Text>
            <Text style={sl.mockBarText}>Ubersicht</Text>
          </View>
          {/* Income row */}
          <View style={sl.mockSection}>
            <Text style={sl.mockSectionLabel}>Einnahmen (YTD)</Text>
            <View style={sl.mockNumRow}>
              <Text style={[sl.mockNum, { color: GREEN }]}>21.132 €</Text>
              <Text style={sl.mockTag}>+12.1%</Text>
            </View>
            <View style={sl.mockBar2} />
          </View>
          {/* Expense row */}
          <View style={sl.mockSection}>
            <Text style={sl.mockSectionLabel}>Ausgaben (YTD)</Text>
            <View style={sl.mockNumRow}>
              <Text style={[sl.mockNum, { color: RED }]}>5.668 €</Text>
              <Text style={[sl.mockTag, { backgroundColor: RED + "22", color: RED }]}>-42.1%</Text>
            </View>
            <View style={[sl.mockBar2, { backgroundColor: RED + "40" }]} />
          </View>
          {/* Mock nav */}
          <View style={sl.mockNav}>
            {["Einnahmen", "Ausgaben", "Fahrten"].map((t) => (
              <View key={t} style={sl.mockNavItem}>
                <Text style={sl.mockNavLabel}>{t}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 2 — PROBLEM ANSPRECHEN
   "Kleine Fehler. Große Kosten."
   Text top-left, raccoon right, floating tags
══════════════════════════════════════════════ */
function Slide2() {
  const tags = [
    { label: "Steuerfallen\nerkennen",    top: "28%",  left: "2%",  color: RED },
    { label: "Fristen\nNachzahlungen",    top: "20%",  right: "2%", color: AMBER },
    { label: "Zu hohe\nNachzahlungen",   top: "62%",  left: "2%",  color: AMBER },
    { label: "Geld\nverschenken",         top: "55%",  right: "2%", color: RED },
  ];
  return (
    <View style={[sl.root, { backgroundColor: BG }]}>
      {/* Title block */}
      <Animated.View entering={FadeInLeft.duration(420)} style={sl.s2Top}>
        <Text style={sl.overline}>PROBLEM ANSPRECHEN</Text>
        <Text style={sl.headlineLg}>
          Kleine Fehler.{"\n"}
          <Text style={{ color: RED }}>Grosse Kosten.</Text>
        </Text>
        <Text style={sl.bodyGray}>
          Viele Selbstandige zahlen zu viel Steuern oder ubersehen wichtige Fristen.
        </Text>
      </Animated.View>

      {/* Raccoon right side */}
      <Animated.View
        entering={FadeInRight.duration(500).delay(100).springify()}
        style={sl.s2MascotWrap}
      >
        <Image source={imgThumbs} style={sl.s2Mascot} resizeMode="contain" />
      </Animated.View>

      {/* Floating problem tags */}
      {tags.map((tag, i) => (
        <Animated.View
          key={tag.label}
          entering={FadeIn.duration(350).delay(300 + i * 80)}
          style={[
            sl.floatTag,
            {
              top: tag.top as any,
              left: "left" in tag ? tag.left as any : undefined,
              right: "right" in tag ? tag.right as any : undefined,
              borderColor: tag.color + "50",
            },
          ]}
        >
          <View style={[sl.floatDot, { backgroundColor: tag.color }]} />
          <Text style={sl.floatLabel}>{tag.label}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 3 — LÖSUNG PRÄSENTIEREN
   "Dein smarter Buddy warnt dich rechtzeitig."
   Text + checks top, mascot bottom
══════════════════════════════════════════════ */
function Slide3() {
  const items = ["Fruhwarnungen", "Steuerprognosen", "Sparpotenziale", "Personliche Tipps"];
  return (
    <View style={[sl.root, { backgroundColor: BG }]}>
      {/* Top content */}
      <Animated.View entering={FadeInLeft.duration(420)} style={sl.s3Top}>
        <Text style={sl.overline}>LOSUNG PRASENTIEREN</Text>
        <Text style={sl.headlineLg}>
          Dein smarter Buddy{"\n"}
          <Text style={{ color: GREEN }}>warnt dich rechtzeitig.</Text>
        </Text>
        <Text style={sl.bodyGray}>
          TAXbuddy analysiert deine Zahlen und gibt dir klare Empfehlungen — bevor es teuer wird.
        </Text>
        <View style={{ gap: 9, marginTop: 14 }}>
          {items.map((item, i) => (
            <Animated.View
              key={item}
              entering={FadeInLeft.duration(340).delay(240 + i * 70).springify()}
              style={sl.checkRow}
            >
              <View style={sl.checkBadge}><Text style={sl.checkBadgeText}>✓</Text></View>
              <Text style={sl.checkLabel}>{item}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Mascot bottom */}
      <Animated.View
        entering={FadeInUp.duration(500).delay(80).springify()}
        style={sl.s3MascotWrap}
      >
        <Image source={imgThumbs} style={sl.s3Mascot} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 4 — SOFORT ZEIGEN
   "Starte in 60 Sekunden..."
   Text + timer + checklist (no raccoon)
══════════════════════════════════════════════ */
function Slide4() {
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const steps = ["Basisdaten eingeben", "Erste Analyse erhalten", "Sofort Klarheit gewinnen"];
  return (
    <View style={[sl.root, { backgroundColor: BG }]}>
      <Animated.View entering={FadeInDown.duration(420)} style={sl.centerPad}>
        <Animated.Text entering={FadeInUp.duration(350).delay(80)} style={sl.overline}>
          SOFORTWERT ZEIGEN
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(140)} style={sl.headlineLg}>
          Starte in{" "}
          <Text style={{ color: GREEN }}>60 Sekunden</Text>
          {"\n"}und sieh sofort den Unterschied.
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(380).delay(200)} style={sl.bodyGray}>
          Erste Auswertung in weniger als einer Minute — kostenlos & unverbindlich.
        </Animated.Text>

        {/* Timer */}
        <Animated.View entering={FadeIn.duration(500).delay(280)} style={{ alignSelf: "center" }}>
          <Animated.View style={[sl.timerRing, pulseStyle]}>
            <Text style={sl.timerNum}>60</Text>
            <Text style={sl.timerSec}>Sekunden</Text>
          </Animated.View>
        </Animated.View>

        {/* Steps */}
        <View style={{ gap: 10, marginTop: 8 }}>
          {steps.map((s, i) => (
            <Animated.View
              key={s}
              entering={FadeInLeft.duration(320).delay(360 + i * 70).springify()}
              style={sl.stepRow}
            >
              <View style={sl.stepCheck}><Text style={sl.stepCheckText}>✓</Text></View>
              <Text style={sl.checkLabel}>{i + 1}. {s}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 5 — HANDLUNG & VERTRAUEN
   "Kostenlos starten. Jederzeit upgraden."
   Pricing cards
══════════════════════════════════════════════ */
function Slide5() {
  const freeFeatures    = ["Basis-Ubersicht", "Einnahmen & Ausgaben", "Top-Steuertipps", "Begrenzte KI-Anfragen"];
  const premiumFeatures = ["Unbegrenzte KI", "Steuerprognosen", "Erweiterte Analysen", "Steuer-Check & Export"];
  return (
    <View style={[sl.root, { backgroundColor: BG }]}>
      <Animated.View entering={FadeInDown.duration(420)} style={sl.centerPad}>
        <Animated.Text entering={FadeInUp.duration(350).delay(80)} style={sl.overline}>
          HANDLUNG & VERTRAUEN
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(400).delay(140)} style={sl.headlineLg}>
          Kostenlos starten.{"\n"}
          <Text style={{ color: GREEN }}>Jederzeit upgraden.</Text>
        </Animated.Text>
        <Animated.Text entering={FadeInUp.duration(380).delay(200)} style={sl.bodyGray}>
          Teste alle Basis-Funktionen gratis. Upgrade, wenn du mehr willst.
        </Animated.Text>

        <Animated.View
          entering={FadeInUp.duration(500).delay(300).springify()}
          style={sl.pricingRow}
        >
          {/* Free */}
          <View style={[sl.pricingCard, { borderColor: "rgba(255,255,255,0.14)" }]}>
            <Text style={sl.pricingTier}>Kostenlos</Text>
            <Text style={sl.pricingPrice}>0 €</Text>
            {freeFeatures.map((f) => (
              <View key={f} style={sl.pricingFeat}>
                <Text style={{ color: GREEN, fontFamily: "Inter_700Bold", fontSize: 11 }}>✓</Text>
                <Text style={sl.pricingFeatText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Premium */}
          <View style={[sl.pricingCard, { borderColor: GREEN, backgroundColor: "rgba(61,181,74,0.07)" }]}>
            <View style={sl.premiumBadge}><Text style={sl.premiumBadgeText}>Premium</Text></View>
            <Text style={sl.pricingTier}>Premium</Text>
            <Text style={[sl.pricingPrice, { color: GREEN }]}>
              ab 2,99 €
              <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>/Monat</Text>
            </Text>
            {premiumFeatures.map((f) => (
              <View key={f} style={sl.pricingFeat}>
                <Text style={{ color: GREEN, fontFamily: "Inter_700Bold", fontSize: 11 }}>✓</Text>
                <Text style={sl.pricingFeatText}>{f}</Text>
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
   ANIMATED PROGRESS BAR
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
      <View style={{ flex: 1, backgroundColor: BG }}>
        <Animated.View key={slideIdx} style={{ flex: 1 }} entering={FadeIn.duration(260)}>
          <SlideComp />
        </Animated.View>

        {/* Bottom controls */}
        <View style={[ctrl.container, { paddingBottom: insets.bottom + 20 }]}>
          <View style={ctrl.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[ctrl.dot, {
                  backgroundColor: i === slideIdx ? GREEN : "rgba(255,255,255,0.28)",
                  width: i === slideIdx ? 22 : 8,
                }]}
              />
            ))}
          </View>
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
                  {isLastSlide ? "Los geht's!" : "Weiter"}
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
   STYLES
══════════════════════════════════════════════ */
const sl = StyleSheet.create({
  root: { flex: 1 },
  glow: { position: "absolute", bottom: 0, left: -40, width: W * 1.2, height: 200, borderRadius: 999, backgroundColor: "rgba(61,181,74,0.06)" },

  /* Shared typography */
  overline:   { color: "rgba(255,255,255,0.38)", fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 2.2, textTransform: "uppercase", marginBottom: 2 },
  headlineLg: { color: "#ffffff", fontFamily: "Inter_800ExtraBold", fontSize: 24, lineHeight: 30 },
  bodyGray:   { color: "rgba(255,255,255,0.58)", fontFamily: "Inter_500Medium", fontSize: 13, lineHeight: 19 },

  /* ── Slide 0 ── */
  s0Top:       { paddingTop: 52, paddingHorizontal: 28, gap: 6 },
  wordmark:    { flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 6 },
  taxWord:     { color: "#ffffff", fontFamily: "Inter_800ExtraBold", fontSize: 46, letterSpacing: -2, lineHeight: 48 },
  buddyWord:   { color: GREEN,    fontFamily: "Inter_400Regular",   fontSize: 46, letterSpacing: -2, lineHeight: 48 },
  s0Sub:       { color: "rgba(255,255,255,0.78)", fontFamily: "Inter_500Medium", fontSize: 14, lineHeight: 20 },
  checkRow:    { flexDirection: "row", alignItems: "center", gap: 10 },
  checkBadge:  { width: 22, height: 22, borderRadius: 11, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" },
  checkBadgeText: { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 11 },
  checkLabel:  { color: "rgba(255,255,255,0.80)", fontFamily: "Inter_600SemiBold", fontSize: 13 },
  s0MascotWrap: { position: "absolute", bottom: 0, left: -10, width: W * 0.58, height: H * 0.46 },
  s0Mascot:    { width: "100%", height: "100%" },

  /* ── Slide 1 ── */
  centerPad:   { flex: 1, paddingTop: 44, paddingHorizontal: 24, gap: 12 },
  phoneMock:   { backgroundColor: "#0E1E35", borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", gap: 0 },
  mockBar:     { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)" },
  mockBarText: { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_600SemiBold", fontSize: 11 },
  mockSection: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)", gap: 4 },
  mockSectionLabel: { color: "rgba(255,255,255,0.4)", fontFamily: "Inter_500Medium", fontSize: 11 },
  mockNumRow:  { flexDirection: "row", alignItems: "center", gap: 10 },
  mockNum:     { fontFamily: "Inter_800ExtraBold", fontSize: 22 },
  mockTag:     { backgroundColor: GREEN + "22", color: GREEN, fontFamily: "Inter_700Bold", fontSize: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  mockBar2:    { height: 4, backgroundColor: GREEN + "40", borderRadius: 2, marginTop: 4 },
  mockNav:     { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.07)" },
  mockNavItem: { alignItems: "center" },
  mockNavLabel: { color: "rgba(255,255,255,0.4)", fontFamily: "Inter_500Medium", fontSize: 10 },

  /* ── Slide 2 ── */
  s2Top:        { paddingTop: 52, paddingHorizontal: 28, gap: 6, width: "55%" },
  s2MascotWrap: { position: "absolute", bottom: 0, right: -10, width: W * 0.55, height: H * 0.56 },
  s2Mascot:     { width: "100%", height: "100%" },
  floatTag:     { position: "absolute", backgroundColor: "rgba(15,25,50,0.88)", borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, gap: 4, flexDirection: "row", alignItems: "flex-start", maxWidth: 120 },
  floatDot:     { width: 6, height: 6, borderRadius: 3, marginTop: 3 },
  floatLabel:   { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 10, lineHeight: 14, flex: 1 },

  /* ── Slide 3 ── */
  s3Top:        { paddingTop: 52, paddingHorizontal: 28, gap: 6 },
  s3MascotWrap: { position: "absolute", bottom: 0, right: -10, width: W * 0.52, height: H * 0.44 },
  s3Mascot:     { width: "100%", height: "100%" },

  /* ── Slide 4 timer ── */
  timerRing:    { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: GREEN, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(61,181,74,0.09)", alignSelf: "center" },
  timerNum:     { color: GREEN, fontFamily: "Inter_800ExtraBold", fontSize: 36, lineHeight: 38 },
  timerSec:     { color: "rgba(255,255,255,0.45)", fontFamily: "Inter_600SemiBold", fontSize: 10 },
  stepRow:      { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  stepCheck:    { width: 20, height: 20, borderRadius: 10, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" },
  stepCheckText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 10 },

  /* ── Slide 5 pricing ── */
  pricingRow:       { flexDirection: "row", gap: 10, width: "100%" },
  pricingCard:      { flex: 1, borderWidth: 1, borderRadius: 16, padding: 12, gap: 7, backgroundColor: "rgba(255,255,255,0.04)" },
  pricingTier:      { color: "rgba(255,255,255,0.42)", fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" },
  pricingPrice:     { color: "#fff", fontFamily: "Inter_800ExtraBold", fontSize: 19, lineHeight: 22 },
  pricingFeat:      { flexDirection: "row", alignItems: "center", gap: 6 },
  pricingFeatText:  { color: "rgba(255,255,255,0.65)", fontFamily: "Inter_500Medium", fontSize: 11, flex: 1 },
  premiumBadge:     { alignSelf: "flex-start", backgroundColor: GREEN, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  premiumBadgeText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 9 },
});

const ctrl = StyleSheet.create({
  container: { paddingHorizontal: 24, gap: 14, paddingTop: 10, backgroundColor: BG },
  dots:      { flexDirection: "row", justifyContent: "center", gap: 6, alignItems: "center" },
  dot:       { height: 8, borderRadius: 4 },
  row:       { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn:   { paddingHorizontal: 18, paddingVertical: 14 },
  backText:  { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  nextWrap:  { flex: 1 },
  nextBtn:   { height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  nextText:  { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 },
});

const prog = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.08)", overflow: "hidden" },
  fill:  { height: 4, borderRadius: 2, backgroundColor: BLUE },
});

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
