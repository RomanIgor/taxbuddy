import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Info, CheckCircle2, AlertTriangle, Scale } from "lucide-react";

export default function Tipps() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2B4C]">Steuer-Tipps</h1>
        <p className="text-muted-foreground mt-1">Wichtiges Wissen für Kleinunternehmer (§19 UStG).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm border-l-4 border-l-[#0066B3]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#0F2B4C]">
              <Info className="w-5 h-5 text-[#0066B3]" />
              Was bedeutet Kleinunternehmer?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Nach § 19 UStG erhebst du keine Umsatzsteuer (Mehrwertsteuer) auf deine Rechnungen und darfst im Gegenzug auch keine Vorsteuer aus deinen Ausgaben vom Finanzamt zurückholen.
            </p>
            <p className="font-medium text-[#0F2B4C]">
              Wichtig: Auf jeder Rechnung muss stehen: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm border-l-4 border-l-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#0F2B4C]">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Die 22.000 € Grenze
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Dein <strong>Umsatz</strong> (nicht der Gewinn!) darf im Vorjahr 22.000 € nicht überstiegen haben und im laufenden Jahr voraussichtlich 50.000 € nicht übersteigen.
            </p>
            <p className="text-destructive font-medium bg-destructive/5 p-2 rounded">
              Überschreitest du die 22.000 €, bist du ab dem 1. Januar des Folgejahres automatisch umsatzsteuerpflichtig!
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm border-l-4 border-l-[#3DB54A]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#0F2B4C]">
              <CheckCircle2 className="w-5 h-5 text-[#3DB54A]" />
              Bewirtungskosten
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Gehst du mit Kunden essen, kannst du <strong>70%</strong> der angemessenen Bewirtungskosten als Betriebsausgabe absetzen.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Lass dir einen maschinellen Bewirtungsbeleg geben.</li>
              <li>Trage Anlass, bewirtete Personen und Datum ein.</li>
              <li>Unterschreibe den Beleg.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm border-l-4 border-l-orange-400">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#0F2B4C]">
              <Scale className="w-5 h-5 text-orange-400" />
              Arbeitszimmer vs. Home-Office
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Ein <strong>häusliches Arbeitszimmer</strong> ist nur voll absetzbar, wenn es der Mittelpunkt deiner gesamten Tätigkeit ist (z.B. reiner Schreibtisch-Freelancer).
            </p>
            <p>
              Alternativ: Die <strong>Home-Office-Pauschale</strong> (Tagespauschale). Du kannst 6 € pro Tag im Home-Office absetzen, maximal jedoch 1.260 € im Jahr (210 Tage). Dies geht auch ohne separates Zimmer!
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 mt-8">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
            <Lightbulb className="w-8 h-8 text-[#0066B3]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0F2B4C] mb-2">Die Einnahmenüberschussrechnung (EÜR)</h3>
            <p className="text-sm text-muted-foreground">
              Als Kleinunternehmer reicht dir zur Gewinnermittlung die einfache EÜR. Du musst keine doppelte Buchführung (Bilanzierung) machen. Das Prinzip ist simpel: Betriebseinnahmen minus Betriebsausgaben = Gewinn. Diesen Gewinn trägst du in deiner Einkommensteuererklärung in die Anlage G oder S (je nach Gewerbe/Freiberuf) ein.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
