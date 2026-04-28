import { Profile } from "@/types";
import { LEGAL } from "@/constants/legal";
import { formatCurrency } from "@/utils/format";

export interface AiAnswer {
  matches: (q: string) => boolean;
  reply: (ctx: { profile: Profile | null; ytdRevenue: number }) => string;
}

const includesAny = (q: string, words: string[]) =>
  words.some((w) => q.toLowerCase().includes(w.toLowerCase()));

export const AI_KNOWLEDGE: AiAnswer[] = [
  {
    matches: (q) => includesAny(q, ["kleinunternehmer", "§ 19", "umsatzgrenze", "grenze"]),
    reply: ({ profile, ytdRevenue }) => {
      const remaining = LEGAL.kleinunternehmerVorjahr - ytdRevenue;
      const name = profile?.name ? `${profile.name}, ` : "";
      return `${name}die Kleinunternehmergrenze (§ 19 UStG) liegt seit 2025 bei 25.000 € im Vorjahr und 100.000 € im laufenden Jahr (NETTO).\n\nDein aktueller Stand: ${formatCurrency(ytdRevenue)} – noch ${formatCurrency(Math.max(0, remaining))} Spielraum bis zur Vorjahresgrenze.\n\nWichtig: Bei Überschreitung der 100.000 € im laufenden Jahr endet der Status sofort, nicht erst zum Jahresende.`;
    },
  },
  {
    matches: (q) => includesAny(q, ["homeoffice", "home office", "arbeitszimmer pauschale"]),
    reply: () =>
      `Die Homeoffice-Pauschale (§ 4 Abs. 5 Nr. 6c EStG) beträgt 6 € pro Tag, max. 1.260 € im Jahr (= 210 Tage).\n\nDu brauchst kein separates Arbeitszimmer – ein Schreibtisch reicht. Aber: Die Tage müssen dokumentiert werden. Ein einfacher Kalendereintrag genügt.`,
  },
  {
    matches: (q) => includesAny(q, ["kilometer", "km-pauschale", "fahrt", "fahrten"]),
    reply: () =>
      `Die Kilometerpauschale (§ 9 Abs. 1 Nr. 4a EStG) beträgt 0,30 € pro gefahrenem km mit dem privaten PKW für betriebliche Fahrten.\n\nFür Hin- und Rückfahrt jeweils getrennt erfassen – im Fahrtenbuch hier in TAXbuddy ist der "Hin- und Rückfahrt"-Toggle dafür gedacht.`,
  },
  {
    matches: (q) => includesAny(q, ["geschenk", "präsent", "kunde"]),
    reply: () =>
      `Sachgeschenke an Geschäftspartner sind seit 2024 bis 50 € netto pro Person und Jahr abziehbar (§ 4 Abs. 5 Nr. 1 EStG).\n\nÜber 50 € → der gesamte Betrag wird nicht-abzugsfähig. Empfänger und Anlass dokumentieren!`,
  },
  {
    matches: (q) => includesAny(q, ["gwg", "geringwertig", "800"]),
    reply: () =>
      `Geringwertige Wirtschaftsgüter (§ 6 Abs. 2 EStG) bis 800 € netto kannst du im Kaufjahr vollständig absetzen.\n\nÜber 800 € → Abschreibung über die Nutzungsdauer (Computer aber: 1 Jahr).`,
  },
  {
    matches: (q) => includesAny(q, ["computer", "laptop", "macbook", "afa", "abschreibung"]),
    reply: () =>
      `Computer-Hardware (Notebooks, Monitore, Tastatur etc.) wird auf 1 Jahr Nutzungsdauer abgeschrieben (BMF-Schreiben 22.02.2022) – also faktisch sofort.\n\nDer Trick: Auch ein 2.500 € MacBook ist im Kaufjahr komplett abziehbar, obwohl es über der GWG-Grenze liegt.`,
  },
  {
    matches: (q) => includesAny(q, ["aufbewahrung", "frist", "rechnungen aufheben", "8 jahre"]),
    reply: () =>
      `Seit 2025 gilt die verkürzte Aufbewahrungsfrist von 8 Jahren für Buchungsbelege und Rechnungen (§ 147 AO, Wachstumschancengesetz).\n\nDie Frist beginnt mit Ablauf des Kalenderjahres – eine Rechnung aus 2025 darf also Anfang 2034 entsorgt werden. Verträge, Bilanzen etc. bleiben bei 10 Jahren.`,
  },
  {
    matches: (q) => includesAny(q, ["e-rechnung", "e rechnung", "erechnung", "xrechnung", "zugferd"]),
    reply: () =>
      `Die E-Rechnungspflicht im B2B kommt schrittweise: EMPFANG ist seit 2025 Pflicht – jeder Unternehmer muss XRechnung oder ZUGFeRD verarbeiten können.\n\nVERSAND wird ab 2027/2028 verpflichtend (gestaffelt nach Umsatz). Reine PDF gilt nicht als E-Rechnung.`,
  },
  {
    matches: (q) => includesAny(q, ["bewirtung", "essen", "restaurant", "geschäftsessen"]),
    reply: () =>
      `Bewirtungskosten (§ 4 Abs. 5 Nr. 2 EStG) sind zu 70 % abziehbar. Die Vorsteuer ist trotzdem zu 100 % abziehbar.\n\nPflicht: Bewirtungsbeleg mit Anlass, Teilnehmern, Datum und deiner Unterschrift. Ohne diese Angaben streicht das FA den Abzug komplett.`,
  },
  {
    matches: (q) => includesAny(q, ["investition", "investitionsabzug", "iab", "§ 7g"]),
    reply: () =>
      `Mit dem Investitionsabzugsbetrag (§ 7g EStG) kannst du bis zu 50 % einer geplanten Investition (3 Jahre Frist) heute schon abziehen.\n\nGewinngrenze 200.000 €. Wenn die Investition ausbleibt: rückwirkende Auflösung mit 6 % Verzinsung. Sehr wirkungsvoll, wenn du dieses Jahr Gewinn drücken willst.`,
  },
];

export const AI_FALLBACK = (profile: Profile | null) =>
  `Dazu habe ich gerade keine fertige Antwort, ${profile?.name ?? "tut mir leid"}. Versuche es mit Stichwörtern wie "Kleinunternehmer", "Homeoffice", "Kilometerpauschale", "Geschenke", "Bewirtung", "GWG" oder "E-Rechnung". Oder schau in die Tipps-Sektion – dort findest du 20+ ausführliche Erklärungen.`;

export function answerQuestion(
  question: string,
  ctx: { profile: Profile | null; ytdRevenue: number },
): string {
  const match = AI_KNOWLEDGE.find((a) => a.matches(question));
  if (match) return match.reply(ctx);
  return AI_FALLBACK(ctx.profile);
}
