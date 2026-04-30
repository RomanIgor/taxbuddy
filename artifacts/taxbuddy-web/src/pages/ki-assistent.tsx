import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import raccoon from "@/assets/raccoon_mascot.png";

type Msg = { role: "user" | "bot"; text: string };

const SUGGESTED = [
  "Welche Ausgaben kann ich absetzen?",
  "Wie funktioniert die Kleinunternehmerregelung?",
  "Was ist der Unterschied zwischen Umsatz und Gewinn?",
  "Alle Fragen anzeigen",
];

const BOT_RESPONSES: Record<string, string> = {
  default: "Das ist eine gute Frage! Als KI-Steuerassistent empfehle ich dir, deine Buchungen aktuell zu halten und regelmäßig deinen §19-Status zu prüfen. Für konkrete Steuerberatung wende dich bitte an einen Steuerberater.",
  absetzen: "Als Kleinunternehmer kannst du folgende Ausgaben absetzen: Büromaterial, Software & Abos, Arbeitsmittel, Fahrkosten (Kilometerpauschale 0,30 €/km), Fortbildungen, Bewirtungskosten (70%) und Home-Office-Pauschale.",
  kleinunternehmer: "Die Kleinunternehmerregelung nach §19 UStG befreit dich von der Umsatzsteuerpflicht, solange dein Jahresumsatz unter €22.000 liegt. Du darfst keine Umsatzsteuer ausweisen und kannst keine Vorsteuer geltend machen.",
  umsatz: "Umsatz ist die Summe aller Einnahmen. Gewinn ist Umsatz minus Betriebsausgaben. Dein Gewinn ist also das, was nach Abzug aller Kosten übrig bleibt – und worauf du Einkommensteuer zahlst.",
};

function getResponse(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("absetz") || lower.includes("ausgab")) return BOT_RESPONSES.absetzen;
  if (lower.includes("kleinunternehm")) return BOT_RESPONSES.kleinunternehmer;
  if (lower.includes("umsatz") && lower.includes("gewinn")) return BOT_RESPONSES.umsatz;
  return BOT_RESPONSES.default;
}

export default function KiAssistent() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hallo! Ich bin dein KI-Steuer-Assistent. Wie kann ich dir heute helfen?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const q = text.trim();
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { role: "bot", text: getResponse(q) }]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0F2B4C]">KI-Assistent</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Dein intelligenter Steuer-Buddy</p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Chat */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {m.role === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-[#0F2B4C] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={raccoon} alt="bot" className="w-8 h-8 object-contain" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "bot" ? "bg-[#F5F7FA] text-[#0F2B4C]" : "bg-[#0066B3] text-white"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t p-3 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Stell mir eine Frage..."
              className="flex-1"
            />
            <Button onClick={() => send(input)} className="bg-[#0066B3] hover:bg-[#0066B3]/90 text-white px-4">
              <Send size={16} />
            </Button>
          </div>
        </div>

        {/* Suggested questions */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={14} className="text-[#0066B3]" />
              <p className="text-xs font-semibold text-[#0F2B4C]">Deine Fragen</p>
            </div>
            <div className="space-y-2">
              {SUGGESTED.map((q, i) => (
                <button
                  key={i}
                  onClick={() => send(q)}
                  className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-border hover:border-[#0066B3]/40 hover:bg-[#0066B3]/5 text-[#0F2B4C] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
