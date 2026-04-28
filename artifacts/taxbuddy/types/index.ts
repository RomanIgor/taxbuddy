export type Branch =
  | "it"
  | "design"
  | "beratung"
  | "handel"
  | "handwerk"
  | "content"
  | "marketing"
  | "gastro"
  | "gesundheit"
  | "bildung"
  | "immobilien"
  | "kfz"
  | "event"
  | "finanz"
  | "recht"
  | "sonstiges";

export interface Profile {
  name: string;
  branch: Branch;
  revenueGoal: number;
  apiKey?: string;
  onboardingComplete: boolean;
}

export interface Income {
  id: string;
  amount: number;
  client: string;
  category: "Beratung" | "Entwicklung" | "Verkauf" | "Sonstiges";
  status: "paid" | "open";
  date: string; // ISO string
}

export type ExpenseCategory =
  | "Hardware"
  | "Software"
  | "Reisen"
  | "Bewirtung"
  | "Büro"
  | "Telefon/Internet"
  | "Weiterbildung"
  | "Sonstiges";

export interface Expense {
  id: string;
  amount: number;
  vendor: string;
  description?: string;
  category: ExpenseCategory;
  flag: "ok" | "check" | "critical";
  paragraph?: string;
  taxImpact?: number;
  date: string;
}

export interface Trip {
  id: string;
  date: string;
  client: string;
  contact?: string;
  purpose: string;
  from: string;
  to: string;
  km: number;
  roundTrip: boolean;
  pauschale: number;
}

export interface ExportEntry {
  id: string;
  protocolId: string;
  recipient: string;
  email?: string;
  periodFrom: string;
  periodTo: string;
  formats: string[];
  notes?: string;
  stats: any;
  createdAt: string;
}
