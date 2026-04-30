import { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { Trip } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ─────────────── Types ─────────────── */

type FieldKey = "date" | "from" | "to" | "km" | "purpose";

interface Mapping {
  date: string;
  from: string;
  to: string;
  km: string;
  purpose: string;
}

interface ParsedSheet {
  headers: string[];
  rows: Record<string, string>[];
}

/* ─────────────── Auto-mapping heuristics ─────────────── */

const KEYWORDS: Record<FieldKey, string[]> = {
  date:    ["datum", "date", "tag", "dat", "day", "fahrtdatum"],
  from:    ["von", "start", "startort", "abfahrt", "abfahrtsort", "from", "herkunft", "abgangsort", "ausgangsort"],
  to:      ["nach", "ziel", "zielort", "ankunft", "to", "destination", "fahrziel"],
  km:      ["km", "kilometer", "strecke", "entfernung", "distance", "kilo", "gefahren"],
  purpose: ["zweck", "reisezweck", "anlass", "beschreibung", "verwendungszweck", "purpose", "grund", "note", "notiz"],
};

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s_\-./äöü]/g, "");
}

function autoMap(headers: string[]): Mapping {
  const mapping: Mapping = { date: "", from: "", to: "", km: "", purpose: "" };
  const used = new Set<string>();

  for (const field of Object.keys(KEYWORDS) as FieldKey[]) {
    for (const h of headers) {
      if (used.has(h)) continue;
      const norm = normalize(h);
      if (KEYWORDS[field].some(kw => norm.includes(kw) || kw.includes(norm))) {
        mapping[field] = h;
        used.add(h);
        break;
      }
    }
  }
  return mapping;
}

/* ─────────────── Date parsing ─────────────── */

function parseDate(raw: string): string {
  if (!raw) return "";
  const s = String(raw).trim();

  // Try various formats
  const patterns = [
    { re: /^(\d{4})-(\d{2})-(\d{2})/, fn: (m: RegExpMatchArray) => `${m[1]}-${m[2]}-${m[3]}` },
    { re: /^(\d{2})\.(\d{2})\.(\d{4})/, fn: (m: RegExpMatchArray) => `${m[3]}-${m[2]}-${m[1]}` },
    { re: /^(\d{2})\/(\d{2})\/(\d{4})/, fn: (m: RegExpMatchArray) => `${m[3]}-${m[1]}-${m[2]}` },
  ];

  for (const { re, fn } of patterns) {
    const m = s.match(re);
    if (m) return fn(m);
  }

  // Excel serial number (days since 1900-01-01)
  const num = parseFloat(s);
  if (!isNaN(num) && num > 1000) {
    const d = XLSX.SSF.parse_date_code(num);
    if (d) return `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}`;
  }

  // Last-ditch: JS Date
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);

  return s;
}

/* ─────────────── Excel parser ─────────────── */

function parseExcel(file: File): Promise<ParsedSheet> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array", cellDates: false, raw: false });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonRows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
        if (!jsonRows.length) { reject(new Error("Die Datei enthält keine Daten.")); return; }
        const headers = Object.keys(jsonRows[0]);
        resolve({ headers, rows: jsonRows });
      } catch {
        reject(new Error("Datei konnte nicht gelesen werden. Bitte Excel oder CSV verwenden."));
      }
    };
    reader.onerror = () => reject(new Error("Fehler beim Lesen der Datei."));
    reader.readAsArrayBuffer(file);
  });
}

/* ─────────────── Field labels ─────────────── */

const FIELD_LABELS: Record<FieldKey, string> = {
  date:    "Datum",
  from:    "Von (Startort)",
  to:      "Nach (Zielort)",
  km:      "Kilometer",
  purpose: "Reisezweck",
};

/* ─────────────── Main component ─────────────── */

interface FahrtImportProps {
  onImport: (trips: Omit<Trip, "id">[]) => void;
}

export function FahrtImport({ onImport }: FahrtImportProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "map" | "preview">("upload");
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed] = useState<ParsedSheet | null>(null);
  const [mapping, setMapping] = useState<Mapping>({ date: "", from: "", to: "", km: "", purpose: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const sheet = await parseExcel(file);
      setParsed(sheet);
      setMapping(autoMap(sheet.headers));
      setStep("map");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const mappingComplete = (Object.keys(KEYWORDS) as FieldKey[]).every(f => mapping[f]);

  const previewRows = parsed?.rows.slice(0, 5).map(row => ({
    date:    parseDate(String(row[mapping.date] ?? "")),
    from:    String(row[mapping.from] ?? ""),
    to:      String(row[mapping.to]   ?? ""),
    km:      parseFloat(String(row[mapping.km] ?? "0").replace(",", ".")) || 0,
    purpose: String(row[mapping.purpose] ?? ""),
  })) ?? [];

  const handleImport = () => {
    if (!parsed) return;
    const trips: Omit<Trip, "id">[] = parsed.rows
      .map(row => ({
        date:    parseDate(String(row[mapping.date] ?? "")),
        from:    String(row[mapping.from] ?? "").trim(),
        to:      String(row[mapping.to]   ?? "").trim(),
        km:      parseFloat(String(row[mapping.km] ?? "0").replace(",", ".")) || 0,
        purpose: String(row[mapping.purpose] ?? "").trim(),
      }))
      .filter(t => t.date && t.from && t.to && t.km > 0);

    if (!trips.length) {
      setError("Keine gültigen Fahrten gefunden. Prüfe die Spaltenzuordnung.");
      setStep("map");
      return;
    }

    onImport(trips);
    toast({
      title: "Import erfolgreich",
      description: `${trips.length} Fahrten wurden importiert.`,
    });
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep("upload");
      setParsed(null);
      setMapping({ date: "", from: "", to: "", km: "", purpose: "" });
      setError(null);
    }, 300);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-[#0066B3] text-[#0066B3] hover:bg-[#0066B3]/5 gap-2"
      >
        <FileSpreadsheet size={16} /> Excel importieren
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-2xl">
          {/* Step indicators */}
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-[#0066B3]" />
              Fahrten aus Excel importieren
            </DialogTitle>
            <DialogDescription>
              Importiere Fahrten direkt aus einer Excel- oder CSV-Datei.
            </DialogDescription>
          </DialogHeader>

          {/* Step pills */}
          <div className="flex items-center gap-2 text-xs font-medium py-1">
            {[["upload", "1. Datei"], ["map", "2. Spalten"], ["preview", "3. Vorschau"]].map(([s, label], i, arr) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full ${step === s ? "bg-[#0066B3] text-white" : "bg-muted text-muted-foreground"}`}>
                  {label}
                </span>
                {i < arr.length - 1 && <ChevronRight size={12} className="text-muted-foreground" />}
              </div>
            ))}
          </div>

          {/* ── Step 1: Upload ── */}
          {step === "upload" && (
            <div className="py-2">
              <div
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${dragging ? "border-[#0066B3] bg-[#0066B3]/5" : "border-border hover:border-[#0066B3]/50"}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-[#0066B3]/10 flex items-center justify-center">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#0066B3] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload size={22} className="text-[#0066B3]" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#0F2B4C]">
                    {loading ? "Datei wird verarbeitet..." : "Datei hochladen oder per Drag & Drop ablegen"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">.xlsx, .xls, .csv — erste Zeile muss Spaltenköpfe enthalten</p>
                </div>
                {!loading && (
                  <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                    Datei auswählen
                  </Button>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} className="flex-shrink-0" /> {error}
                </div>
              )}

              <div className="mt-4 bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-[#0F2B4C] text-sm mb-2">Erwartete Spalten (Namen werden automatisch erkannt):</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(FIELD_LABELS).map(([k, label]) => (
                    <div key={k} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0066B3]" />
                      <span><strong>{label}</strong> — z.B. "{KEYWORDS[k as FieldKey][0]}", "{KEYWORDS[k as FieldKey][1] ?? ""}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Column mapping ── */}
          {step === "map" && parsed && (
            <div className="py-2 space-y-4">
              <p className="text-sm text-muted-foreground">
                {parsed.headers.length} Spalten gefunden, {parsed.rows.length} Zeilen. Prüfe die automatische Zuordnung und korrigiere sie bei Bedarf.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(KEYWORDS) as FieldKey[]).map(field => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F2B4C] flex items-center gap-1">
                      {FIELD_LABELS[field]}
                      {mapping[field]
                        ? <CheckCircle2 size={12} className="text-[#3DB54A]" />
                        : <AlertCircle size={12} className="text-amber-500" />}
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                      value={mapping[field]}
                      onChange={e => setMapping(m => ({ ...m, [field]: e.target.value }))}
                    >
                      <option value="">— Spalte wählen —</option>
                      {parsed.headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} className="flex-shrink-0" /> {error}
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Preview ── */}
          {step === "preview" && (
            <div className="py-2 space-y-3">
              <p className="text-sm text-muted-foreground">
                Vorschau der ersten {previewRows.length} von {parsed?.rows.length} Fahrten:
              </p>
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>
                      {["Datum", "Von", "Nach", "km", "Zweck"].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-[#0F2B4C]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {previewRows.map((r, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-3 py-2">{r.date}</td>
                        <td className="px-3 py-2">{r.from}</td>
                        <td className="px-3 py-2">{r.to}</td>
                        <td className="px-3 py-2 font-medium">{r.km}</td>
                        <td className="px-3 py-2">{r.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                Insgesamt werden <strong>{parsed?.rows.length}</strong> Fahrten importiert.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {step === "upload" && (
              <Button variant="outline" onClick={handleClose}>Abbrechen</Button>
            )}

            {step === "map" && (
              <>
                <Button variant="outline" onClick={() => setStep("upload")}>Zurück</Button>
                <Button
                  className="bg-[#0066B3] hover:bg-[#0066B3]/90 text-white"
                  disabled={!mappingComplete}
                  onClick={() => setStep("preview")}
                >
                  Vorschau ansehen
                </Button>
              </>
            )}

            {step === "preview" && (
              <>
                <Button variant="outline" onClick={() => setStep("map")}>Zurück</Button>
                <Button className="bg-[#3DB54A] hover:bg-[#3DB54A]/90 text-white gap-2" onClick={handleImport}>
                  <CheckCircle2 size={16} /> {parsed?.rows.length} Fahrten importieren
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
