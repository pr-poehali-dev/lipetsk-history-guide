import { useState } from "react";
import Icon from "@/components/ui/icon";
import ArticlePage from "@/components/ArticlePage";

interface Monument {
  id: number;
  name: string;
  type: string;
  period: string;
  x: number;
  y: number;
  desc: string;
}

const monuments: Monument[] = [
  { id: 1, name: "Успенский собор", type: "Архитектура", period: "XII в.", x: 38, y: 30, desc: "Белокаменный собор домонгольского периода, памятник федерального значения." },
  { id: 2, name: "Городище Старое", type: "Археология", period: "VIII–X вв.", x: 62, y: 45, desc: "Остатки раннесредневекового укреплённого поселения с оборонительными валами." },
  { id: 3, name: "Дворянская усадьба", type: "Архитектура", period: "XVIII в.", x: 28, y: 58, desc: "Усадебный комплекс эпохи классицизма, главный дом с колонным портиком." },
  { id: 4, name: "Курганный могильник", type: "Археология", period: "VI–VIII вв.", x: 70, y: 25, desc: "Группа курганов раннеславянского времени, частично исследована экспедицией 1987 г." },
  { id: 5, name: "Заповедный бор", type: "Природа", period: "XIX в.", x: 48, y: 65, desc: "Реликтовый сосновый бор, охраняемый с 1890 года, ботанический памятник." },
  { id: 6, name: "Монастырь Троицкий", type: "Архитектура", period: "XVI в.", x: 18, y: 42, desc: "Монастырский ансамбль с сохранившимися трапезной, звонницей и кельями." },
  { id: 7, name: "Наскальные петроглифы", type: "Археология", period: "III тыс. до н.э.", x: 80, y: 55, desc: "Наскальные изображения эпохи бронзы, открытые в 1962 году." },
  { id: 8, name: "Парк культуры", type: "Природа", period: "XIX в.", x: 52, y: 38, desc: "Исторический пейзажный парк с редкими породами деревьев и беседками." },
  { id: 13, name: "Аргамач-Пальна", type: "Природа", period: "–", x: 35, y: 72, desc: "Природно-исторический памятник на высоком берегу Быстрой Сосны с городищем скифского времени." },
  { id: 14, name: "Центр романовской игрушки", type: "Культура", period: "XIX в.", x: 58, y: 20, desc: "Центр возрождения уникального народного промысла — романовской глиняной игрушки Липецкого края." },
];

const typeColors: Record<string, string> = {
  "Архитектура": "hsl(35 60% 40%)",
  "Археология": "hsl(200 50% 35%)",
  "Природа": "hsl(140 40% 32%)",
  "Культура": "hsl(280 35% 40%)",
};

export default function MapPage() {
  const [selected, setSelected] = useState<Monument | null>(null);
  const [filterType, setFilterType] = useState<string>("Все");
  const [articleId, setArticleId] = useState<number | null>(null);

  if (articleId !== null) {
    return <ArticlePage monumentId={articleId} onBack={() => setArticleId(null)} />;
  }

  const types = ["Все", "Архитектура", "Археология", "Природа", "Культура"];
  const filtered = filterType === "Все" ? monuments : monuments.filter((m) => m.type === filterType);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs tracking-[0.2em] uppercase font-ibm mb-3 flex items-center gap-2" style={{ color: 'hsl(var(--gold))' }}>
          <div style={{ width: 20, height: 1, background: 'hsl(var(--gold))' }} />
          Интерактивная карта
        </div>
        <h1 className="font-cormorant text-5xl" style={{ color: 'hsl(var(--ink))', fontWeight: 300 }}>
          Памятники на карте
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`filter-chip px-4 py-2 ${filterType === type ? "active" : ""}`}
            style={{
              background: filterType === type ? 'hsl(var(--primary))' : 'transparent',
              color: filterType === type ? 'hsl(var(--primary-foreground))' : 'hsl(var(--ink-muted))',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Map */}
        <div
          className="col-span-2 relative overflow-hidden"
          style={{ height: 520, border: '1px solid hsl(var(--border))', background: 'hsl(var(--parchment-dark))' }}
        >
          <img
            src="https://cdn.poehali.dev/projects/35e99b30-aa66-45af-aba6-b153e8cdeca7/files/b49a6cc5-42fe-4cfb-a828-5f884d37fda9.jpg"
            alt="Карта"
            className="w-full h-full object-cover opacity-40"
          />

          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--gold) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold) / 0.08) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />

          {/* Compass */}
          <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center font-cormorant text-sm font-bold"
            style={{ border: '1px solid hsl(var(--gold) / 0.4)', color: 'hsl(var(--gold))' }}>
            С
          </div>

          {/* Markers */}
          {filtered.map((monument) => (
            <button
              key={monument.id}
              onClick={() => setSelected(monument)}
              className="absolute group"
              style={{ left: `${monument.x}%`, top: `${monument.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div
                className="map-marker relative"
                style={{
                  background: selected?.id === monument.id ? 'hsl(var(--gold))' : typeColors[monument.type],
                  width: selected?.id === monument.id ? 16 : 12,
                  height: selected?.id === monument.id ? 16 : 12,
                }}
              />
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 whitespace-nowrap text-xs font-ibm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: 'hsl(var(--ink))', color: 'hsl(var(--gold))', border: '1px solid hsl(var(--gold) / 0.3)' }}
              >
                {monument.name}
              </div>
            </button>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 p-3"
            style={{ background: 'hsl(var(--parchment) / 0.9)', border: '1px solid hsl(var(--border))' }}>
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2 mb-1 last:mb-0">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="p-6" style={{ border: '1px solid hsl(var(--border))', background: 'hsl(var(--parchment-dark))' }}>
          {selected ? (
            <div className="fade-in-up">
              <div className="text-xs tracking-[0.15em] uppercase font-ibm mb-4 flex items-center gap-2"
                style={{ color: typeColors[selected.type] }}>
                <div className="w-2 h-2 rounded-full" style={{ background: typeColors[selected.type] }} />
                {selected.type}
              </div>

              <h3 className="font-cormorant text-2xl mb-2 leading-tight" style={{ color: 'hsl(var(--ink))', fontWeight: 400 }}>
                {selected.name}
              </h3>

              <div className="text-xs font-ibm mb-5 px-3 py-1 inline-block"
                style={{ border: '1px solid hsl(var(--gold) / 0.3)', color: 'hsl(var(--gold))' }}>
                {selected.period}
              </div>

              <p className="font-ibm text-sm leading-relaxed mb-6"
                style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300, borderTop: '1px solid hsl(var(--border))', paddingTop: 16 }}>
                {selected.desc}
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setArticleId(selected.id)}
                  className="w-full py-3 text-xs tracking-[0.15em] uppercase font-ibm transition-all hover:opacity-80 flex items-center justify-center gap-2"
                  style={{ background: 'hsl(var(--gold))', color: 'hsl(var(--ink))' }}
                >
                  <Icon name="FileText" size={12} />
                  Читать статью
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center" style={{ minHeight: 300 }}>
              <Icon name="MapPin" size={32} style={{ color: 'hsl(var(--gold) / 0.3)', marginBottom: 12 }} />
              <p className="font-cormorant text-xl italic" style={{ color: 'hsl(var(--ink-muted))' }}>
                Выберите памятник<br />на карте
              </p>
              <p className="font-ibm text-xs mt-2" style={{ color: 'hsl(var(--ink-muted) / 0.6)', fontWeight: 300 }}>
                {filtered.length} объектов отображено
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
