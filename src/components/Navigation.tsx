import Icon from "@/components/ui/icon";

type Page = "home" | "map" | "routes" | "catalog";

interface NavigationProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Landmark" },
  { id: "map", label: "Карта", icon: "Map" },
  { id: "routes", label: "Маршруты", icon: "Route" },
  { id: "catalog", label: "Каталог", icon: "BookOpen" },
];

export default function Navigation({ activePage, onNavigate }: NavigationProps) {
  return (
    <header
      style={{ background: 'hsl(var(--ink))', borderBottom: '1px solid hsl(var(--gold) / 0.3)' }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 group"
        >
          <div
            style={{ border: '1px solid hsl(var(--gold) / 0.6)' }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <Icon name="Landmark" size={14} style={{ color: 'hsl(var(--gold))' }} />
          </div>
          <div>
            <div
              className="font-cormorant text-sm tracking-widest uppercase"
              style={{ color: 'hsl(var(--gold))' }}
            >
              Исторический
            </div>
            <div
              className="font-cormorant text-xs tracking-[0.2em] uppercase"
              style={{ color: 'hsl(var(--gold) / 0.6)', marginTop: '-2px' }}
            >
              Гид
            </div>
          </div>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-link flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors font-ibm ${
                activePage === item.id ? "active" : ""
              }`}
              style={{
                color: activePage === item.id
                  ? 'hsl(var(--gold))'
                  : 'hsl(var(--gold) / 0.55)',
              }}
            >
              <Icon name={item.icon} size={12} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
