import { useState, useMemo } from "react";
import { useDataStore, formatCurrency, formatDate, Trip, KILOMETERPAUSCHALE } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Car, MapPin, Plus, Route as RouteIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Fahrtenbuch() {
  const { trips, setTrips } = useDataStore();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({
    date: new Date().toISOString().split('T')[0],
    from: "",
    to: "",
    km: "",
    purpose: ""
  });

  const totalKm = useMemo(() => trips.reduce((sum, t) => sum + t.km, 0), [trips]);
  const totalPauschale = totalKm * KILOMETERPAUSCHALE;

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.date || !newTrip.from || !newTrip.to || !newTrip.km || !newTrip.purpose) {
      toast({ title: "Fehler", description: "Bitte fülle alle Felder aus.", variant: "destructive" });
      return;
    }

    const km = parseFloat(newTrip.km);
    if (isNaN(km) || km <= 0) {
      toast({ title: "Fehler", description: "Kilometer müssen größer als 0 sein.", variant: "destructive" });
      return;
    }

    const trip: Trip = {
      id: crypto.randomUUID(),
      date: newTrip.date,
      from: newTrip.from,
      to: newTrip.to,
      km,
      purpose: newTrip.purpose
    };

    setTrips([...trips, trip].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsOpen(false);
    setNewTrip({ date: new Date().toISOString().split('T')[0], from: "", to: "", km: "", purpose: "" });
    toast({ title: "Erfolg", description: "Fahrt erfolgreich hinzugefügt." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F2B4C]">Fahrtenbuch</h1>
          <p className="text-muted-foreground mt-1">Erfasse deine betrieblichen Fahrten für die Kilometerpauschale.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0066B3] hover:bg-[#0066B3]/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Neue Fahrt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fahrt eintragen</DialogTitle>
              <DialogDescription>Erfasse eine neue betriebliche Fahrt.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTrip} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="trip-date">Datum</Label>
                <Input id="trip-date" type="date" value={newTrip.date} onChange={e => setNewTrip({...newTrip, date: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trip-from">Von</Label>
                  <Input id="trip-from" placeholder="Startort" value={newTrip.from} onChange={e => setNewTrip({...newTrip, from: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trip-to">Nach</Label>
                  <Input id="trip-to" placeholder="Zielort" value={newTrip.to} onChange={e => setNewTrip({...newTrip, to: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trip-km">Gefahrene Kilometer</Label>
                  <Input id="trip-km" type="number" step="0.1" min="0" placeholder="0" value={newTrip.km} onChange={e => setNewTrip({...newTrip, km: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Pauschale (€)</Label>
                  <div className="h-10 flex items-center px-3 border rounded-md bg-muted/50 text-muted-foreground font-medium">
                    {formatCurrency(parseFloat(newTrip.km || "0") * KILOMETERPAUSCHALE)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-purpose">Reisezweck</Label>
                <Input id="trip-purpose" placeholder="z.B. Kundenmeeting, Materialeinkauf" value={newTrip.purpose} onChange={e => setNewTrip({...newTrip, purpose: e.target.value})} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Abbrechen</Button>
                <Button type="submit" className="bg-[#0066B3] hover:bg-[#0066B3]/90 text-white">Speichern</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-[#0F2B4C] to-[#0066B3] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Gesamtkilometer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalKm.toFixed(1)} <span className="text-xl font-normal text-blue-200">km</span></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Kilometerpauschale
              <span className="text-xs bg-muted px-2 py-1 rounded text-foreground">{formatCurrency(KILOMETERPAUSCHALE)} / km</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#3DB54A]">{formatCurrency(totalPauschale)}</div>
            <p className="text-sm text-muted-foreground mt-1">Absetzbarer Betrag für die Steuererklärung</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fahrten gesamt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#0F2B4C]">{trips.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Erfasste Einträge in diesem Jahr</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Fahrtenverlauf</CardTitle>
          <CardDescription>Chronologische Liste aller aufgezeichneten betrieblichen Fahrten.</CardDescription>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-[#0F2B4C]">Keine Fahrten eingetragen</h3>
              <p className="text-muted-foreground mt-1">Trage deine erste betriebliche Fahrt ein.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div key={trip.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066B3] flex items-center justify-center shrink-0 mt-1 sm:mt-0">
                      <RouteIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium text-[#0F2B4C]">{trip.from}</span>
                        <span className="text-muted-foreground text-sm">→</span>
                        <span className="font-medium text-[#0F2B4C]">{trip.to}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <span>{formatDate(trip.date)}</span>
                        <span>•</span>
                        <span>{trip.purpose}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pl-14 sm:pl-0 border-t sm:border-0 pt-2 sm:pt-0">
                    <span className="font-bold text-lg text-[#0F2B4C]">
                      {trip.km} km
                    </span>
                    <span className="text-xs font-medium text-[#3DB54A]">
                      {formatCurrency(trip.km * KILOMETERPAUSCHALE)}
                    </span>
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
