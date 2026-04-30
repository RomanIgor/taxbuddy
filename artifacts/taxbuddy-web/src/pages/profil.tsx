import { useState, useEffect } from "react";
import { useDataStore, Profile } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Briefcase, FileText, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profil() {
  const { profile, setProfile } = useDataStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Profile>(profile);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.businessType) {
      toast({ title: "Fehler", description: "Bitte fülle die Pflichtfelder aus.", variant: "destructive" });
      return;
    }
    
    setProfile(formData);
    setIsDirty(false);
    toast({ title: "Erfolg", description: "Profil erfolgreich aktualisiert." });
  };

  const handleReset = () => {
    setFormData(profile);
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2B4C]">Profil</h1>
        <p className="text-muted-foreground mt-1">Verwalte deine persönlichen Daten und Steuereinstellungen.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-[#0066B3]" />
                Persönliche Daten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vollständiger Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => handleChange('name', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Art der Tätigkeit</Label>
                <Input 
                  id="businessType" 
                  placeholder="z.B. Freiberufler, Gewerbetreibender"
                  value={formData.businessType} 
                  onChange={e => handleChange('businessType', e.target.value)} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0066B3]" />
                Steuer-Einstellungen
              </CardTitle>
              <CardDescription>
                Wichtige Parameter für die Berechnung deiner Grenzen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxYear">Steuerjahr</Label>
                <Select 
                  value={formData.taxYear.toString()} 
                  onValueChange={v => handleChange('taxYear', parseInt(v))}
                >
                  <SelectTrigger id="taxYear">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenueLimit">Jahresgrenze §19 UStG (€)</Label>
                <Input 
                  id="revenueLimit" 
                  type="number"
                  value={formData.yearlyRevenueLimit} 
                  onChange={e => handleChange('yearlyRevenueLimit', parseInt(e.target.value) || 22000)} 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Der Standardwert für Kleinunternehmer liegt derzeit bei 22.000 €.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 flex justify-end gap-2 pt-6">
              <Button variant="outline" onClick={handleReset} disabled={!isDirty}>Abbrechen</Button>
              <Button onClick={handleSave} disabled={!isDirty} className="bg-[#0066B3] hover:bg-[#0066B3]/90 text-white">
                Änderungen speichern
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm bg-[#0F2B4C] text-white">
            <CardHeader>
              <CardTitle className="text-white text-lg">Dein Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Tätigkeit</p>
                  <p className="font-medium">{profile.businessType || "Nicht angegeben"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Aktuelles Steuerjahr</p>
                  <p className="font-medium">{profile.taxYear}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-blue-200 mb-1">Gewählter Tarif</p>
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#3DB54A]/20 text-[#3DB54A] border border-[#3DB54A]/30">
                  Kleinunternehmer (§19 UStG)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
