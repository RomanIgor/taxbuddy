import { Branch } from "@/types";

export interface Tip {
  id: string;
  title: string;
  summary: string;
  paragraph: string;
  branches: Branch[] | "all";
  meaning: string;
  example: string;
  attention: string;
  risks: string;
  grayArea: string;
  legalBasis: string;
}

export const TIPS: Tip[] = [
  {
    id: "kleinunternehmer",
    title: "Kleinunternehmerregelung 2025",
    summary:
      "Bis 25.000 € Vorjahres- und 100.000 € laufender Umsatz keine Umsatzsteuer.",
    paragraph: "§ 19 UStG",
    branches: "all",
    meaning:
      "Du bewegst dich unterhalb der Kleinunternehmergrenze und musst keine Umsatzsteuer ausweisen. Vereinfachte Rechnungen, keine Voranmeldungen.",
    example:
      "Du erzielst 22.000 € Umsatz im Vorjahr und planst 35.000 € im laufenden Jahr → bleibst Kleinunternehmer. Bei Überschreitung der 100.000 € im laufenden Jahr endet der Status sofort.",
    attention:
      "Die 25.000 €/100.000 € sind NETTO-Werte. Wechsel zur Regelbesteuerung im Folgejahr, wenn Vorjahr überschritten wird.",
    risks:
      "Falscher Hinweis auf der Rechnung führt zur Steuerschuld nach § 14c UStG. Immer 'Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen' aufdrucken.",
    grayArea:
      "Mischfälle bei Wechsel mitten im Jahr – bei Überschreitung der 100.000 € sofortige Regelbesteuerung ab dem Folgemonat.",
    legalBasis: "§ 19 UStG (Stand 2025/2026)",
  },
  {
    id: "homeoffice",
    title: "Homeoffice-Pauschale",
    summary:
      "6 € pro Tag, max. 1.260 € im Jahr – ohne Nachweis eines Arbeitszimmers.",
    paragraph: "§ 4 Abs. 5 Nr. 6c EStG",
    branches: "all",
    meaning:
      "Für jeden Tag, an dem du überwiegend von zu Hause arbeitest, kannst du 6 € als Betriebsausgabe ansetzen – auch ohne separates Arbeitszimmer.",
    example:
      "210 Heimarbeitstage × 6 € = 1.260 € (= Maximum). Die Pauschale gilt zusätzlich zur Kilometerpauschale für Außendienst.",
    attention:
      "Tage müssen dokumentiert werden (Kalender). Kein doppelter Ansatz mit häuslichem Arbeitszimmer.",
    risks:
      "Bei Betriebsprüfung verlangt das FA einen Nachweis der Tage – führe ein einfaches Logbuch.",
    grayArea:
      "Wenn du auch Mandanten zu Hause empfängst, ist u. U. das volle Arbeitszimmer ansetzbar – Berater fragen.",
    legalBasis: "§ 4 Abs. 5 Nr. 6c EStG",
  },
  {
    id: "kilometerpauschale",
    title: "Kilometerpauschale",
    summary: "0,30 € pro gefahrenem km mit dem privaten PKW – ohne Belege.",
    paragraph: "§ 9 Abs. 1 Nr. 4a EStG",
    branches: "all",
    meaning:
      "Statt eines Fahrtenbuchs für ein betriebliches Fahrzeug kannst du Geschäftsfahrten mit dem privaten Auto pauschal absetzen.",
    example:
      "120 km zum Kunden × 0,30 € = 36 €. Pro Hin- und Rückweg getrennt erfassen.",
    attention:
      "Ab dem 21. km zur ersten Tätigkeitsstätte gilt 0,38 € (gilt nicht für Selbstständige bei Geschäftsfahrten).",
    risks:
      "Pauschale gilt nur für tatsächlich betriebliche Fahrten – Privatfahrten sind ausgeschlossen.",
    grayArea:
      "Bei sehr häufiger Nutzung kann ein betriebliches Fahrzeug günstiger sein – Vergleichsrechnung lohnt sich.",
    legalBasis: "§ 9 Abs. 1 Nr. 4a EStG",
  },
  {
    id: "geschenke",
    title: "Geschenke an Geschäftspartner",
    summary: "Bis 50 € netto pro Person und Jahr abziehbar (seit 2024).",
    paragraph: "§ 4 Abs. 5 Nr. 1 EStG",
    branches: "all",
    meaning:
      "Sachgeschenke an Kunden oder Geschäftspartner bis 50 € netto pro Empfänger und Jahr sind Betriebsausgabe.",
    example:
      "Du schenkst 10 Kunden je eine Flasche Wein für 45 € = 450 € voll abziehbar.",
    attention:
      "Empfänger und Anlass müssen dokumentiert werden. Über 50 € → kompletter Verlust des Abzugs.",
    risks:
      "Versteuerung beim Empfänger – kann mit § 37b EStG (30 % Pauschale) übernommen werden.",
    grayArea:
      "Streuwerbeartikel unter 10 € (Kalender, Kugelschreiber) zählen nicht zur Geschenkegrenze.",
    legalBasis: "§ 4 Abs. 5 Nr. 1 EStG (Erhöhung 2024)",
  },
  {
    id: "bewirtung",
    title: "Bewirtungskosten",
    summary: "70 % der Kosten absetzbar bei geschäftlichem Anlass.",
    paragraph: "§ 4 Abs. 5 Nr. 2 EStG",
    branches: "all",
    meaning:
      "Geschäftsessen mit Kunden oder Partnern sind zu 70 % als Betriebsausgabe ansetzbar – die restlichen 30 % zählen als nicht abziehbar.",
    example:
      "100 € Restaurantrechnung → 70 € Betriebsausgabe + 19 € Vorsteuer aus den 70 €.",
    attention:
      "Bewirtungsbeleg mit Anlass, Teilnehmern, Datum und Unterschrift Pflicht.",
    risks:
      "Fehlende Angaben oder reine Privatessen führen zur vollständigen Streichung.",
    grayArea:
      "Bewirtung von Mitarbeitern (Betriebsfeier) ist zu 100 % abziehbar.",
    legalBasis: "§ 4 Abs. 5 Nr. 2 EStG",
  },
  {
    id: "gwg",
    title: "Geringwertige Wirtschaftsgüter (GWG)",
    summary: "Bis 800 € netto sofort vollständig absetzbar.",
    paragraph: "§ 6 Abs. 2 EStG",
    branches: "all",
    meaning:
      "Anlagegüter unter 800 € netto kannst du im Anschaffungsjahr vollständig als Betriebsausgabe abziehen.",
    example:
      "Schreibtischstuhl für 750 € netto → komplett im Kaufjahr absetzbar.",
    attention: "Über 800 € → Abschreibung über die Nutzungsdauer.",
    risks:
      "Bei Sammelposten (250–1.000 €) gelten andere Regeln – nur eine Methode pro Jahr wählen.",
    grayArea:
      "Der GWG-Wert wird politisch diskutiert – aktuell 800 € (Stand 2025).",
    legalBasis: "§ 6 Abs. 2 EStG",
  },
  {
    id: "computer-afa",
    title: "Computer-Hardware AfA 1 Jahr",
    summary: "Computer und Peripherie über 1 Jahr abschreibbar.",
    paragraph: "BMF-Schreiben 22.02.2022",
    branches: ["it", "design", "content", "marketing", "beratung"],
    meaning:
      "Computer, Notebooks, Monitore, Tastaturen u. ä. werden auf 1 Jahr Nutzungsdauer abgeschrieben – damit faktisch sofort.",
    example:
      "MacBook für 2.400 € → komplett im Anschaffungsjahr absetzbar (auch über GWG-Grenze).",
    attention: "Gilt nur für Hardware, nicht für Möbel oder andere Geräte.",
    risks: "Software-Lizenzen separat behandeln (regelmäßig Betriebsausgabe).",
    grayArea: "Smartphones gelten nach BMF inzwischen ebenfalls als Computer.",
    legalBasis: "BMF-Schreiben vom 22.02.2022, Az. IV C 3 - S 2190/21/10002",
  },
  {
    id: "aufbewahrung",
    title: "Aufbewahrungsfrist Rechnungen 8 Jahre",
    summary: "Seit 2025 nur noch 8 Jahre statt 10 Jahre (Wachstumschancengesetz).",
    paragraph: "§ 147 AO",
    branches: "all",
    meaning:
      "Buchungsbelege und Rechnungen müssen nun nur noch 8 Jahre aufbewahrt werden – nicht mehr 10.",
    example:
      "Eine Rechnung aus 2025 muss bis Ende 2033 aufbewahrt werden (vorher 2035).",
    attention:
      "Andere Unterlagen (Verträge, Bilanzen) bleiben bei 10 Jahren.",
    risks:
      "Nicht zu früh wegwerfen – die Frist beginnt mit Ablauf des Kalenderjahres.",
    grayArea:
      "Bei laufender Betriebsprüfung verlängert sich die Frist automatisch.",
    legalBasis: "§ 147 AO i. d. F. Wachstumschancengesetz 2024",
  },
  {
    id: "e-rechnung",
    title: "E-Rechnungspflicht B2B",
    summary: "Empfang ab 2025, Versand verpflichtend ab 2027/2028.",
    paragraph: "§ 14 UStG",
    branches: "all",
    meaning:
      "Elektronische Rechnungen (XRechnung, ZUGFeRD) werden im B2B-Bereich verpflichtend. Empfangen muss bereits jeder Unternehmer können.",
    example:
      "Du bekommst eine ZUGFeRD-PDF mit eingebetteten XML-Daten – musst sie als E-Rechnung verarbeiten können.",
    attention: "Reine PDF ist KEINE E-Rechnung im Sinne des Gesetzes.",
    risks:
      "Unternehmen ohne E-Rechnungs-Empfangsstelle können Vorsteuer verlieren.",
    grayArea:
      "Übergangsfristen 2027/2028 nach Umsatzgröße – bei Kleinunternehmen längere Schonfrist.",
    legalBasis: "§ 14 UStG (geändert durch Wachstumschancengesetz)",
  },
  {
    id: "investitionsabzug",
    title: "Investitionsabzugsbetrag (IAB)",
    summary: "Bis zu 50 % geplante Investition vorab steuermindernd geltend machen.",
    paragraph: "§ 7g EStG",
    branches: "all",
    meaning:
      "Du planst eine Anschaffung in den nächsten 3 Jahren? Dann kannst du bis zu 50 % der Kosten heute schon abziehen.",
    example:
      "Neuer Laptop geplant für 4.000 € → 2.000 € als IAB heute absetzen, im Kaufjahr Hinzurechnung.",
    attention:
      "Gewinngrenze: 200.000 €. Investition muss tatsächlich erfolgen, sonst rückwirkende Auflösung mit Verzinsung.",
    risks:
      "Wenn die Investition ausbleibt, fordert das FA Steuern + 6 % Zinsen pro Jahr nach.",
    grayArea: "Funktionsumfang muss sich nicht 1:1 entsprechen – Klasse genügt.",
    legalBasis: "§ 7g EStG",
  },
  {
    id: "arbeitszimmer",
    title: "Häusliches Arbeitszimmer",
    summary:
      "Volle Kosten ansetzbar, wenn Mittelpunkt der Tätigkeit – sonst Pauschale 1.260 €.",
    paragraph: "§ 4 Abs. 5 Nr. 6b EStG",
    branches: "all",
    meaning:
      "Bildet das Arbeitszimmer den Mittelpunkt deiner gesamten Tätigkeit, sind alle Kosten anteilig (qm) abziehbar.",
    example:
      "12 m² Büro in 80 m² Wohnung = 15 % der Miete + Nebenkosten + AfA.",
    attention:
      "Strenge Anforderungen: separater Raum, keine private Mitnutzung, Schwerpunkt der Tätigkeit.",
    risks:
      "FA prüft sehr genau – Türschild, Möblierung und Nutzungsnachweis hilfreich.",
    grayArea:
      "Co-Working-Space-Kosten sind unproblematisch voll absetzbar.",
    legalBasis: "§ 4 Abs. 5 Nr. 6b EStG",
  },
  {
    id: "fortbildung",
    title: "Fortbildungskosten",
    summary: "Kurse, Bücher und Konferenzen mit Berufsbezug voll absetzbar.",
    paragraph: "§ 9 Abs. 1 EStG",
    branches: "all",
    meaning:
      "Alle Kosten für berufliche Weiterbildung – Kursgebühren, Reisekosten, Übernachtung, Lehrmaterial – sind Betriebsausgaben.",
    example:
      "Konferenz für 1.200 € + Hotel 350 € + Bahn 80 € = 1.630 € voll absetzbar.",
    attention: "Privatreise mit Konferenzanteil → nur anteilig absetzbar.",
    risks:
      "Erstausbildung/Erststudium nur als Sonderausgaben (max. 6.000 €).",
    grayArea:
      "Sprachkurse je nach beruflichem Bezug – Begründung sauber dokumentieren.",
    legalBasis: "§ 9 Abs. 1 EStG",
  },
  {
    id: "fahrtenbuch-vs-pauschale",
    title: "Fahrtenbuch vs. Pauschale",
    summary:
      "Bei betrieblichem Fahrzeug: Fahrtenbuch oder 1 %-Methode wählen.",
    paragraph: "§ 6 Abs. 1 Nr. 4 EStG",
    branches: "all",
    meaning:
      "Wenn dein Auto im Betriebsvermögen ist, musst du den Privatanteil entweder über ein Fahrtenbuch oder pauschal mit 1 % vom Bruttolistenpreis pro Monat versteuern.",
    example:
      "BLP 40.000 € × 1 % = 400 €/Monat = 4.800 €/Jahr Privatanteil.",
    attention:
      "Fahrtenbuch lohnt sich bei geringem Privatanteil – aber sehr formalistisch.",
    risks:
      "Lückenhafte Fahrtenbücher werden komplett verworfen → 1 %-Methode wird angewendet.",
    grayArea: "E-Auto: 0,25 % bei BLP < 70.000 € (Förderung).",
    legalBasis: "§ 6 Abs. 1 Nr. 4 EStG",
  },
  {
    id: "soa",
    title: "Sofort-Abschreibung 800 €",
    summary: "Geringwertige Wirtschaftsgüter im Anschaffungsjahr voll absetzen.",
    paragraph: "§ 6 Abs. 2 EStG",
    branches: "all",
    meaning:
      "Wirtschaftsgüter bis 800 € netto kannst du im Jahr der Anschaffung vollständig als Betriebsausgabe abziehen.",
    example: "Bürostuhl 599 € netto → sofort voll absetzbar.",
    attention: "Pro Wirtschaftsgut, nicht pro Rechnung.",
    risks: "Verwechslung mit Sammelposten-Methode.",
    grayArea: "Set-Rechnungen einzeln aufschlüsseln lassen.",
    legalBasis: "§ 6 Abs. 2 EStG",
  },
  {
    id: "reverse-charge",
    title: "Reverse Charge bei EU-Leistungen",
    summary:
      "Beim Einkauf bei EU-Unternehmen schuldest du als Leistungsempfänger die USt.",
    paragraph: "§ 13b UStG",
    branches: ["it", "design", "content", "marketing", "beratung"],
    meaning:
      "Wenn du bei EU-Anbietern (z. B. Google, Meta, Adobe Irland) einkaufst, schuldest du die deutsche Umsatzsteuer und meldest sie selbst.",
    example:
      "Facebook-Werbung 200 € netto aus Irland → 38 € USt selbst anmelden, dann sofort wieder als Vorsteuer abziehen.",
    attention:
      "Als Kleinunternehmer (§ 19) trotzdem USt abführen, aber kein Vorsteuerabzug.",
    risks:
      "Nicht angemeldete Reverse-Charge-Umsätze werden bei Prüfung nachversteuert.",
    grayArea:
      "B2C-Leistungen aus dem Ausland fallen nicht unter Reverse Charge.",
    legalBasis: "§ 13b UStG",
  },
  {
    id: "investition-photovoltaik",
    title: "Photovoltaik-Anlage steuerfrei",
    summary: "PV-Anlagen bis 30 kWp sind ertragssteuerfrei.",
    paragraph: "§ 3 Nr. 72 EStG",
    branches: ["sonstiges", "immobilien"],
    meaning:
      "Einnahmen aus Photovoltaik-Anlagen bis 30 kWp auf Einfamilienhäusern sind komplett ertragssteuerfrei (rückwirkend ab 2022).",
    example:
      "10 kWp-Anlage → komplette Einspeisevergütung steuerfrei, keine Anlage EÜR mehr nötig.",
    attention: "Gilt nur für Anlagen, die zu mehr als 50 % Wohnzwecken dienen.",
    risks: "Keine bekannten Risiken – nur Mitteilungspflicht ans FA.",
    grayArea:
      "Bei größeren Anlagen oder Mehrfamilienhäusern komplexere Regelung.",
    legalBasis: "§ 3 Nr. 72 EStG (Jahressteuergesetz 2022)",
  },
  {
    id: "umsatzsteuer-voranmeldung",
    title: "USt-Voranmeldung & Dauerfristverlängerung",
    summary: "Monatlich oder quartalsweise – mit 1/11 Vorauszahlung 1 Monat länger Zeit.",
    paragraph: "§ 18 UStG",
    branches: "all",
    meaning:
      "Regelbesteuerte Unternehmer melden USt monatlich oder quartalsweise. Mit Dauerfristverlängerung (1/11 Vorauszahlung) hast du jeweils einen Monat länger Zeit.",
    example:
      "Quartal Q1 normal bis 10.04. → mit Dauerfristverlängerung bis 10.05.",
    attention:
      "Antrag auf Dauerfristverlängerung muss einmalig gestellt werden.",
    risks:
      "Verspätete Abgabe = Verspätungszuschlag (mind. 25 €/Monat).",
    grayArea:
      "Bei Kleinunternehmern entfällt das komplett – ein Vorteil.",
    legalBasis: "§ 18 UStG",
  },
  {
    id: "tagesgeld-zinsen",
    title: "Zinsen sind Privatvermögen",
    summary:
      "Tagesgeld-Zinsen gehören nicht in die EÜR – nur Anlage KAP.",
    paragraph: "§ 20 EStG",
    branches: "all",
    meaning:
      "Zinsen aus dem privaten Tagesgeld zählen zu den Einkünften aus Kapitalvermögen, nicht zu den Betriebseinnahmen.",
    example:
      "1.500 € Zinsen → in Anlage KAP, nicht in EÜR.",
    attention:
      "Geschäftliche Konten getrennt führen, sonst Vermischung.",
    risks: "Falsche Zuordnung führt zu doppelter Versteuerung.",
    grayArea: "Bei betrieblichem Geschäftskonto: Zinsen als Betriebseinnahme.",
    legalBasis: "§ 20 EStG",
  },
  {
    id: "ist-besteuerung",
    title: "Ist-Besteuerung beantragen",
    summary: "USt erst bei Zahlungseingang abführen, nicht bei Rechnungsstellung.",
    paragraph: "§ 20 UStG",
    branches: "all",
    meaning:
      "Statt nach vereinbarten Entgelten (Soll) kannst du die USt nach vereinnahmten Entgelten (Ist) abführen – also erst, wenn der Kunde gezahlt hat.",
    example:
      "Rechnung im Dezember, Zahlung im Februar → USt erst in Februar-Voranmeldung.",
    attention:
      "Antrag ans FA stellen, wenn Vorjahresumsatz unter 800.000 € (seit 2024).",
    risks:
      "Cash-Flow-Vorteil, aber doppelte Buchhaltung bei großen Mengen.",
    grayArea: "Wechsel der Methode nur zum Jahreswechsel sinnvoll.",
    legalBasis: "§ 20 UStG",
  },
  {
    id: "buero-zuhause",
    title: "Telefon und Internet anteilig",
    summary:
      "50 % der privaten Telefon-/Internetkosten ohne Nachweis absetzbar.",
    paragraph: "R 9.1 LStR",
    branches: "all",
    meaning:
      "Auch ohne separaten Geschäftsanschluss kannst du pauschal 20 % (max. 20 €/Monat) deiner privaten Telekommunikationskosten absetzen.",
    example:
      "60 € Internet/Mobilfunk × 20 % = 12 €/Monat = 144 €/Jahr.",
    attention: "Höhere Quote nur mit Einzelnachweis (Verbindungsdaten).",
    risks: "Bei kompletter Absetzung Nachweis nötig.",
    grayArea: "Streaming-Dienste (Netflix etc.) i. d. R. nicht absetzbar.",
    legalBasis: "R 9.1 Lohnsteuer-Richtlinien",
  },
  {
    id: "bewirtung-mitarbeiter",
    title: "Mitarbeiter-Bewirtung 100 %",
    summary:
      "Betriebsfeiern bis 110 € pro Mitarbeiter und Anlass voll absetzbar.",
    paragraph: "§ 19 Abs. 1 Nr. 1a EStG",
    branches: "all",
    meaning:
      "Anders als bei Kunden-Bewirtung sind Mitarbeiter-Veranstaltungen zu 100 % Betriebsausgabe.",
    example:
      "Sommerfest 80 € pro Person für 5 Mitarbeiter = 400 € voll absetzbar.",
    attention: "Maximal 2 Veranstaltungen pro Jahr begünstigt.",
    risks: "Über 110 € → Differenz wird Lohn beim Mitarbeiter.",
    grayArea: "Solo-Selbstständige haben hier nichts.",
    legalBasis: "§ 19 Abs. 1 Nr. 1a EStG",
  },
];

export function tipsForBranch(branch: Branch): Tip[] {
  return TIPS.filter((t) => t.branches === "all" || t.branches.includes(branch));
}
