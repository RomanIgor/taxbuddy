import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
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

/* ─────────────── Config ─────────────── */

const REQUIRED_FIELDS: FieldKey[] = ["km"];

const FIELD_LABELS: Record<FieldKey, string> = {
  date:    "Datum",
  client:  "Kunde",
  purpose: "Reisezweck",
  from:    "Startort",
  to:      "Zielort",
  km:      "Kilometer",
};

const FIELD_EXAMPLES: Record<FieldKey, string> = {
  date:    "Datum, Date, Tag",
  client:  "Kunde, Client, Name",
  purpose: "Zweck, Anlass, Beschreibung",
  from:    "Von, Start, Startort",
  to:      "Nach, Ziel, Destination",
  km:      "km, Kilometer, Strecke",
};

const KEYWORDS: Record<FieldKey, string[]> = {
  date:    ["datum", "date", "tag", "dat", "fahrtdatum", "day"],
  client:  ["kunde", "client", "auftraggeber", "kontakt", "name", "company"],
  purpose: ["zweck", "reisezweck", "anlass", "beschreibung", "grund", "purpose", "note"],
  from:    ["von", "start", "startort", "abfahrt", "from", "herkunft", "ausgangsort"],
  to:      ["nach", "ziel", "zielort", "ankunft", "to", "destination", "fahrziel"],
  km:      ["km", "kilometer", "strecke", "entfernung", "distance", "kilo", "gefahren"],
};

/* ─────────────── Helpers ─────────────── */

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s_\-./]/g, "");
}

function autoMap(headers: string[]): Mapping {
  const m: Mapping = { date: "", client: "", purpose: "", from: "", to: "", km: "" };
  const used = new Set<string>();
  for (const field of Object.keys(KEYWORDS) as FieldKey[]) {
    for (const h of headers) {
      if (used.has(h)) continue;
      const n = normalize(h);
      if (KEYWORDS[field].some((kw) => n.includes(normalize(kw)) || normalize(kw).includes(n))) {
        m[field] = h;
        used.add(h);
        break;
      }
    }
  }
  return m;
}

function parseDate(raw: unknown): string {
  if (raw === null || raw === undefined || raw === "") return new Date().toISOString();
  const s = String(raw).trim();

  // Excel serial number — check range typical for dates (1900–2100)
  const num = parseFloat(s);
  if (!isNaN(num) && num > 40000 && num < 80000) {
    try {
      // Days since 1899-12-30
      const ms = (num - 25569) * 86400 * 1000;
      const d = new Date(ms);
      if (!isNaN(d.getTime())) return d.toISOString();
    } catch { /* fall through */ }
  }

  // DD.MM.YYYY
  const dmy = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (dmy) return new Date(`${dmy[3]}-${dmy[2].padStart(2,"0")}-${dmy[1].padStart(2,"0")}T00:00:00.000Z`).toISOString();

  // MM/DD/YYYY
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (mdy) return new Date(`${mdy[3]}-${mdy[1].padStart(2,"0")}-${mdy[2].padStart(2,"0")}T00:00:00.000Z`).toISOString();

  // ISO YYYY-MM-DD
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(`${iso[1]}-${iso[2]}-${iso[3]}T00:00:00.000Z`).toISOString();

  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function parseKm(raw: unknown): number {
  if (raw === null || raw === undefined) return 0;
  const s = String(raw).replace(",", ".").replace(/[^\d.]/g, "");
  return parseFloat(s) || 0;
}

async function readAsBase64(asset: DocumentPicker.DocumentPickerAsset): Promise<string> {
  if (Platform.OS === "web") {
    // On web, expo-file-system is unavailable. Use the browser File object instead.
    // expo-document-picker attaches the native File to the asset on web.
    const file = (asset as unknown as { file?: File }).file;
    if (!file) {
      // Fallback: fetch the blob URL
      const resp = await fetch(asset.uri);
      const blob = await resp.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1] ?? "");
        };
        reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
        reader.readAsDataURL(blob);
      });
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // result is "data:<mime>;base64,<data>"
        resolve(result.split(",")[1] ?? "");
      };
      reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
      reader.readAsDataURL(file);
    });
  }
  // Native: use expo-file-system (string literal avoids EncodingType enum being undefined)
  return FileSystem.readAsStringAsync(asset.uri, { encoding: "base64" as FileSystem.EncodingType });
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
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [mapping, setMapping] = useState<Mapping>({ date: "", client: "", purpose: "", from: "", to: "", km: "" });
  const [importedCount, setImportedCount] = useState(0);

  // Only required fields block proceeding
  const canProceed = REQUIRED_FIELDS.every((f) => mapping[f]);

  const buildTrip = useCallback((row: Record<string, unknown>) => {
    const km = parseKm(mapping.km ? row[mapping.km] : 0);
    return {
      date:    parseDate(mapping.date    ? row[mapping.date]    : null),
      client:  mapping.client  ? String(row[mapping.client]  ?? "").trim() || "Import" : "Import",
      purpose: mapping.purpose ? String(row[mapping.purpose] ?? "").trim() || "Import" : "Import",
      from:    mapping.from    ? String(row[mapping.from]    ?? "").trim() : "",
      to:      mapping.to      ? String(row[mapping.to]      ?? "").trim() : "",
      km,
      roundTrip: false,
      pauschale: km * LEGAL.kilometerpauschale,
    };
  }, [mapping]);

  const previewTrips = rows.slice(0, 5).map(buildTrip);

  const pickFile = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) { setLoading(false); return; }

      const asset = result.assets[0];
      if (!asset?.uri) throw new Error("Keine Datei ausgewählt.");

      // Read file as base64 — uses FileReader on web, expo-file-system on native
      let base64: string;
      try {
        base64 = await readAsBase64(asset);
      } catch (fsErr) {
        throw new Error("Datei konnte nicht gelesen werden. Bitte erneut versuchen.");
      }

      // Parse with xlsx
      let wb: XLSX.WorkBook;
      try {
        wb = XLSX.read(base64, { type: "base64", cellDates: false, raw: false });
      } catch {
        throw new Error("Dateiformat nicht erkannt. Bitte eine .xlsx, .xls oder .csv Datei verwenden.");
      }

      if (!wb.SheetNames.length) throw new Error("Die Datei enthält keine Tabellen.");

      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

      if (!jsonRows.length) throw new Error("Die Tabelle enthält keine Datenzeilen.");

      const hs = Object.keys(jsonRows[0]);
      if (!hs.length) throw new Error("Keine Spalten in der Datei gefunden.");

      setHeaders(hs);
      setRows(jsonRows);
      setMapping(autoMap(hs));
      setStep("map");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler beim Lesen der Datei.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    try {
      const valid = rows.map(buildTrip).filter((t) => t.km > 0);

      if (!valid.length) {
        setError(`Keine gültigen Fahrten gefunden. Stelle sicher, dass die Spalte "${FIELD_LABELS.km}" korrekt zugeordnet ist.`);
        setStep("map");
        setLoading(false);
        return;
      }

      for (const trip of valid as Omit<Trip, "id">[]) {
        await addTrip(trip);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setImportedCount(valid.length);
      setStep("done");
    } catch {
      setError("Fehler beim Speichern der Fahrten. Bitte versuche es erneut.");
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

      {/* Step indicator */}
      <View style={[styles.stepRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["pick", "map", "preview", "done"] as Step[]).map((s, i) => {
          const stepIndex = ["pick", "map", "preview", "done"].indexOf(step);
          const isActive = step === s;
          const isDone = stepIndex > i;
          return (
            <View key={s} style={styles.stepPill}>
              <View style={[styles.stepDot, {
                backgroundColor: isActive ? colors.primary : isDone ? colors.success : colors.muted,
              }]} />
              <Text style={[styles.stepLabel, { color: isActive ? colors.primary : colors.mutedForeground }]}>
                {["Datei", "Spalten", "Vorschau", "Fertig"][i]}
              </Text>
            </View>
          );
        })}
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
                {loading ? "Wird gelesen..." : "Excel oder CSV auswaehlen"}
              </Text>
              <Text style={[styles.dropSub, { color: colors.mutedForeground }]}>
                .xlsx · .xls · .csv{"\n"}Erste Zeile muss Spaltenbezeichnungen enthalten
              </Text>
            </Pressable>

            {error && <ErrorBox message={error} />}

            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.infoTitle, { color: colors.foreground }]}>Erwartete Spalten</Text>
              <Text style={[styles.infoSub, { color: colors.mutedForeground }]}>
                Spaltenbezeichnungen werden automatisch erkannt. Nur Kilometer ist Pflicht.
              </Text>
              {(Object.keys(FIELD_LABELS) as FieldKey[]).map((k) => (
                <View key={k} style={styles.infoRow}>
                  <View style={[styles.infoDot, { backgroundColor: REQUIRED_FIELDS.includes(k) ? colors.primary : colors.success }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.infoLabel, { color: colors.foreground }]}>
                      {FIELD_LABELS[k]}
                      {REQUIRED_FIELDS.includes(k) ? " *" : ""}
                    </Text>
                    <Text style={[styles.infoExample, { color: colors.mutedForeground }]}>{FIELD_EXAMPLES[k]}</Text>
                  </View>
                </View>
              ))}
              <Text style={[styles.infoSub, { color: colors.mutedForeground, marginTop: 4 }]}>* Pflichtfeld</Text>
            </View>
          </View>
        )}

        {/* ── Step 2: Map ── */}
        {step === "map" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {rows.length} Zeilen gefunden
            </Text>
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
              Ordne die Spalten aus deiner Datei den Feldern zu. Felder ohne Zuordnung werden mit Standardwerten belegt.
            </Text>

            {(Object.keys(KEYWORDS) as FieldKey[]).map((field) => {
              const isRequired = REQUIRED_FIELDS.includes(field);
              const isMapped = Boolean(mapping[field]);
              return (
                <View key={field} style={[styles.mapCard, { backgroundColor: colors.card, borderColor: isMapped ? colors.success : (isRequired ? "#FCA5A5" : colors.border) }]}>
                  <View style={styles.mapLabelRow}>
                    <Text style={[styles.mapLabel, { color: colors.foreground }]}>
                      {FIELD_LABELS[field]}{isRequired ? " *" : ""}
                    </Text>
                    <Feather
                      name={isMapped ? "check-circle" : isRequired ? "alert-circle" : "minus-circle"}
                      size={15}
                      color={isMapped ? colors.success : isRequired ? "#EF4444" : colors.mutedForeground}
                    />
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.chipRow}>
                      <Pressable
                        onPress={() => { Haptics.selectionAsync(); updateMapping(field, ""); }}
                        style={[styles.chip, {
                          backgroundColor: !mapping[field] ? colors.muted : colors.background,
                          borderColor: !mapping[field] ? colors.primary : colors.border,
                        }]}
                      >
                        <Text style={[styles.chipText, { color: !mapping[field] ? colors.primary : colors.mutedForeground }]}>
                          -- keine --
                        </Text>
                      </Pressable>
                      {headers.map((h) => (
                        <Pressable
                          key={h}
                          onPress={() => { Haptics.selectionAsync(); updateMapping(field, h); }}
                          style={[styles.chip, {
                            backgroundColor: mapping[field] === h ? colors.primary : colors.background,
                            borderColor: mapping[field] === h ? colors.primary : colors.border,
                          }]}
                        >
                          <Text style={[styles.chipText, { color: mapping[field] === h ? colors.primaryForeground : colors.foreground }]}>
                            {h}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                  {!isMapped && !isRequired && (
                    <Text style={[styles.fallbackNote, { color: colors.mutedForeground }]}>
                      Kein Pflichtfeld — wird als leer importiert
                    </Text>
                  )}
                </View>
              );
            })}

            {error && <ErrorBox message={error} />}
          </View>
        )}

        {/* ── Step 3: Preview ── */}
        {step === "preview" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Vorschau: erste {previewTrips.length} von {rows.length} Fahrten
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
                      {t.from || "—"} -> {t.to || "—"}
                    </Text>
                    <Text style={[styles.previewSub, { color: colors.mutedForeground }]}>
                      {t.purpose} · {new Date(t.date).toLocaleDateString("de-DE")}
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
            {rows.filter((r) => parseKm(mapping.km ? r[mapping.km] : 0) === 0).length > 0 && (
              <View style={[styles.warnBox, { backgroundColor: "#FEF9C3", borderColor: "#FDE047" }]}>
                <Feather name="alert-triangle" size={14} color="#A16207" />
                <Text style={[styles.warnText, { color: "#A16207" }]}>
                  {rows.filter((r) => parseKm(mapping.km ? r[mapping.km] : 0) === 0).length} Zeilen haben keine Kilometerangabe und werden übersprungen.
                </Text>
              </View>
            )}
            {error && <ErrorBox message={error} />}
          </View>
        )}

        {/* ── Step 4: Done ── */}
        {step === "done" && (
          <View style={[styles.doneBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.doneIcon, { backgroundColor: "#D1FAE5" }]}>
              <Feather name="check-circle" size={36} color="#059669" />
            </View>
            <Text style={[styles.doneTitle, { color: colors.foreground }]}>Import erfolgreich</Text>
            <Text style={[styles.doneSub, { color: colors.mutedForeground }]}>
              {importedCount} {importedCount === 1 ? "Fahrt wurde" : "Fahrten wurden"} in dein Fahrtenbuch importiert.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {step === "map" && (
          <View style={styles.footerRow}>
            <Pressable onPress={() => { setError(null); setStep("pick"); }} style={[styles.btnSecondary, { borderColor: colors.border, borderRadius: colors.radius }]}>
              <Text style={[styles.btnSecondaryText, { color: colors.foreground }]}>Zurueck</Text>
            </Pressable>
            <Pressable
              onPress={() => { setError(null); setStep("preview"); }}
              disabled={!canProceed}
              style={({ pressed }) => [
                styles.btnPrimary,
                { backgroundColor: canProceed ? colors.primary : colors.muted, borderRadius: colors.radius, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.btnPrimaryText, { color: canProceed ? colors.primaryForeground : colors.mutedForeground }]}>
                Vorschau anzeigen
              </Text>
            </Pressable>
          </View>
        )}

        {step === "preview" && (
          <View style={styles.footerRow}>
            <Pressable onPress={() => { setError(null); setStep("map"); }} style={[styles.btnSecondary, { borderColor: colors.border, borderRadius: colors.radius }]}>
              <Text style={[styles.btnSecondaryText, { color: colors.foreground }]}>Zurueck</Text>
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
            <Text style={styles.btnPrimaryText}>Zurueck zum Fahrtenbuch</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* ─────────────── ErrorBox ─────────────── */

function ErrorBox({ message }: { message: string }) {
  return (
    <View style={[errorStyles.box, { backgroundColor: "#FEE2E2" }]}>
      <Feather name="alert-circle" size={15} color="#DC2626" />
      <Text style={errorStyles.text}>{message}</Text>
    </View>
  );
}

const errorStyles = StyleSheet.create({
  box:  { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 10 },
  text: { color: "#DC2626", fontFamily: "Inter_500Medium", fontSize: 13, flex: 1, lineHeight: 18 },
});

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
  sectionTitle:   { fontSize: 15, fontFamily: "Inter_700Bold" },
  sectionSub:     { fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 18 },

  dropZone:       { borderWidth: 2, borderStyle: "dashed", borderRadius: 18, alignItems: "center", gap: 10, padding: 32 },
  dropIcon:       { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  dropTitle:      { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  dropSub:        { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center", lineHeight: 18 },

  infoCard:       { borderWidth: 1, borderRadius: 14, padding: 16, gap: 10 },
  infoTitle:      { fontSize: 14, fontFamily: "Inter_700Bold" },
  infoSub:        { fontSize: 12, fontFamily: "Inter_500Medium", lineHeight: 16 },
  infoRow:        { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  infoDot:        { width: 7, height: 7, borderRadius: 4, marginTop: 5 },
  infoLabel:      { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  infoExample:    { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 1 },

  mapCard:        { borderWidth: 1.5, borderRadius: 14, padding: 14, gap: 10 },
  mapLabelRow:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  mapLabel:       { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  chipRow:        { flexDirection: "row", gap: 8, paddingRight: 20 },
  chip:           { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  chipText:       { fontSize: 12, fontFamily: "Inter_500Medium" },
  fallbackNote:   { fontSize: 11, fontFamily: "Inter_500Medium", fontStyle: "italic" },

  previewCard:    { borderWidth: 1, borderRadius: 14, padding: 14 },
  previewRow:     { flexDirection: "row", alignItems: "center", gap: 12 },
  previewIcon:    { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  previewTitle:   { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  previewSub:     { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2, lineHeight: 16 },
  previewKm:      { fontSize: 15, fontFamily: "Inter_700Bold" },
  moreText:       { fontSize: 13, fontFamily: "Inter_500Medium", textAlign: "center" },

  warnBox:        { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  warnText:       { fontSize: 12, fontFamily: "Inter_500Medium", flex: 1, lineHeight: 17 },

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
