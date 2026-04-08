import { useState } from "react";
import Icon from "@/components/ui/icon";

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

const difficultyColor: Record<string, string> = {
  "Лёгкий": "hsl(140 40% 32%)",
  "Средний": "hsl(35 60% 40%)",
  "Сложный": "hsl(0 50% 40%)",
};

export default function RoutesPage() {
  const [selected, setSelected] = useState<Route>(routes[0]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div
          className="text-xs tracking-[0.2em] uppercase font-ibm mb-3 flex items-center gap-2"
          style={{ color: 'hsl(var(--gold))' }}
        >
          <div style={{ width: 20, height: 1, background: 'hsl(var(--gold))' }} />
          Туристические маршруты
        </div>
        <h1
          className="font-cormorant text-5xl"
          style={{ color: 'hsl(var(--ink))', fontWeight: 300 }}
        >
          Готовые путешествия
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Route list */}
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
                <h3
                  className="font-cormorant text-lg leading-tight"
                  style={{ color: 'hsl(var(--ink))', fontWeight: 400 }}
                >
                  {route.title}
                </h3>
                <span
                  className="text-xs font-ibm ml-2 shrink-0"
                  style={{ color: difficultyColor[route.difficulty] }}
                >
                  {route.difficulty}
                </span>
              </div>
              <p
                className="font-ibm text-xs mb-3 leading-relaxed"
                style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}
              >
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

        {/* Route detail */}
        <div
          className="col-span-2"
          style={{ border: '1px solid hsl(var(--border))' }}
        >
          <div className="relative h-56 overflow-hidden">
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, hsl(var(--ink) / 0.85), transparent 60%)' }}
            />
            <div className="absolute bottom-0 left-0 p-6">
              <div
                className="text-xs tracking-[0.15em] uppercase font-ibm mb-2"
                style={{ color: difficultyColor[selected.difficulty] }}
              >
                {selected.difficulty}
              </div>
              <h2
                className="font-cormorant text-3xl"
                style={{ color: 'hsl(36 30% 94%)', fontWeight: 300 }}
              >
                {selected.title}
              </h2>
            </div>
          </div>

          <div className="p-6" style={{ background: 'hsl(var(--parchment-dark))' }}>
            {/* Stats row */}
            <div
              className="grid grid-cols-3 gap-4 pb-5 mb-5"
              style={{ borderBottom: '1px solid hsl(var(--border))' }}
            >
              {[
                { icon: "Clock", label: "Продолжительность", val: selected.duration },
                { icon: "Footprints", label: "Расстояние", val: selected.distance },
                { icon: "Flag", label: "Остановок", val: `${selected.stops} точек` },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <Icon name={item.icon} size={16} style={{ color: 'hsl(var(--gold))', marginBottom: 4, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                  <div className="font-cormorant text-xl" style={{ color: 'hsl(var(--ink))' }}>{item.val}</div>
                  <div className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}>{item.label}</div>
                </div>
              ))}
            </div>

            <p
              className="font-ibm text-sm leading-relaxed mb-5"
              style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}
            >
              {selected.description}
            </p>

            {/* Highlights */}
            <div className="mb-6">
              <div
                className="text-xs tracking-[0.15em] uppercase font-ibm mb-3"
                style={{ color: 'hsl(var(--gold))' }}
              >
                Ключевые объекты
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.highlights.map((h) => (
                  <span
                    key={h}
                    className="px-3 py-1 text-xs font-ibm"
                    style={{
                      border: '1px solid hsl(var(--border))',
                      color: 'hsl(var(--ink-muted))',
                    }}
                  >
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
    </div>
  );
}