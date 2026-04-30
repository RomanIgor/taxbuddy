import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Car,
  FileText,
  ShieldCheck,
  Lightbulb,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import raccoon from "@/assets/raccoon_mascot.png";

const navMain = [
  { href: "/",              label: "Übersicht",    icon: LayoutDashboard },
  { href: "/einnahmen",     label: "Einnahmen",    icon: TrendingUp },
  { href: "/ausgaben",      label: "Ausgaben",     icon: TrendingDown },
  { href: "/fahrtenbuch",   label: "Fahrten",      icon: Car },
  { href: "/dokumente",     label: "Dokumente",    icon: FileText },
  { href: "/steuer-check",  label: "Steuer-Check", icon: ShieldCheck },
  { href: "/tipps",         label: "Tipps",        icon: Lightbulb },
  { href: "/ki-assistent",  label: "KI-Assistent", icon: Bot },
];

const navBottom = [
  { href: "/profil", label: "Einstellungen", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
            <img
              src={raccoon}
              alt="TAXbuddy Waschbär"
              className="w-full h-full object-contain"
              style={{ imageRendering: "auto" }}
            />
          </div>
          <div className="leading-none">
            <span className="text-xl font-extrabold tracking-tight text-white">TAX</span>
            <span className="text-xl font-bold tracking-tight text-[#3DB54A]">buddy</span>
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navMain.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-white border-l-[3px] border-[#3DB54A]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white border-l-[3px] border-transparent"
              )}
            >
              <Icon
                className={cn("w-4.5 h-4.5 flex-shrink-0", active ? "text-[#3DB54A]" : "text-sidebar-foreground")}
                size={18}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-4 pt-2 border-t border-sidebar-border space-y-0.5">
        {navBottom.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white"
              )}
            >
              <Icon size={18} className={cn("flex-shrink-0", active ? "text-[#3DB54A]" : "text-sidebar-foreground")} />
              {item.label}
            </Link>
          );
        })}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white transition-all">
          <LogOut size={18} className="flex-shrink-0" />
          Abmelden
        </button>
      </div>
    </aside>
  );
}
