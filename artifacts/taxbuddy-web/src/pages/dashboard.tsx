import { useDataStore, formatCurrency } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  PlusCircle,
  Car,
  ScanLine,
  ShieldCheck,
  Newspaper,
  Bot,
} from "lucide-react";
import { Link } from "wouter";

const QUICK_ACTIONS = [
  { label: "Einnahme hinzufügen", icon: PlusCircle,  color: "#3DB54A", bg: "bg-[#3DB54A]/10",  href: "/einnahmen" },
  { label: "Ausgabe hinzufügen",  icon: ArrowDownRight, color: "#EF4444", bg: "bg-red-500/10",  href: "/ausgaben" },
  { label: "Fahrt starten",       icon: Car,          color: "#0066B3", bg: "bg-[#0066B3]/10", href: "/fahrtenbuch" },
  { label: "Beleg scannen",       icon: ScanLine,     color: "#8B5CF6", bg: "bg-purple-500/10",href: "/dokumente" },
  { label: "Steuer-Check",        icon: ShieldCheck,  color: "#F59E0B", bg: "bg-amber-500/10", href: "/steuer-check" },
  { label: "Tipps & News",        icon: Newspaper,    color: "#0891B2", bg: "bg-cyan-500/10",  href: "/tipps" },
];

export default function Dashboard() {
  const { incomes, expenses, trips, profile } = useDataStore();

  const totalIncome  = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const profit       = totalIncome - totalExpense;
  const totalKm      = trips.reduce((s, t) => s + t.km, 0);
  const taxEstimate  = profit * 0.27;

  const revenueLimit   = profile.yearlyRevenueLimit;
  const progressPct    = Math.min((totalIncome / revenueLimit) * 100, 100);
  const progressColor  = progressPct > 90 ? "#EF4444" : progressPct > 75 ? "#F59E0B" : "#3DB54A";

  const recent = [
    ...incomes.map(i  => ({ ...i, kind: "income"  as const })),
    ...expenses.map(e => ({ ...e, kind: "expense" as const })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Guten Morgen,</p>
          <h1 className="text-2xl font-bold text-[#0F2B4C]">{profile.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Schön, dass du hier bist. Hier ist deine Übersicht.
          </p>
        </div>
        <Link href="/einnahmen">
          <Button className="bg-[#0066B3] hover:bg-[#0066B3]/90 text-white gap-2">
            <PlusCircle className="w-4 h-4" /> Neue Einnahme
          </Button>
        </Link>
      </div>

      {/* 4-column stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Gewinn */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gewinn (YTD)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-[#0F2B4C]">{formatCurrency(profit)}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-[#3DB54A] font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>Einnahmen – Ausgaben</span>
            </div>
          </CardContent>
        </Card>

        {/* Ausgaben */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ausgaben (YTD)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-[#0F2B4C]">{formatCurrency(totalExpense)}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-red-500 font-medium">
              <ArrowDownRight className="w-3 h-3" />
              <span>Absetzbare Kosten</span>
            </div>
          </CardContent>
        </Card>

        {/* Umsatz / §19 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Umsatz {profile.taxYear}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-[#0F2B4C]">{formatCurrency(totalIncome)}</div>
            <div className="mt-2">
              <Progress
                value={progressPct}
                className="h-1.5"
                style={{ "--progress-color": progressColor } as React.CSSProperties}
              />
              <p className="text-xs text-muted-foreground mt-1">{progressPct.toFixed(0)}% der Grenze</p>
            </div>
          </CardContent>
        </Card>

        {/* Steuer-Prognose */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Steuer-Prognose</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-[#0F2B4C]">~ {formatCurrency(taxEstimate)}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <span>realistisch geschätzt</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* §19 banner when close */}
      {progressPct > 75 && (
        <div className={`rounded-xl p-4 text-sm font-medium ${progressPct > 90 ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
          {progressPct > 90
            ? "Achtung: Du näherst dich der Kleinunternehmergrenze (§19 UStG). Bei Überschreitung wirst du im Folgejahr umsatzsteuerpflichtig!"
            : `Hinweis: Du hast bereits ${progressPct.toFixed(0)}% der §19-Grenze erreicht. Behalte deine Einnahmen im Blick.`}
        </div>
      )}

      {/* Schnellzugriff */}
      <div>
        <h2 className="text-base font-semibold text-[#0F2B4C] mb-3">Schnellzugriff</h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.href} href={a.href}>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-border hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <div className={`w-10 h-10 rounded-full ${a.bg} flex items-center justify-center`}>
                    <Icon size={20} style={{ color: a.color }} />
                  </div>
                  <span className="text-xs text-center text-muted-foreground font-medium leading-tight group-hover:text-[#0F2B4C] transition-colors">
                    {a.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Activity + AI tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Letzte Aktivitäten */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#0F2B4C]">Letzte Aktivitäten</h2>
            <Link href="/buchungen" className="text-xs text-[#0066B3] hover:underline font-medium">Alle ansehen</Link>
          </div>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {recent.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">Noch keine Buchungen vorhanden.</div>
              ) : (
                <div className="divide-y divide-border">
                  {recent.map((tx, i) => (
                    <div key={`${tx.kind}-${tx.id}-${i}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.kind === "income" ? "bg-[#3DB54A]/10 text-[#3DB54A]" : "bg-red-500/10 text-red-500"}`}>
                          {tx.kind === "income"
                            ? <ArrowUpRight size={16} />
                            : <ArrowDownRight size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0F2B4C]">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString("de-DE")} • {tx.category}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${tx.kind === "income" ? "text-[#3DB54A]" : "text-red-500"}`}>
                        {tx.kind === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* KI-Tipp */}
        <div>
          <h2 className="text-base font-semibold text-[#0F2B4C] mb-3">KI-Tipp für dich</h2>
          <Card className="border-0 shadow-sm h-full">
            <CardContent className="p-5 space-y-4">
              <p className="text-sm text-[#0F2B4C]">
                Du hast diesen Monat <strong>{progressPct > 15 ? "mehr" : "weniger"} Ausgaben</strong> als im letzten Monat.{" "}
                {totalKm > 0
                  ? `Mit ${totalKm} km kannst du ${formatCurrency(totalKm * 0.3)} absetzen.`
                  : "Trage deine Fahrten ein, um die Kilometerpauschale geltend zu machen."}
              </p>
              <div className="bg-[#F5F7FA] rounded-lg p-3">
                <p className="text-xs text-muted-foreground font-medium mb-1">Fahrtenbuch</p>
                <p className="text-lg font-bold text-[#0F2B4C]">{formatCurrency(totalKm * 0.3)}</p>
                <p className="text-xs text-muted-foreground">{totalKm} km × 0,30 €</p>
              </div>
              <Link href="/ki-assistent">
                <Button variant="outline" size="sm" className="w-full gap-2 border-[#0066B3] text-[#0066B3] hover:bg-[#0066B3]/5">
                  <Bot size={14} /> KI-Assistent öffnen
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
