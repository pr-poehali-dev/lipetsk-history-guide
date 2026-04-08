import { useState } from "react";
import Icon from "@/components/ui/icon";

type TabType = "ready" | "builder";

interface Route {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  distance: string;
  difficulty: "Лёгкий" | "Средний" | "Сложный";
  stops: number;
  description: string;
  highlights: string[];
  image: string;
}

const routes: Route[] = [
  {
    id: 1,
    title: "Белокаменное кольцо",
    subtitle: "Архитектурные памятники XII–XVI веков",
    duration: "3–4 часа",
    distance: "4.2 км",
    difficulty: "Лёгкий",
    stops: 6,
    description: "Маршрут проходит через ключевые архитектурные памятники исторического центра. Вы увидите соборы, монастыри и усадьбы разных эпох.",
    highlights: ["Успенский собор", "Монастырь Троицкий", "Дворянская усадьба"],
    image: "https://cdn.poehali.dev/projects/35e99b30-aa66-45af-aba6-b153e8cdeca7/files/641250ac-a0d6-4367-9fe3-0cf0e48e7445.jpg",
  },
  {
    id: 2,
    title: "Следами древних племён",
    subtitle: "Археологические памятники VIII–X веков",
    duration: "5–6 часов",
    distance: "8.7 км",
    difficulty: "Средний",
    stops: 4,
    description: "Экспедиционный маршрут к городищам и курганам раннеславянского периода. Включает посещение музея под открытым небом.",
    highlights: ["Городище Старое", "Курганный могильник", "Петроглифы"],
    image: "https://cdn.poehali.dev/projects/35e99b30-aa66-45af-aba6-b153e8cdeca7/files/7a1577ca-82a1-40df-995b-b6896c1939f8.jpg",
  },
  {
    id: 3,
    title: "Природные реликвии",
    subtitle: "Заповедные территории и ботанические памятники",
    duration: "2–3 часа",
    distance: "3.1 км",
    difficulty: "Лёгкий",
    stops: 3,
    description: "Прогулочный маршрут по охраняемым природным территориям: реликтовый бор, исторический парк, вековые деревья.",
    highlights: ["Заповедный бор", "Парк культуры", "Родниковая роща"],
    image: "https://cdn.poehali.dev/projects/35e99b30-aa66-45af-aba6-b153e8cdeca7/files/b49a6cc5-42fe-4cfb-a828-5f884d37fda9.jpg",
  },
  {
    id: 4,
    title: "Большой исторический",
    subtitle: "Комплексный маршрут через все эпохи",
    duration: "Весь день",
    distance: "15 км",
    difficulty: "Сложный",
    stops: 12,
    description: "Полный тур по всем значимым объектам региона. Охватывает памятники от бронзового века до XIX столетия. Рекомендован транспорт.",
    highlights: ["12 ключевых объектов", "Все типы памятников", "Экскурсовод"],
    image: "https://cdn.poehali.dev/projects/35e99b30-aa66-45af-aba6-b153e8cdeca7/files/641250ac-a0d6-4367-9fe3-0cf0e48e7445.jpg",
  },
];

const allMonuments = [
  { id: 1, name: "Успенский собор", type: "Архитектура" },
  { id: 2, name: "Городище Старое", type: "Археология" },
  { id: 3, name: "Дворянская усадьба Орловых", type: "Архитектура" },
  { id: 4, name: "Курганный могильник", type: "Археология" },
  { id: 5, name: "Заповедный бор Тихий", type: "Природа" },
  { id: 6, name: "Монастырь Троицкий", type: "Архитектура" },
  { id: 7, name: "Наскальные петроглифы", type: "Археология" },
  { id: 8, name: "Парк Дворянского собрания", type: "Природа" },
  { id: 9, name: "Торговые ряды", type: "Архитектура" },
  { id: 10, name: "Аргамач-Пальна", type: "Природа" },
  { id: 11, name: "Центр романовской игрушки", type: "Культура" },
  { id: 12, name: "Усадьба Голицыных", type: "Архитектура" },
];

const typeIcon: Record<string, string> = {
  "Архитектура": "Building2",
  "Археология": "Shovel",
  "Природа": "TreePine",
  "Культура": "Palette",
};

const difficultyColor: Record<string, string> = {
  "Лёгкий": "hsl(140 40% 32%)",
  "Средний": "hsl(35 60% 40%)",
  "Сложный": "hsl(0 50% 40%)",
};

export default function RoutesPage() {
  const [tab, setTab] = useState<TabType>("ready");
  const [selected, setSelected] = useState<Route>(routes[0]);

  // Builder state
  const [routeName, setRouteName] = useState("");
  const [selectedMonuments, setSelectedMonuments] = useState<number[]>([]);
  const [savedRoute, setSavedRoute] = useState<{ name: string; monuments: typeof allMonuments } | null>(null);

  const toggleMonument = (id: number) => {
    setSelectedMonuments((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const saveRoute = () => {
    if (!routeName.trim() || selectedMonuments.length === 0) return;
    const chosen = allMonuments.filter((m) => selectedMonuments.includes(m.id));
    setSavedRoute({ name: routeName, monuments: chosen });
  };

  const resetBuilder = () => {
    setRouteName("");
    setSelectedMonuments([]);
    setSavedRoute(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div
          className="text-xs tracking-[0.2em] uppercase font-ibm mb-3 flex items-center gap-2"
          style={{ color: 'hsl(var(--gold))' }}
        >
          <div style={{ width: 20, height: 1, background: 'hsl(var(--gold))' }} />
          Туристические маршруты
        </div>
        <div className="flex items-end justify-between">
          <h1 className="font-cormorant text-5xl" style={{ color: 'hsl(var(--ink))', fontWeight: 300 }}>
            {tab === "ready" ? "Готовые путешествия" : "Конструктор маршрута"}
          </h1>
          {/* Tabs */}
          <div className="flex" style={{ border: '1px solid hsl(var(--border))' }}>
            <button
              onClick={() => setTab("ready")}
              className="px-5 py-2 text-xs tracking-[0.12em] uppercase font-ibm transition-all"
              style={{
                background: tab === "ready" ? 'hsl(var(--primary))' : 'transparent',
                color: tab === "ready" ? 'hsl(var(--primary-foreground))' : 'hsl(var(--ink-muted))',
              }}
            >
              Готовые
            </button>
            <button
              onClick={() => setTab("builder")}
              className="px-5 py-2 text-xs tracking-[0.12em] uppercase font-ibm transition-all flex items-center gap-2"
              style={{
                background: tab === "builder" ? 'hsl(var(--primary))' : 'transparent',
                color: tab === "builder" ? 'hsl(var(--primary-foreground))' : 'hsl(var(--ink-muted))',
                borderLeft: '1px solid hsl(var(--border))',
              }}
            >
              <Icon name="Pencil" size={11} />
              Свой
            </button>
          </div>
        </div>
      </div>

      {/* READY ROUTES */}
      {tab === "ready" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-3">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelected(route)}
                className="text-left p-5 transition-all"
                style={{
                  border: `1px solid ${selected.id === route.id ? 'hsl(var(--gold))' : 'hsl(var(--border))'}`,
                  background: selected.id === route.id ? 'hsl(var(--parchment-dark))' : 'transparent',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-cormorant text-lg leading-tight" style={{ color: 'hsl(var(--ink))', fontWeight: 400 }}>
                    {route.title}
                  </h3>
                  <span className="text-xs font-ibm ml-2 shrink-0" style={{ color: difficultyColor[route.difficulty] }}>
                    {route.difficulty}
                  </span>
                </div>
                <p className="font-ibm text-xs mb-3 leading-relaxed" style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}>
                  {route.subtitle}
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={10} style={{ color: 'hsl(var(--gold) / 0.7)' }} />
                    <span className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))' }}>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" size={10} style={{ color: 'hsl(var(--gold) / 0.7)' }} />
                    <span className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))' }}>{route.stops} точек</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="col-span-2" style={{ border: '1px solid hsl(var(--border))' }}>
            <div className="relative h-56 overflow-hidden">
              <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(var(--ink) / 0.85), transparent 60%)' }} />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="text-xs tracking-[0.15em] uppercase font-ibm mb-2" style={{ color: difficultyColor[selected.difficulty] }}>
                  {selected.difficulty}
                </div>
                <h2 className="font-cormorant text-3xl" style={{ color: 'hsl(36 30% 94%)', fontWeight: 300 }}>
                  {selected.title}
                </h2>
              </div>
            </div>

            <div className="p-6" style={{ background: 'hsl(var(--parchment-dark))' }}>
              <div className="grid grid-cols-3 gap-4 pb-5 mb-5" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                {[
                  { icon: "Clock", label: "Продолжительность", val: selected.duration },
                  { icon: "Route", label: "Расстояние", val: selected.distance },
                  { icon: "Flag", label: "Остановок", val: `${selected.stops} точек` },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <Icon name={item.icon} size={16} style={{ color: 'hsl(var(--gold))', marginBottom: 4, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                    <div className="font-cormorant text-xl" style={{ color: 'hsl(var(--ink))' }}>{item.val}</div>
                    <div className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <p className="font-ibm text-sm leading-relaxed mb-5" style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}>
                {selected.description}
              </p>

              <div className="mb-6">
                <div className="text-xs tracking-[0.15em] uppercase font-ibm mb-3" style={{ color: 'hsl(var(--gold))' }}>
                  Ключевые объекты
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.highlights.map((h) => (
                    <span key={h} className="px-3 py-1 text-xs font-ibm" style={{ border: '1px solid hsl(var(--border))', color: 'hsl(var(--ink-muted))' }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className="w-full py-3 text-xs tracking-[0.15em] uppercase font-ibm transition-all hover:opacity-80 flex items-center justify-center gap-2"
                style={{ background: 'hsl(var(--gold))', color: 'hsl(var(--ink))' }}
              >
                <Icon name="Navigation" size={12} />
                Начать маршрут
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUILDER */}
      {tab === "builder" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left — monument picker */}
          <div className="col-span-2">
            <div className="mb-5">
              <label className="block text-xs tracking-[0.15em] uppercase font-ibm mb-2" style={{ color: 'hsl(var(--gold))' }}>
                Название маршрута
              </label>
              <input
                type="text"
                placeholder="Например: Мой архивный тур..."
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="w-full px-4 py-3 font-ibm text-sm outline-none"
                style={{
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--parchment-dark))',
                  color: 'hsl(var(--ink))',
                  fontWeight: 300,
                }}
              />
            </div>

            <div className="text-xs tracking-[0.15em] uppercase font-ibm mb-3" style={{ color: 'hsl(var(--gold))' }}>
              Выберите объекты для маршрута
            </div>

            <div className="grid grid-cols-2 gap-3">
              {allMonuments.map((m) => {
                const active = selectedMonuments.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMonument(m.id)}
                    className="text-left p-4 transition-all flex items-center gap-3"
                    style={{
                      border: `1px solid ${active ? 'hsl(var(--gold))' : 'hsl(var(--border))'}`,
                      background: active ? 'hsl(var(--gold) / 0.07)' : 'transparent',
                    }}
                  >
                    <div
                      className="w-7 h-7 flex items-center justify-center shrink-0"
                      style={{
                        border: `1px solid ${active ? 'hsl(var(--gold))' : 'hsl(var(--border))'}`,
                        background: active ? 'hsl(var(--gold))' : 'transparent',
                      }}
                    >
                      {active
                        ? <Icon name="Check" size={12} style={{ color: 'hsl(var(--ink))' }} />
                        : <Icon name={typeIcon[m.type] ?? "MapPin"} size={12} style={{ color: 'hsl(var(--ink-muted))' }} />
                      }
                    </div>
                    <div>
                      <div className="font-cormorant text-base leading-tight" style={{ color: 'hsl(var(--ink))', fontWeight: 400 }}>
                        {m.name}
                      </div>
                      <div className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}>
                        {m.type}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right — route summary */}
          <div style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
            <div className="p-6" style={{ border: '1px solid hsl(var(--border))', background: 'hsl(var(--parchment-dark))' }}>
              <div className="text-xs tracking-[0.15em] uppercase font-ibm mb-4" style={{ color: 'hsl(var(--gold))' }}>
                Ваш маршрут
              </div>

              {selectedMonuments.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Route" size={28} style={{ color: 'hsl(var(--gold) / 0.25)', margin: '0 auto 10px' }} />
                  <p className="font-cormorant text-lg italic" style={{ color: 'hsl(var(--ink-muted))' }}>
                    Выберите объекты слева
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 space-y-2">
                    {selectedMonuments.map((id, idx) => {
                      const m = allMonuments.find((x) => x.id === id);
                      if (!m) return null;
                      return (
                        <div key={id} className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 flex items-center justify-center shrink-0 font-ibm text-xs"
                            style={{ background: 'hsl(var(--gold))', color: 'hsl(var(--ink))' }}
                          >
                            {idx + 1}
                          </div>
                          <span className="font-ibm text-sm" style={{ color: 'hsl(var(--ink))', fontWeight: 300 }}>
                            {m.name}
                          </span>
                          <button
                            onClick={() => toggleMonument(id)}
                            className="ml-auto shrink-0"
                            style={{ color: 'hsl(var(--ink-muted))' }}
                          >
                            <Icon name="X" size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="py-3 mb-4 flex items-center justify-between text-xs font-ibm"
                    style={{ borderTop: '1px solid hsl(var(--border))', color: 'hsl(var(--ink-muted))' }}
                  >
                    <span>{selectedMonuments.length} объектов</span>
                    <span>~{selectedMonuments.length * 30} мин.</span>
                  </div>
                </>
              )}

              {savedRoute && (
                <div className="mb-4 p-3" style={{ background: 'hsl(140 40% 32% / 0.1)', border: '1px solid hsl(140 40% 32% / 0.3)' }}>
                  <div className="flex items-center gap-2 text-xs font-ibm" style={{ color: 'hsl(140 40% 32%)' }}>
                    <Icon name="CheckCircle" size={13} />
                    Маршрут «{savedRoute.name}» сохранён!
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button
                  onClick={saveRoute}
                  disabled={!routeName.trim() || selectedMonuments.length === 0}
                  className="w-full py-3 text-xs tracking-[0.15em] uppercase font-ibm transition-all hover:opacity-80 flex items-center justify-center gap-2"
                  style={{
                    background: (!routeName.trim() || selectedMonuments.length === 0)
                      ? 'hsl(var(--border))'
                      : 'hsl(var(--gold))',
                    color: (!routeName.trim() || selectedMonuments.length === 0)
                      ? 'hsl(var(--ink-muted))'
                      : 'hsl(var(--ink))',
                    cursor: (!routeName.trim() || selectedMonuments.length === 0) ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Icon name="Save" size={12} />
                  Сохранить маршрут
                </button>
                {(selectedMonuments.length > 0 || routeName) && (
                  <button
                    onClick={resetBuilder}
                    className="w-full py-2 text-xs tracking-[0.12em] uppercase font-ibm"
                    style={{ color: 'hsl(var(--ink-muted))', border: '1px solid hsl(var(--border))' }}
                  >
                    Очистить
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
