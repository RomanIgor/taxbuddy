import { Income, Expense, Trip, Profile } from "../types";
import { generateId } from "../utils/format";

export const defaultProfile: Profile = {
  name: "Max Mustermann",
  branch: "design",
  revenueGoal: 30000,
  onboardingComplete: true,
};

const daysAgo = (n: number) =>
  new Date(Date.now() - 1000 * 60 * 60 * 24 * n).toISOString();

export const defaultIncomes: Income[] = [
  {
    id: generateId(),
    amount: 1500,
    client: "Acme Corp",
    category: "Beratung",
    status: "paid",
    date: daysAgo(5),
  },
  {
    id: generateId(),
    amount: 2400,
    client: "TechStart GmbH",
    category: "Entwicklung",
    status: "paid",
    date: daysAgo(12),
  },
  {
    id: generateId(),
    amount: 800,
    client: "Lokale Bäckerei",
    category: "Sonstiges",
    status: "open",
    date: daysAgo(0),
  },
  {
    id: generateId(),
    amount: 3200,
    client: "Studio Nord",
    category: "Verkauf",
    status: "paid",
    date: daysAgo(28),
  },
  {
    id: generateId(),
    amount: 1850,
    client: "Müller & Partner",
    category: "Beratung",
    status: "paid",
    date: daysAgo(45),
  },
];

export const defaultExpenses: Expense[] = [
  {
    id: generateId(),
    amount: 12.99,
    vendor: "Adobe",
    description: "Creative Cloud Abo",
    category: "Software",
    flag: "ok",
    paragraph: "§ 9 EStG · Betriebsausgabe",
    taxImpact: 12.99 * 0.19,
    date: daysAgo(2),
  },
  {
    id: generateId(),
    amount: 89.5,
    vendor: "Deutsche Bahn",
    description: "Fahrt zum Kunden",
    category: "Reisen",
    flag: "ok",
    paragraph: "§ 4 Abs. 5 EStG · Reisekosten",
    taxImpact: 89.5 * 0.19,
    date: daysAgo(8),
  },
  {
    id: generateId(),
    amount: 65,
    vendor: "Restaurant Bella",
    description: "Kundenessen",
    category: "Bewirtung",
    flag: "check",
    paragraph: "§ 4 Abs. 5 Nr. 2 EStG · 70% abziehbar",
    taxImpact: 65 * 0.7 * 0.19,
    date: daysAgo(15),
  },
  {
    id: generateId(),
    amount: 1299,
    vendor: "Apple",
    description: "MacBook Air M3",
    category: "Hardware",
    flag: "ok",
    paragraph: "§ 7 Abs. 1 EStG · Computer-AfA 1 Jahr",
    taxImpact: 1299 * 0.19,
    date: daysAgo(22),
  },
  {
    id: generateId(),
    amount: 39,
    vendor: "Telekom",
    description: "Mobilfunk Geschäft",
    category: "Telefon/Internet",
    flag: "ok",
    paragraph: "§ 4 Abs. 4 EStG · Betriebsausgabe",
    taxImpact: 39 * 0.19,
    date: daysAgo(3),
  },
];

export const defaultTrips: Trip[] = [
  {
    id: generateId(),
    date: daysAgo(3),
    client: "TechStart GmbH",
    purpose: "Projektbesprechung",
    from: "Büro Chemnitz",
    to: "Kunde Leipzig",
    km: 92,
    roundTrip: true,
    pauschale: 92 * 2 * 0.3,
  },
  {
    id: generateId(),
    date: daysAgo(11),
    client: "Acme Corp",
    purpose: "Workshop",
    from: "Büro",
    to: "Dresden",
    km: 75,
    roundTrip: true,
    pauschale: 75 * 2 * 0.3,
  },
];
