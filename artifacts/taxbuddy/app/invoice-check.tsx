import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";

const CHECKLIST = [
  "Vollständiger Name & Anschrift des Leistenden",
  "Vollständiger Name & Anschrift des Leistungsempfängers",
  "Steuernummer oder USt-IdNr.",
  "Rechnungsnummer (fortlaufend, einmalig)",
  "Rechnungsdatum",
  "Leistungs- bzw. Lieferzeitpunkt",
  "Menge / Art der Leistung",
  "Entgelt nach Steuersätzen aufgeschlüsselt",
  "Anzuwendender Steuersatz / Steuerbetrag",
  "Hinweis bei Steuerbefreiung (z. B. § 19 UStG)",
];

type CheckResult = { item: string; status: "ok" | "warn" | "fail" };

function fakeCheck(): CheckResult[] {
  return CHECKLIST.map((item, i) => ({
    item,
    status: i === 5 ? "warn" : i === 9 ? "fail" : "ok",
  }));
}

export default function InvoiceCheckScreen() {
  const colors = useColors();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [results, setResults] = useState<CheckResult[] | null>(null);

  const pickImage = async () => {
    Haptics.selectionAsync();
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!r.canceled && r.assets[0]) {
      setImageUri(r.assets[0].uri);
      setTimeout(() => {
        setResults(fakeCheck());
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 700);
    }
  };

  const takePhoto = async () => {
    Haptics.selectionAsync();
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const r = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });
    if (!r.canceled && r.assets[0]) {
      setImageUri(r.assets[0].uri);
      setTimeout(() => {
        setResults(fakeCheck());
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 700);
    }
  };

  const okCount = results?.filter((r) => r.status === "ok").length ?? 0;
  const verdict =
    results == null
      ? null
      : okCount === CHECKLIST.length
        ? { tone: "ok", text: "Alle Pflichtangaben vorhanden – sieht sauber aus." }
        : okCount >= 8
          ? { tone: "warn", text: "Kleine Lücken – bitte ergänzen lassen." }
          : { tone: "fail", text: "Mehrere Pflichtangaben fehlen – nachbessern." };

  const toneColor = (s: string) =>
    s === "ok" ? colors.success : s === "warn" ? colors.warning : colors.critical;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.intro, { color: colors.mutedForeground }]}>
        Prüfe einen Beleg auf die 10 Pflichtangaben gemäß § 14 UStG. TAXbuddy
        spielt eine plausible Voll-Prüfung – ersetzt keinen Steuerberater.
      </Text>

      <View style={styles.actionRow}>
        <Pressable
          onPress={takePhoto}
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="camera" size={18} color={colors.primaryForeground} />
          <Text
            style={{
              color: colors.primaryForeground,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Foto
          </Text>
        </Pressable>
        <Pressable
          onPress={pickImage}
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="image" size={18} color={colors.foreground} />
          <Text
            style={{
              color: colors.foreground,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Aus Galerie
          </Text>
        </Pressable>
      </View>

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.preview,
            { borderColor: colors.border, borderRadius: colors.radius },
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="file-text" size={32} color={colors.mutedForeground} />
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: "Inter_500Medium",
              marginTop: 8,
            }}
          >
            Noch kein Beleg gewählt
          </Text>
        </View>
      )}

      {verdict ? (
        <View
          style={[
            styles.verdict,
            {
              backgroundColor: toneColor(verdict.tone) + "22",
              borderColor: toneColor(verdict.tone),
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather
            name={
              verdict.tone === "ok"
                ? "check-circle"
                : verdict.tone === "warn"
                  ? "alert-triangle"
                  : "x-circle"
            }
            size={20}
            color={toneColor(verdict.tone)}
          />
          <Text
            style={{
              color: toneColor(verdict.tone),
              fontFamily: "Inter_600SemiBold",
              flex: 1,
            }}
          >
            {verdict.text}
          </Text>
        </View>
      ) : null}

      {results ? (
        <View
          style={[
            styles.checklist,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          {results.map((r) => (
            <View key={r.item} style={styles.checkRow}>
              <Feather
                name={
                  r.status === "ok"
                    ? "check"
                    : r.status === "warn"
                      ? "alert-circle"
                      : "x"
                }
                size={18}
                color={toneColor(r.status)}
              />
              <Text
                style={{
                  color: colors.foreground,
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  flex: 1,
                }}
              >
                {r.item}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 60,
  },
  intro: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Inter_500Medium",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  preview: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderWidth: 1,
  },
  placeholder: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  verdict: {
    flexDirection: "row",
    padding: 14,
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  checklist: {
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
