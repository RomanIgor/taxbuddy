import { useState } from "react";
import { useDataStore, formatCurrency } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, PlusCircle, X } from "lucide-react";

const CATEGORIES = ["Beratung", "Entwicklung", "Design", "Marketing", "Sonstiges"];

export default function Einnahmen() {
  const { incomes, addIncome } = useDataStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), amount: "", description: "", category: "Beratung" });

  const total = incomes.reduce((s, i) => s + i.amount, 0);
  const sorted = [...incomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    addIncome({ date: form.date, amount: parseFloat(form.amount), description: form.description, category: form.category });
    setForm({ date: new Date().toISOString().slice(0, 10), amount: "", description: "", category: "Beratung" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2B4C]">Einnahmen</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Alle Einnahmen im Überblick</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#0066B3] hover:bg-[#0066B3]/90 text-white gap-2">
          <PlusCircle size={16} /> Einnahme hinzufügen
        </Button>
      </div>

      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#0F2B4C] to-[#0066B3] text-white">
        <CardContent className="p-6">
          <p className="text-blue-200 text-sm mb-1">Einnahmen gesamt (YTD)</p>
          <div className="text-3xl font-bold">{formatCurrency(total)}</div>
          <p className="text-blue-200 text-xs mt-1">{incomes.length} Buchungen</p>
        </CardContent>
      </Card>

      {showForm && (
        <Card className="border border-[#0066B3]/20 shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Neue Einnahme</CardTitle>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Datum</label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Betrag (€)</label>
                <Input type="number" step="0.01" placeholder="0,00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Beschreibung</label>
                <Input placeholder="z. B. Rechnung Kunde XY" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Kategorie</label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Abbrechen</Button>
                <Button type="submit" className="bg-[#3DB54A] hover:bg-[#3DB54A]/90 text-white">Speichern</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {sorted.length === 0
            ? <div className="py-12 text-center text-muted-foreground text-sm">Keine Einnahmen vorhanden.</div>
            : <div className="divide-y divide-border">
                {sorted.map(item => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#3DB54A]/10 flex items-center justify-center text-[#3DB54A]">
                        <ArrowUpRight size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F2B4C]">{item.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString("de-DE")} • {item.category}</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#3DB54A]">+{formatCurrency(item.amount)}</div>
                  </div>
                ))}
              </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}
