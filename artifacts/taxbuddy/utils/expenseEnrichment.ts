import { Expense, ExpenseCategory } from "@/types";

export interface Enrichment {
  paragraph: string;
  taxImpact: number;
  flag: Expense["flag"];
  hint: string;
}

export function enrichExpense(
  amount: number,
  category: ExpenseCategory,
): Enrichment {
  switch (category) {
    case "Hardware":
      return {
        paragraph:
          amount <= 800
            ? "§ 6 Abs. 2 EStG · GWG bis 800 € sofort absetzbar"
            : "§ 7 EStG · AfA über Nutzungsdauer (Computer 1 Jahr)",
        taxImpact: amount * 0.19,
        flag: "ok",
        hint:
          amount > 800
            ? "Über GWG-Grenze – Anlagevermögen prüfen."
            : "Sofort abzugsfähig als geringwertiges Wirtschaftsgut.",
      };
    case "Software":
      return {
        paragraph: "§ 4 Abs. 4 EStG · Betriebsausgabe (Abo / Lizenz)",
        taxImpact: amount * 0.19,
        flag: "ok",
        hint: "Vollständig absetzbar bei betrieblicher Nutzung.",
      };
    case "Reisen":
      return {
        paragraph: "§ 4 Abs. 5 EStG · Reisekosten",
        taxImpact: amount * 0.19,
        flag: amount > 500 ? "check" : "ok",
        hint:
          amount > 500
            ? "Hohe Reisekosten – Reiseanlass dokumentieren."
            : "Anlass und Teilnehmer notieren.",
      };
    case "Bewirtung":
      return {
        paragraph: "§ 4 Abs. 5 Nr. 2 EStG · 70 % abziehbar",
        taxImpact: amount * 0.7 * 0.19,
        flag: amount > 50 ? "check" : "ok",
        hint:
          "Bewirtungsbeleg mit Anlass, Teilnehmern und Unterschrift erforderlich.",
      };
    case "Büro":
      return {
        paragraph: "§ 4 Abs. 4 EStG · Bürokosten",
        taxImpact: amount * 0.19,
        flag: "ok",
        hint: "Voll absetzbar – Beleg aufbewahren.",
      };
    case "Telefon/Internet":
      return {
        paragraph: "§ 4 Abs. 4 EStG · Telekommunikation",
        taxImpact: amount * 0.19,
        flag: "ok",
        hint:
          "Bei gemischter Nutzung anteilig absetzen (i.d.R. 50 % pauschal).",
      };
    case "Weiterbildung":
      return {
        paragraph: "§ 9 Abs. 1 EStG · Fortbildungskosten",
        taxImpact: amount * 0.19,
        flag: "ok",
        hint: "Bezug zur Tätigkeit dokumentieren.",
      };
    case "Sonstiges":
    default:
      return {
        paragraph: "§ 4 Abs. 4 EStG · Betriebsausgabe",
        taxImpact: amount * 0.19,
        flag: amount > 250 ? "check" : "ok",
        hint:
          amount > 250
            ? "Höherer Betrag – Kategorie prüfen und genau zuordnen."
            : "Standard-Betriebsausgabe.",
      };
  }
}
