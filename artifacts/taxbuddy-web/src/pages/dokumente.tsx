import { FileText, Upload, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEMO_DOCS = [
  { name: "Rechnung_CAG_GmbH_April.pdf",  date: "15.04.2026", size: "124 KB", type: "Rechnung" },
  { name: "AWS_Rechnung_Maerz.pdf",        date: "01.03.2026", size: "89 KB",  type: "Ausgabe" },
  { name: "Steuererklaerung_2025.pdf",     date: "12.02.2026", size: "342 KB", type: "Steuerdokument" },
  { name: "Vertrag_Freelance_2026.pdf",    date: "02.01.2026", size: "211 KB", type: "Vertrag" },
];

export default function Dokumente() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2B4C]">Dokumente</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Belege und Dokumente verwalten</p>
        </div>
        <Button className="bg-[#0066B3] hover:bg-[#0066B3]/90 text-white gap-2">
          <Upload size={16} /> Dokument hochladen
        </Button>
      </div>

      <div className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center gap-3 hover:border-[#0066B3]/40 transition-colors cursor-pointer bg-white">
        <div className="w-12 h-12 rounded-full bg-[#0066B3]/10 flex items-center justify-center">
          <Upload size={22} className="text-[#0066B3]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[#0F2B4C]">Beleg hochladen oder per Drag & Drop ablegen</p>
          <p className="text-xs text-muted-foreground mt-0.5">PDF, JPG, PNG bis 10 MB</p>
        </div>
        <Button variant="outline" size="sm">Datei auswählen</Button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen size={16} className="text-[#0066B3]" />
          <h2 className="text-base font-semibold text-[#0F2B4C]">Alle Dokumente</h2>
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {DEMO_DOCS.map((doc, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0066B3]/10 flex items-center justify-center">
                      <FileText size={16} className="text-[#0066B3]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F2B4C]">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.date} • {doc.size} • {doc.type}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#0066B3] text-xs">Öffnen</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
