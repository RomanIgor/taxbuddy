import { useState, useMemo } from "react";
import { useDataStore, formatCurrency, formatDate, Income, Expense } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownRight, ArrowUpRight, Filter, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const INCOME_CATEGORIES = ["Dienstleistung", "Produktverkauf", "Beratung", "Sonstiges"];
const EXPENSE_CATEGORIES = ["Software", "Hardware", "Bürobedarf", "Bewirtung", "Reisekosten", "Sonstiges"];

export default function Buchungen() {
  const { incomes, setIncomes, expenses, setExpenses } = useDataStore();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // New Income Form
  const [newIncome, setNewIncome] = useState({ date: new Date().toISOString().split('T')[0], amount: "", description: "", category: "" });
  
  // New Expense Form
  const [newExpense, setNewExpense] = useState({ date: new Date().toISOString().split('T')[0], amount: "", description: "", category: "", deductiblePercent: "100" });

  const allTransactions = useMemo(() => {
    const combined = [
      ...incomes.map(i => ({ ...i, type: "income" as const })),
      ...expenses.map(e => ({ ...e, type: "expense" as const }))
    ];

    return combined
      .filter(t => {
        if (activeTab === "income" && t.type !== "income") return false;
        if (activeTab === "expense" && t.type !== "expense") return false;
        if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
        if (monthFilter !== "all") {
          const tMonth = new Date(t.date).getMonth().toString();
          if (tMonth !== monthFilter) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [incomes, expenses, activeTab, search, monthFilter]);

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncome.date || !newIncome.amount || !newIncome.description || !newIncome.category) {
      toast({ title: "Fehler", description: "Bitte fülle alle Felder aus.", variant: "destructive" });
      return;
    }

    const income: Income = {
      id: crypto.randomUUID(),
      date: newIncome.date,
      amount: parseFloat(newIncome.amount),
      description: newIncome.description,
      category: newIncome.category
    };

    setIncomes([...incomes, income]);
    setIsIncomeModalOpen(false);
    setNewIncome({ date: new Date().toISOString().split('T')[0], amount: "", description: "", category: "" });
    toast({ title: "Erfolg", description: "Einnahme erfolgreich hinzugefügt." });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.date || !newExpense.amount || !newExpense.description || !newExpense.category) {
      toast({ title: "Fehler", description: "Bitte fülle alle Felder aus.", variant: "destructive" });
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      date: newExpense.date,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      category: newExpense.category,
      deductiblePercent: parseInt(newExpense.deductiblePercent) || 100
    };

    setExpenses([...expenses, expense]);
    setIsExpenseModalOpen(false);
    setNewExpense({ date: new Date().toISOString().split('T')[0], amount: "", description: "", category: "", deductiblePercent: "100" });
    toast({ title: "Erfolg", description: "Ausgabe erfolgreich hinzugefügt." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F2B4C]">Buchungen</h1>
          <p className="text-muted-foreground mt-1">Verwalte deine Einnahmen und Ausgaben.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">
                <Plus className="w-4 h-4 mr-2" /> Ausgabe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Ausgabe eintragen</DialogTitle>
                <DialogDescription>Erfasse eine neue betriebliche Ausgabe.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="exp-date">Datum</Label>
                  <Input id="exp-date" type="date" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-desc">Beschreibung</Label>
                  <Input id="exp-desc" placeholder="z.B. Software Abo" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exp-amount">Betrag (€)</Label>
                    <Input id="exp-amount" type="number" step="0.01" min="0" placeholder="0.00" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exp-cat">Kategorie</Label>
                    <Select value={newExpense.category} onValueChange={v => setNewExpense({...newExpense, category: v})}>
                      <SelectTrigger id="exp-cat"><SelectValue placeholder="Wählen..." /></SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-deductible">Absetzbar (%)</Label>
                  <Select value={newExpense.deductiblePercent} onValueChange={v => setNewExpense({...newExpense, deductiblePercent: v})}>
                    <SelectTrigger id="exp-deductible"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100% (Voll absetzbar)</SelectItem>
                      <SelectItem value="70">70% (Bewirtung)</SelectItem>
                      <SelectItem value="50">50% (Gemischte Nutzung)</SelectItem>
                      <SelectItem value="0">0% (Privat)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsExpenseModalOpen(false)}>Abbrechen</Button>
                  <Button type="submit" className="bg-destructive hover:bg-destructive/90 text-white">Speichern</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isIncomeModalOpen} onOpenChange={setIsIncomeModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#3DB54A] hover:bg-[#3DB54A]/90 text-white">
                <Plus className="w-4 h-4 mr-2" /> Einnahme
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Einnahme eintragen</DialogTitle>
                <DialogDescription>Erfasse eine neue betriebliche Einnahme.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddIncome} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="inc-date">Datum</Label>
                  <Input id="inc-date" type="date" value={newIncome.date} onChange={e => setNewIncome({...newIncome, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inc-desc">Beschreibung</Label>
                  <Input id="inc-desc" placeholder="z.B. Rechnung #2025-01" value={newIncome.description} onChange={e => setNewIncome({...newIncome, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inc-amount">Betrag (€)</Label>
                    <Input id="inc-amount" type="number" step="0.01" min="0" placeholder="0.00" value={newIncome.amount} onChange={e => setNewIncome({...newIncome, amount: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inc-cat">Kategorie</Label>
                    <Select value={newIncome.category} onValueChange={v => setNewIncome({...newIncome, category: v})}>
                      <SelectTrigger id="inc-cat"><SelectValue placeholder="Wählen..." /></SelectTrigger>
                      <SelectContent>
                        {INCOME_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsIncomeModalOpen(false)}>Abbrechen</Button>
                  <Button type="submit" className="bg-[#3DB54A] hover:bg-[#3DB54A]/90 text-white">Speichern</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="all">Alle</TabsTrigger>
                <TabsTrigger value="income">Einnahmen</TabsTrigger>
                <TabsTrigger value="expense">Ausgaben</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suchen..."
                  className="pl-8"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Monat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Monate</SelectItem>
                  <SelectItem value="0">Januar</SelectItem>
                  <SelectItem value="1">Februar</SelectItem>
                  <SelectItem value="2">März</SelectItem>
                  <SelectItem value="3">April</SelectItem>
                  <SelectItem value="4">Mai</SelectItem>
                  <SelectItem value="5">Juni</SelectItem>
                  <SelectItem value="6">Juli</SelectItem>
                  <SelectItem value="7">August</SelectItem>
                  <SelectItem value="8">September</SelectItem>
                  <SelectItem value="9">Oktober</SelectItem>
                  <SelectItem value="10">November</SelectItem>
                  <SelectItem value="11">Dezember</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {allTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-[#0F2B4C]">Keine Buchungen gefunden</h3>
              <p className="text-muted-foreground mt-1">Ändere deine Filter oder füge eine neue Buchung hinzu.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allTransactions.map((tx) => (
                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'income' ? 'bg-[#3DB54A]/10 text-[#3DB54A]' : 'bg-destructive/10 text-destructive'}`}>
                      {tx.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F2B4C]">{tx.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span className="bg-secondary px-2 py-0.5 rounded-full text-xs">{tx.category}</span>
                        {tx.type === 'expense' && (tx as Expense).deductiblePercent < 100 && (
                          <>
                            <span>•</span>
                            <span className="text-destructive text-xs">{(tx as Expense).deductiblePercent}% absetzbar</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 pl-16 sm:pl-0">
                    <span className={`font-bold text-lg ${tx.type === 'income' ? 'text-[#3DB54A]' : 'text-destructive'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-auto p-0 hover:bg-transparent hover:underline">
                      Bearbeiten
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
