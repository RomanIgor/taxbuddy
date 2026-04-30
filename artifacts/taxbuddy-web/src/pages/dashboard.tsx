import { useDataStore, formatCurrency } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Car } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { incomes, expenses, trips, profile } = useDataStore();

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const profit = totalIncome - totalExpense;
  const totalKm = trips.reduce((sum, item) => sum + item.km, 0);

  const revenueLimit = profile.yearlyRevenueLimit;
  const progressPercent = Math.min((totalIncome / revenueLimit) * 100, 100);

  const recentTransactions = [...incomes.map(i => ({...i, type: 'income'})), ...expenses.map(e => ({...e, type: 'expense'}))]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F2B4C]">Willkommen zurück, {profile.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Hier ist dein aktueller Finanzstatus für das Steuerjahr {profile.taxYear}.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/buchungen">
            <Button className="bg-[#0066B3] hover:bg-[#0066B3]/90 text-white">Neue Buchung</Button>
          </Link>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <span>§19 UStG Jahresgrenze ({formatCurrency(revenueLimit)})</span>
            <span className="text-sm font-normal text-muted-foreground">{progressPercent.toFixed(1)}% erreicht</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-3 mb-2" indicatorClassName={progressPercent > 90 ? "bg-destructive" : progressPercent > 75 ? "bg-yellow-500" : "bg-[#3DB54A]"} />
          <div className="flex justify-between text-sm">
            <span className="font-medium text-[#0F2B4C]">{formatCurrency(totalIncome)} Umsatz</span>
            <span className="text-muted-foreground">Noch {formatCurrency(revenueLimit - totalIncome)} bis zur Grenze</span>
          </div>
          {progressPercent > 90 && (
            <p className="text-destructive text-sm mt-3 font-medium bg-destructive/10 p-2 rounded-md">
              Achtung: Du näherst dich der Kleinunternehmergrenze. Bei Überschreitung bist du im nächsten Jahr umsatzsteuerpflichtig!
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Einnahmen (YTD)</CardTitle>
            <div className="w-8 h-8 rounded-full bg-[#3DB54A]/10 flex items-center justify-center text-[#3DB54A]">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F2B4C]">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ausgaben (YTD)</CardTitle>
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F2B4C]">{formatCurrency(totalExpense)}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gewinn</CardTitle>
            <div className="w-8 h-8 rounded-full bg-[#0066B3]/10 flex items-center justify-center text-[#0066B3]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F2B4C]">{formatCurrency(profit)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Letzte Buchungen</CardTitle>
              <Link href="/buchungen" className="text-sm text-[#0066B3] hover:underline font-medium">Alle ansehen</Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">Keine Buchungen vorhanden.</div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((tx, idx) => (
                  <div key={`${tx.type}-${tx.id}-${idx}`} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-[#3DB54A]/10 text-[#3DB54A]' : 'bg-destructive/10 text-destructive'}`}>
                        {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-[#0F2B4C]">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('de-DE')} • {tx.category}</p>
                      </div>
                    </div>
                    <div className={`font-semibold ${tx.type === 'income' ? 'text-[#3DB54A]' : 'text-destructive'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-[#0F2B4C] to-[#0066B3] text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-[#3DB54A]" />
              Fahrtenbuch
            </CardTitle>
            <CardDescription className="text-blue-100">Laufendes Jahr</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{totalKm} km</div>
            <p className="text-sm text-blue-100 mb-6">Betriebliche Fahrten</p>
            
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-blue-100 mb-1">Voraussichtliche Pauschale</p>
              <div className="text-xl font-semibold text-[#3DB54A]">{formatCurrency(totalKm * 0.3)}</div>
              <p className="text-xs text-blue-200 mt-1">@ 0,30 € / km</p>
            </div>

            <Link href="/fahrtenbuch">
              <Button className="w-full mt-6 bg-white text-[#0F2B4C] hover:bg-gray-100">Fahrt eintragen</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
