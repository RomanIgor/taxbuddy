import { ShieldCheck, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataStore, formatCurrency } from "@/lib/store";

export default function SteuerCheck() {
  const { incomes, expenses, trips, profile } = useDataStore();
  const totalIncome  = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalKm      = trips.reduce((s, t) => s + t.km, 0);
  const pct          = (totalIncome / profile.yearlyRevenueLimit) * 100;

  const checks = [
    {
      label: "§19 UStG Jahresgrenze",
      ok: pct < 90,
      value: `${formatCurrency(totalIncome)} von ${formatCurrency(profile.yearlyRevenueLimit)} (${pct.toFixed(0)}%)`,
      info: pct < 75 ? "Du bist sicher unter der Grenze." : pct < 90 ? "Behalte die Grenze im Blick." : "Achtung – du näherst dich der Grenze!",
    },
    {
      label: "Fahrtkosten erfasst",
      ok: totalKm > 0,
      value: totalKm > 0 ? `${totalKm} km → ${formatCurrency(totalKm * 0.3)} absetzbar` : "Noch keine Fahrten eingetragen",
      info: totalKm > 0 ? "Kilometerpauschale wird berücksichtigt." : "Trage deine Fahrten ein, um Steuer zu sparen.",
    },
    {
      label: "Betriebsausgaben",
      ok: totalExpense > 0,
      value: totalExpense > 0 ? `${formatCurrency(totalExpense)} erfasst` : "Keine Ausgaben eingetragen",
      info: "Betriebliche Ausgaben mindern deinen zu versteuernden Gewinn.",
    },
    {
      label: "Umsatzsteuer-Pflicht",
      ok: pct < 100,
      value: pct < 100 ? "Nicht umsatzsteuerpflichtig (§19 UStG)" : "Grenze überschritten!",
      info: pct < 100 ? "Als Kleinunternehmer musst du keine USt ausweisen." : "Du hast die Grenze überschritten – bitte steuerliche Beratung einholen.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2B4C]">Steuer-Check</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Deine steuerliche Situation auf einen Blick</p>
      </div>

      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#0F2B4C] to-[#0066B3] text-white">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
            <ShieldCheck size={28} className="text-[#3DB54A]" />
          </div>
          <div>
            <p className="text-blue-200 text-sm">Status Steuer-Check {profile.taxYear}</p>
            <p className="text-xl font-bold mt-0.5">{checks.every(c => c.ok) ? "Alles in Ordnung" : "Handlungsbedarf"}</p>
            <p className="text-blue-200 text-xs">{checks.filter(c => c.ok).length} von {checks.length} Prüfpunkten bestanden</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {checks.map((c, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${c.ok ? "bg-[#3DB54A]/10 text-[#3DB54A]" : "bg-amber-500/10 text-amber-500"}`}>
                {c.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              </div>
              <CardTitle className="text-sm font-semibold">{c.label}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className="text-base font-medium text-[#0F2B4C]">{c.value}</p>
              <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                <Info size={12} className="mt-0.5 flex-shrink-0" />
                <span>{c.info}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
