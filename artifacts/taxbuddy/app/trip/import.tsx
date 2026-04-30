import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useTrips } from "@/contexts/TripsContext";
import { LEGAL } from "@/constants/legal";
import { Trip } from "@/types";

/* ─────────────── Types ─────────────── */

type FieldKey = "date" | "client" | "purpose" | "from" | "to" | "km";
type Step = "pick" | "map" | "preview" | "done";

interface Mapping {
  date: string;
  client: string;
  purpose: string;
  from: string;
  to: string;
  km: string;
}

/* ─────────────── Auto-mapping keywords ─────────────── */

const KEYWORDS: Record<FieldKey, string[]> = {
  date:    ["datum", "date", "tag", "dat", "fahrtdatum", "day"],
  client:  ["kunde", "client", "auftraggeber", "kontakt", "name", "company"],
  purpose: ["zweck", "reisezweck", "anlass", "beschreibung", "grund", "purpose", "note"],
  from:    ["von", "start", "startort", "abfahrt", "from", "herkunft", "ausgangsort"],
  to:      ["nach", "ziel", "zielort", "ankunft", "to", "destination", "fahrziel"],
  km:      ["km", "kilometer", "strecke", "entfernung", "distance", "kilo", "gefahren"],
};

const FIELD_LABELS: Record<FieldKey, string> = {
  date:    "Datum",
  client:  "Kunde",
  purpose: "Reisezweck",
  from:    "Startort",
  to:      "Zielort",
  km:      "Kilometer",
};

/* ─────────────── Helpers ─────────────── */

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s_\-./äöüß]/g, "");
}

function autoMap(headers: string[]): Mapping {
  const m: Mapping = { date: "", client: "", purpose: "", from: "", to: "", km: "" };
  const used = new Set<string>();
  for (const field of Object.keys(KEYWORDS) as FieldKey[]) {
    for (const h of headers) {
      if (used.has(h)) continue;
      const n = normalize(h);
      if (KEYWORDS[field].some((kw) => n.includes(kw) || kw.includes(n))) {
        m[field] = h;
        used.add(h);
        break;
      }
    }
  }
  return m;
}

function parseDate(raw: string): string {
  if (!raw) return new Date().toISOString();
  const s = String(raw).trim();
  const patterns = [
    { re: /^(\d{4})-(\d{2})-(\d{2})/, fn: (m: RegExpMatchArray) => `${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z` },
    { re: /^(\d{2})\.(\d{2})\.(\d{4})/, fn: (m: RegExpMatchArray) => `${m[3]}-${m[2]}-${m[1]}T00:00:00.000Z` },
    { re: /^(\d{2})\/(\d{2})\/(\d{4})/, fn: (m: RegExpMatchArray) => `${m[3]}-${m[1]}-${m[2]}T00:00:00.000Z` },
  ];
  for (const { re, fn } of patterns) {
    const match = s.match(re);
    if (match) return fn(match);
  }
  // Excel serial
  const num = parseFloat(s);
  if (!isNaN(num) && num > 1000) {
    const d = XLSX.SSF.parse_date_code(num);
    if (d) return new Date(d.y, d.m - 1, d.d).toISOString();
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/* ─────────────── Component ─────────────── */

export default function TripImportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addTrip } = useTrips();

  const [step, setStep] = useState<Step>("pick");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Mapping>({ date: "", client: "", purpose: "", from: "", to: "", km: "" });
  const [importedCount, setImportedCount] = useState(0);

  const allMapped = (Object.keys(KEYWORDS) as FieldKey[]).every((f) => mapping[f]);

  const previewTrips = rows.slice(0, 5).map((row) => ({
    date:    parseDate(String(row[mapping.date] ?? "")),
    client:  String(row[mapping.client]  ?? "").trim() || "—",
    purpose: String(row[mapping.purpose] ?? "").trim() || "—",
    from:    String(row[mapping.from]    ?? "").trim(),
    to:      String(row[mapping.to]      ?? "").trim(),
    km:      parseFloat(String(row[mapping.km] ?? "0").replace(",", ".")) || 0,
  }));

  const pickFile = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        copyToCacheDirectory: true,
      });
      if (result.canceled) { setLoading(false); return; }

      const uri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const wb = XLSX.read(base64, { type: "base64", cellDates: false, raw: false });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonRows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

      if (!jsonRows.length) throw new Error("Die Datei enthält keine Daten.");

      const hs = Object.keys(jsonRows[0]);
      setHeaders(hs);
      setRows(jsonRows);
      setMapping(autoMap(hs));
      setStep("map");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Datei konnte nicht gelesen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImport = async () => {
    setLoading(true);
    try {
      const valid: Omit<Trip, "id">[] = rows
        .map((row) => {
          const km = parseFloat(String(row[mapping.km] ?? "0").replace(",", ".")) || 0;
          return {
            date:      parseDate(String(row[mapping.date] ?? "")),
            client:    String(row[mapping.client]  ?? "").trim() || "Import",
            purpose:   String(row[mapping.purpose] ?? "").trim() || "Import",
            from:      String(row[mapping.from]    ?? "").trim(),
            to:        String(row[mapping.to]      ?? "").trim(),
            km,
            roundTrip: false,
            pauschale: km * LEGAL.kilometerpauschale,
          };
        })
        .filter((t) => t.km > 0);

      if (!valid.length) {
        setError("Keine gültigen Fahrten gefunden. Prüfe die Spaltenzuordnung.");
        setStep("map");
        setLoading(false);
        return;
      }

      for (const trip of valid) {
        await addTrip(trip);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setImportedCount(valid.length);
      setStep("done");
    } catch {
      setError("Fehler beim Import. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  const updateMapping = (field: FieldKey, value: string) => {
    setMapping((m) => ({ ...m, [field]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.navHeader, { paddingTop: insets.top + 12, borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>Excel importieren</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step pills */}
      <View style={[styles.stepRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["pick", "map", "preview", "done"] as Step[]).map((s, i) => (
          <View key={s} style={styles.stepPill}>
            <View style={[styles.stepDot, { backgroundColor: step === s ? colors.primary : (["map", "preview", "done"].indexOf(step) > i ? colors.success : colors.muted) }]} />
            <Text style={[styles.stepLabel, { color: step === s ? colors.primary : colors.mutedForeground }]}>
              {["Datei", "Spalten", "Vorschau", "Fertig"][i]}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}>

        {/* ── Step 1: Pick ── */}
        {step === "pick" && (
          <View style={styles.section}>
            <Pressable
              onPress={pickFile}
              disabled={loading}
              style={({ pressed }) => [
                styles.dropZone,
                { borderColor: loading ? colors.primary : colors.border, backgroundColor: colors.card, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <View style={[styles.dropIcon, { backgroundColor: colors.muted }]}>
                  <Feather name="file-text" size={28} color={colors.primary} />
                </View>
              )}
              <Text style={[styles.dropTitle, { color: colors.foreground }]}>
                {loading ? "Wird gelesen…" : "Excel oder CSV auswählen"}
              </Text>
              <Text style={[styles.dropSub, { color: colors.mutedForeground }]}>
                .xlsx · .xls · .csv — erste Zeile muss Spaltenköpfe enthalten
              </Text>
            </Pressable>

            {error && (
              <View style={[styles.errorBox, { backgroundColor: "#FEE2E2" }]}>
                <Feather name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.infoTitle, { color: colors.foreground }]}>Erwartete Spalten</Text>
              {(Object.entries(FIELD_LABELS) as [FieldKey, string][]).map(([k, label]) => (
                <View key={k} style={styles.infoRow}>
                  <View style={[styles.infoDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                    <Text style={{ color: colors.foreground }}>{label}</Text>
                    {" - z. B. \""}{KEYWORDS[k][0]}{"\" or \""}{KEYWORDS[k][1] ?? KEYWORDS[k][0]}{"\""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Step 2: Map columns ── */}
        {step === "map" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {rows.length} Zeilen gefunden · Spalten zuordnen
            </Text>
            {(Object.keys(KEYWORDS) as FieldKey[]).map((field) => (
              <View key={field} style={styles.mapRow}>
                <View style={styles.mapLabelRow}>
                  <Text style={[styles.mapLabel, { color: colors.foreground }]}>{FIELD_LABELS[field]}</Text>
                  <Feather
                    name={mapping[field] ? "check-circle" : "alert-circle"}
                    size={14}
                    color={mapping[field] ? colors.success : colors.warning}
                  />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  <View style={styles.chipRow}>
                    {["", ...headers].map((h) => (
                      <Pressable
                        key={h || "__none__"}
                        onPress={() => { Haptics.selectionAsync(); updateMapping(field, h); }}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: mapping[field] === h ? colors.primary : colors.muted,
                            borderColor: mapping[field] === h ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.chipText, { color: mapping[field] === h ? colors.primaryForeground : colors.foreground }]}>
                          {h || "— keine —"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}

            {error && (
              <View style={[styles.errorBox, { backgroundColor: "#FEE2E2" }]}>
                <Feather name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Step 3: Preview ── */}
        {step === "preview" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Vorschau der ersten {previewTrips.length} von {rows.length} Fahrten
            </Text>
            {previewTrips.map((t, i) => (
              <View key={i} style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.previewRow}>
                  <View style={[styles.previewIcon, { backgroundColor: colors.muted }]}>
                    <Feather name="navigation" size={16} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.previewTitle, { color: colors.foreground }]}>{t.client}</Text>
                    <Text style={[styles.previewSub, { color: colors.mutedForeground }]}>
                      {t.from || "—"} → {t.to || "—"} · {t.purpose}
                    </Text>
                    <Text style={[styles.previewSub, { color: colors.mutedForeground }]}>
                      {new Date(t.date).toLocaleDateString("de-DE")}
                    </Text>
                  </View>
                  <Text style={[styles.previewKm, { color: colors.foreground }]}>{t.km} km</Text>
                </View>
              </View>
            ))}
            {rows.length > 5 && (
              <Text style={[styles.moreText, { color: colors.mutedForeground }]}>
                + {rows.length - 5} weitere Fahrten
              </Text>
            )}
          </View>
        )}

        {/* ── Step 4: Done ── */}
        {step === "done" && (
          <View style={[styles.doneBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.doneIcon, { backgroundColor: "#D1FAE5" }]}>
              <Feather name="check-circle" size={36} color="#059669" />
            </View>
            <Text style={[styles.doneTitle, { color: colors.foreground }]}>Import erfolgreich!</Text>
            <Text style={[styles.doneSub, { color: colors.mutedForeground }]}>
              {importedCount} Fahrten wurden in dein Fahrtenbuch importiert.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Footer buttons */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {step === "map" && (
          <View style={styles.footerRow}>
            <Pressable onPress={() => setStep("pick")} style={[styles.btnSecondary, { borderColor: colors.border, borderRadius: colors.radius }]}>
              <Text style={[styles.btnSecondaryText, { color: colors.foreground }]}>Zurück</Text>
            </Pressable>
            <Pressable
              onPress={() => { setError(null); setStep("preview"); }}
              disabled={!allMapped}
              style={({ pressed }) => [
                styles.btnPrimary,
                { backgroundColor: allMapped ? colors.primary : colors.muted, borderRadius: colors.radius, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.btnPrimaryText, { color: allMapped ? colors.primaryForeground : colors.mutedForeground }]}>
                Vorschau
              </Text>
            </Pressable>
          </View>
        )}

        {step === "preview" && (
          <View style={styles.footerRow}>
            <Pressable onPress={() => setStep("map")} style={[styles.btnSecondary, { borderColor: colors.border, borderRadius: colors.radius }]}>
              <Text style={[styles.btnSecondaryText, { color: colors.foreground }]}>Zurück</Text>
            </Pressable>
            <Pressable
              onPress={handleImport}
              disabled={loading}
              style={({ pressed }) => [
                styles.btnPrimary,
                { backgroundColor: "#3DB54A", borderRadius: colors.radius, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              {loading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.btnPrimaryText}>{rows.length} Fahrten importieren</Text>}
            </Pressable>
          </View>
        )}

        {step === "done" && (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.btnPrimary,
              styles.btnFull,
              { backgroundColor: colors.primary, borderRadius: colors.radius, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.btnPrimaryText}>Zurück zum Fahrtenbuch</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* ─────────────── Styles ─────────────── */

const styles = StyleSheet.create({
  container:      { flex: 1 },
  navHeader:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn:        { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  navTitle:       { fontSize: 17, fontFamily: "Inter_700Bold" },
  stepRow:        { flexDirection: "row", paddingHorizontal: 20, paddingVertical: 12, gap: 8, borderBottomWidth: 1 },
  stepPill:       { flex: 1, alignItems: "center", gap: 4 },
  stepDot:        { width: 8, height: 8, borderRadius: 4 },
  stepLabel:      { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  scroll:         { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  section:        { gap: 14 },
  sectionTitle:   { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  dropZone:       { borderWidth: 2, borderStyle: "dashed", borderRadius: 18, alignItems: "center", gap: 10, padding: 32 },
  dropIcon:       { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  dropTitle:      { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  dropSub:        { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },

  errorBox:       { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10 },
  errorText:      { color: "#DC2626", fontFamily: "Inter_500Medium", fontSize: 13, flex: 1 },

  infoCard:       { borderWidth: 1, borderRadius: 14, padding: 16, gap: 10 },
  infoTitle:      { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 2 },
  infoRow:        { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  infoDot:        { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  infoText:       { fontSize: 12, fontFamily: "Inter_500Medium", flex: 1, lineHeight: 18 },

  mapRow:         { gap: 8 },
  mapLabelRow:    { flexDirection: "row", alignItems: "center", gap: 6 },
  mapLabel:       { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  chipScroll:     { flexGrow: 0 },
  chipRow:        { flexDirection: "row", gap: 8, paddingRight: 20 },
  chip:           { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  chipText:       { fontSize: 12, fontFamily: "Inter_500Medium" },

  previewCard:    { borderWidth: 1, borderRadius: 14, padding: 14 },
  previewRow:     { flexDirection: "row", alignItems: "center", gap: 12 },
  previewIcon:    { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  previewTitle:   { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  previewSub:     { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 1 },
  previewKm:      { fontSize: 15, fontFamily: "Inter_700Bold" },
  moreText:       { fontSize: 13, fontFamily: "Inter_500Medium", textAlign: "center" },

  doneBox:        { borderWidth: 1, borderRadius: 18, padding: 32, alignItems: "center", gap: 14, marginTop: 20 },
  doneIcon:       { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  doneTitle:      { fontSize: 20, fontFamily: "Inter_700Bold" },
  doneSub:        { fontSize: 14, fontFamily: "Inter_500Medium", textAlign: "center", lineHeight: 20 },

  footer:         { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1 },
  footerRow:      { flexDirection: "row", gap: 12 },
  btnPrimary:     { flex: 1, height: 52, alignItems: "center", justifyContent: "center" },
  btnPrimaryText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  btnSecondary:   { height: 52, paddingHorizontal: 20, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  btnSecondaryText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  btnFull:        { width: "100%" },
});
