import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Monument {
  id: number;
  name: string;
  type: string;
  period: string;
  century: string;
  status: "Федеральный" | "Региональный" | "Местный";
  desc: string;
  location: string;
  discovered?: string;
}

const monuments: Monument[] = [
  { id: 1, name: "Успенский собор", type: "Архитектура", period: "XII в.", century: "XII", status: "Федеральный", desc: "Белокаменный собор домонгольского периода, один из немногих сохранившихся памятников архитектуры XII века.", location: "Исторический центр", },
  { id: 2, name: "Городище Старое", type: "Археология", period: "VIII–X вв.", century: "VIII–X", status: "Федеральный", desc: "Остатки укреплённого раннесредневекового поселения. Оборонительные валы, следы деревянных строений.", location: "Северный район", discovered: "1953" },
  { id: 3, name: "Дворянская усадьба Орловых", type: "Архитектура", period: "XVIII в.", century: "XVIII", status: "Региональный", desc: "Усадебный комплекс эпохи классицизма. Главный дом с шестиколонным портиком, регулярный парк, флигели.", location: "Западный район" },
  { id: 4, name: "Курганный могильник «Лысая гора»", type: "Археология", period: "VI–VIII вв.", century: "VI–VIII", status: "Региональный", desc: "Группа из 14 курганов раннеславянского времени. Частично исследована экспедицией 1987 года.", location: "Восточный район", discovered: "1987" },
  { id: 5, name: "Заповедный бор Тихий", type: "Природа", period: "XIX в.", century: "XIX", status: "Региональный", desc: "Реликтовый сосновый бор площадью 84 га. Охраняется с 1890 года. Встречаются деревья возрастом 250 лет.", location: "Южный район" },
  { id: 6, name: "Монастырь Троицкий", type: "Архитектура", period: "XVI в.", century: "XVI", status: "Федеральный", desc: "Монастырский ансамбль с сохранившимися трапезной палатой, надвратной церковью, звонницей и кельями.", location: "Северо-западный район" },
  { id: 7, name: "Наскальные петроглифы урочища Красный берег", type: "Археология", period: "III тыс. до н.э.", century: "III тыс.", status: "Федеральный", desc: "120 наскальных изображений эпохи бронзы: антропоморфные фигуры, солярные знаки, сцены охоты.", location: "Восточная окраина", discovered: "1962" },
  { id: 8, name: "Парк Дворянского собрания", type: "Природа", period: "XIX в.", century: "XIX", status: "Местный", desc: "Исторический пейзажный парк с редкими породами деревьев. Декоративные беседки, мостики, пруд.", location: "Центр города" },
  { id: 9, name: "Торговые ряды", type: "Архитектура", period: "XIX в.", century: "XIX", status: "Региональный", desc: "Ансамбль торговых рядов в стиле провинциального классицизма. Арочные галереи, белая известняковая кладка.", location: "Торговая площадь" },
  { id: 10, name: "Стоянка каменного века Медвежья пещера", type: "Археология", period: "XII тыс. до н.э.", century: "XII тыс.", status: "Федеральный", desc: "Стоянка палеолитического человека. Орудия труда, кости мамонта и пещерного медведя.", location: "Горный массив", discovered: "1934" },
  { id: 11, name: "Усадьба Голицыных", type: "Архитектура", period: "XVIII в.", century: "XVIII", status: "Региональный", desc: "Небольшой усадебный комплекс с сохранившимся деревянным главным домом и остатками регулярного парка.", location: "Пригород" },
  { id: 12, name: "Луговые степи Привольные", type: "Природа", period: "–", century: "–", status: "Региональный", desc: "Сохранившийся участок первозданной луговой степи. Уникальная флора: около 200 видов, 12 краснокнижных.", location: "Степной район" },
];

const types = ["Все", "Архитектура", "Археология", "Природа"];
const statuses = ["Все", "Федеральный", "Региональный", "Местный"];

const statusColor: Record<string, string> = {
  "Федеральный": "hsl(35 60% 40%)",
  "Региональный": "hsl(200 50% 35%)",
  "Местный": "hsl(280 30% 40%)",
};

export default function CatalogPage() {
  const [filterType, setFilterType] = useState("Все");
  const [filterStatus, setFilterStatus] = useState("Все");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Monument | null>(null);

  const filtered = monuments.filter((m) => {
    const matchType = filterType === "Все" || m.type === filterType;
    const matchStatus = filterStatus === "Все" || m.status === filterStatus;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div
          className="text-xs tracking-[0.2em] uppercase font-ibm mb-3 flex items-center gap-2"
          style={{ color: 'hsl(var(--gold))' }}
        >
          <div style={{ width: 20, height: 1, background: 'hsl(var(--gold))' }} />
          Полный реестр
        </div>
        <div className="flex items-end justify-between">
          <h1
            className="font-cormorant text-5xl"
            style={{ color: 'hsl(var(--ink))', fontWeight: 300 }}
          >
            Каталог памятников
          </h1>
          <span
            className="font-ibm text-sm"
            style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}
          >
            {filtered.length} из {monuments.length} объектов
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div
        className="p-5 mb-6"
        style={{ border: '1px solid hsl(var(--border))', background: 'hsl(var(--parchment-dark))' }}
      >
        {/* Search */}
        <div className="relative mb-4">
          <Icon
            name="Search"
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'hsl(var(--ink-muted))' }}
          />
          <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 font-ibm text-sm outline-none"
            style={{
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--parchment))',
              color: 'hsl(var(--ink))',
              fontWeight: 300,
            }}
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span
              className="text-xs tracking-[0.1em] uppercase font-ibm"
              style={{ color: 'hsl(var(--ink-muted))', fontSize: 10 }}
            >
              Тип:
            </span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="filter-chip px-3 py-1.5"
                style={{
                  background: filterType === t ? 'hsl(var(--primary))' : 'transparent',
                  color: filterType === t ? 'hsl(var(--primary-foreground))' : 'hsl(var(--ink-muted))',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div
            className="w-px mx-1"
            style={{ background: 'hsl(var(--border))' }}
          />

          <div className="flex items-center gap-2">
            <span
              className="text-xs tracking-[0.1em] uppercase font-ibm"
              style={{ color: 'hsl(var(--ink-muted))', fontSize: 10 }}
            >
              Охрана:
            </span>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="filter-chip px-3 py-1.5"
                style={{
                  background: filterStatus === s ? 'hsl(var(--primary))' : 'transparent',
                  color: filterStatus === s ? 'hsl(var(--primary-foreground))' : 'hsl(var(--ink-muted))',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Monument grid */}
        <div className="col-span-2 grid grid-cols-2 gap-4 content-start">
          {filtered.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className={`monument-card text-left p-5 fade-in-up fade-in-up-delay-${(idx % 4) + 1}`}
              style={{
                border: `1px solid ${selected?.id === m.id ? 'hsl(var(--gold))' : 'hsl(var(--border))'}`,
                background: selected?.id === m.id ? 'hsl(var(--parchment-dark))' : 'transparent',
              }}
            >
              {/* Type & Status */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-ibm tracking-[0.1em] uppercase"
                  style={{ color: statusColor[m.status] || 'hsl(var(--ink-muted))', fontSize: 10 }}
                >
                  {m.type}
                </span>
                <span
                  className="text-xs font-ibm px-2 py-0.5"
                  style={{
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--ink-muted))',
                    fontSize: 10,
                  }}
                >
                  {m.period}
                </span>
              </div>

              <h3
                className="font-cormorant text-lg leading-snug mb-2"
                style={{ color: 'hsl(var(--ink))', fontWeight: 400 }}
              >
                {m.name}
              </h3>

              <p
                className="font-ibm text-xs leading-relaxed line-clamp-2"
                style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}
              >
                {m.desc}
              </p>

              <div
                className="flex items-center gap-1 mt-3 pt-3 text-xs font-ibm"
                style={{ borderTop: '1px solid hsl(var(--border))', color: 'hsl(var(--ink-muted))' }}
              >
                <Icon name="MapPin" size={10} />
                {m.location}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 py-16 text-center">
              <Icon name="SearchX" size={32} style={{ color: 'hsl(var(--gold) / 0.3)', margin: '0 auto 12px' }} />
              <p className="font-cormorant text-xl italic" style={{ color: 'hsl(var(--ink-muted))' }}>
                Ничего не найдено
              </p>
            </div>
          )}
        </div>

        {/* Detail */}
        <div style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
          {selected ? (
            <div
              className="p-6 fade-in-up"
              style={{ border: '1px solid hsl(var(--border))', background: 'hsl(var(--parchment-dark))' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs tracking-[0.12em] uppercase font-ibm px-3 py-1"
                  style={{ border: `1px solid ${statusColor[selected.status]}`, color: statusColor[selected.status] }}
                >
                  {selected.status}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  style={{ color: 'hsl(var(--ink-muted))' }}
                >
                  <Icon name="X" size={14} />
                </button>
              </div>

              <div
                className="text-xs font-ibm tracking-[0.12em] uppercase mb-2"
                style={{ color: 'hsl(var(--gold))' }}
              >
                {selected.type}
              </div>

              <h2
                className="font-cormorant text-2xl leading-tight mb-4"
                style={{ color: 'hsl(var(--ink))', fontWeight: 400 }}
              >
                {selected.name}
              </h2>

              <div
                className="grid grid-cols-2 gap-3 pb-4 mb-4"
                style={{ borderBottom: '1px solid hsl(var(--border))' }}
              >
                <div>
                  <div className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted) / 0.7)', fontWeight: 300, marginBottom: 2 }}>Период</div>
                  <div className="font-cormorant text-base" style={{ color: 'hsl(var(--ink))' }}>{selected.period}</div>
                </div>
                {selected.discovered && (
                  <div>
                    <div className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted) / 0.7)', fontWeight: 300, marginBottom: 2 }}>Открыт</div>
                    <div className="font-cormorant text-base" style={{ color: 'hsl(var(--ink))' }}>{selected.discovered} г.</div>
                  </div>
                )}
                <div>
                  <div className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted) / 0.7)', fontWeight: 300, marginBottom: 2 }}>Расположение</div>
                  <div className="font-cormorant text-base" style={{ color: 'hsl(var(--ink))' }}>{selected.location}</div>
                </div>
              </div>

              <p
                className="font-ibm text-sm leading-relaxed mb-5"
                style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}
              >
                {selected.desc}
              </p>

              <button
                className="w-full py-3 text-xs tracking-[0.15em] uppercase font-ibm transition-all hover:opacity-80 flex items-center justify-center gap-2"
                style={{ background: 'hsl(var(--gold))', color: 'hsl(var(--ink))' }}
              >
                <Icon name="Map" size={12} />
                Показать на карте
              </button>
            </div>
          ) : (
            <div
              className="p-6 flex flex-col items-center justify-center text-center"
              style={{
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--parchment-dark))',
                minHeight: 280,
              }}
            >
              <Icon name="BookOpen" size={28} style={{ color: 'hsl(var(--gold) / 0.3)', marginBottom: 12 }} />
              <p className="font-cormorant text-lg italic" style={{ color: 'hsl(var(--ink-muted))' }}>
                Выберите памятник<br />из каталога
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
