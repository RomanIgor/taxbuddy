import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Receipt, 
  Car, 
  Lightbulb, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";
import raccoon from "@/assets/raccoon_mascot.png";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buchungen", label: "Buchungen", icon: Receipt },
  { href: "/fahrtenbuch", label: "Fahrtenbuch", icon: Car },
  { href: "/tipps", label: "Steuer-Tipps", icon: Lightbulb },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar">
        <Link href="/" className="flex items-center gap-3">
          <img src={raccoon} alt="TAXbuddy Mascot" className="w-8 h-8 object-contain" />
          <div className="font-bold text-xl tracking-tight">
            <span className="text-[#0F2B4C]">TAX</span>
            <span className="text-[#3DB54A]">buddy</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/profil"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            location === "/profil"
              ? "bg-sidebar-accent text-sidebar-accent-foreground" 
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <User className={cn("w-5 h-5", location === "/profil" ? "text-primary" : "text-muted-foreground")} />
          Profil
        </Link>
      </div>
    </aside>
  );
}
