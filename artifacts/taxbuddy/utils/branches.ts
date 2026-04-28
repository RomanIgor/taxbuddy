import { Branch } from "@/types";

export const BRANCHES: { id: Branch; label: string }[] = [
  { id: "it", label: "IT & Software" },
  { id: "design", label: "Design & Medien" },
  { id: "beratung", label: "Beratung & Consulting" },
  { id: "handel", label: "Handel & E-Commerce" },
  { id: "handwerk", label: "Handwerk" },
  { id: "content", label: "Content Creation" },
  { id: "marketing", label: "Marketing & PR" },
  { id: "gastro", label: "Gastronomie" },
  { id: "gesundheit", label: "Gesundheit & Pflege" },
  { id: "bildung", label: "Bildung & Coaching" },
  { id: "immobilien", label: "Immobilien" },
  { id: "kfz", label: "KFZ & Transport" },
  { id: "event", label: "Event & Unterhaltung" },
  { id: "finanz", label: "Finanzen & Versicherung" },
  { id: "recht", label: "Recht & Steuern" },
  { id: "sonstiges", label: "Sonstiges" },
];

export function branchLabel(id: Branch): string {
  return BRANCHES.find((b) => b.id === id)?.label ?? "Sonstiges";
}
