import { useState, useEffect, useRef, useCallback } from "react";
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

interface GeoPos {
  x: number; // % on map
  y: number;
  accuracy: number;
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

// Default route for tracking demo (ordered monument ids)
const defaultRouteIds = [1, 6, 3, 5, 8, 2];

export default function MapPage() {
  const [selected, setSelected] = useState<Monument | null>(null);
  const [filterType, setFilterType] = useState<string>("Все");
  const [articleId, setArticleId] = useState<number | null>(null);

  // Geolocation
  const [geoPos, setGeoPos] = useState<GeoPos | null>(null);
  const [geoTracking, setGeoTracking] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Route progress tracking
  const [trackingRoute, setTrackingRoute] = useState(false);
  const [visitedIds, setVisitedIds] = useState<number[]>([]);
  const [activeRouteIds] = useState<number[]>(defaultRouteIds);

  // Convert real coords → map % (bounding box around Липецкая область)
  const coordsToMapPct = useCallback((lat: number, lon: number): { x: number; y: number } => {
    const LAT_MIN = 52.0, LAT_MAX = 53.8;
    const LON_MIN = 38.0, LON_MAX = 41.5;
    const x = Math.min(95, Math.max(5, ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100));
    const y = Math.min(95, Math.max(5, ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100));
    return { x, y };
  }, []);

  const startGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Геолокация не поддерживается браузером");
      return;
    }
    setGeoError(null);
    setGeoTracking(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { x, y } = coordsToMapPct(pos.coords.latitude, pos.coords.longitude);
        setGeoPos({ x, y, accuracy: pos.coords.accuracy });
        setGeoError(null);
      },
      (err) => {
        const msgs: Record<number, string> = {
          1: "Доступ к геолокации запрещён",
          2: "Местоположение недоступно",
          3: "Превышено время ожидания",
        };
        setGeoError(msgs[err.code] ?? "Ошибка геолокации");
        setGeoTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }, [coordsToMapPct]);

  const stopGeo = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGeoTracking(false);
    setGeoPos(null);
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const toggleVisited = (id: number) => {
    setVisitedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const startTracking = () => {
    setTrackingRoute(true);
    setVisitedIds([]);
  };

  const stopTracking = () => {
    setTrackingRoute(false);
    setVisitedIds([]);
  };

  if (articleId !== null) {
    return <ArticlePage monumentId={articleId} onBack={() => setArticleId(null)} />;
  }

  const types = ["Все", "Архитектура", "Археология", "Природа", "Культура"];
  const filtered = filterType === "Все" ? monuments : monuments.filter((m) => m.type === filterType);

  const routeMonuments = activeRouteIds.map((id) => monuments.find((m) => m.id === id)).filter(Boolean) as Monument[];
  const progress = trackingRoute ? Math.round((visitedIds.length / activeRouteIds.length) * 100) : 0;
  const nextStop = trackingRoute
    ? routeMonuments.find((m) => !visitedIds.includes(m.id)) ?? null
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-6">
        <div className="text-xs tracking-[0.2em] uppercase font-ibm mb-3 flex items-center gap-2" style={{ color: 'hsl(var(--gold))' }}>
          <div style={{ width: 20, height: 1, background: 'hsl(var(--gold))' }} />
          Интерактивная карта
        </div>
        <div className="flex items-end justify-between">
          <h1 className="font-cormorant text-5xl" style={{ color: 'hsl(var(--ink))', fontWeight: 300 }}>
            Памятники на карте
          </h1>

          {/* Tracking controls */}
          <div className="flex items-center gap-2">
            {/* Geolocation button */}
            <button
              onClick={geoTracking ? stopGeo : startGeo}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-[0.12em] uppercase font-ibm transition-all"
              style={{
                border: `1px solid ${geoTracking ? 'hsl(140 40% 32%)' : 'hsl(var(--border))'}`,
                background: geoTracking ? 'hsl(140 40% 32% / 0.12)' : 'transparent',
                color: geoTracking ? 'hsl(140 40% 32%)' : 'hsl(var(--ink-muted))',
              }}
            >
              <Icon name={geoTracking ? "LocateFixed" : "Locate"} size={12} />
              {geoTracking ? "GPS вкл." : "GPS"}
            </button>

            {/* Route tracking button */}
            <button
              onClick={trackingRoute ? stopTracking : startTracking}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-[0.12em] uppercase font-ibm transition-all"
              style={{
                border: `1px solid ${trackingRoute ? 'hsl(var(--gold))' : 'hsl(var(--border))'}`,
                background: trackingRoute ? 'hsl(var(--gold) / 0.1)' : 'transparent',
                color: trackingRoute ? 'hsl(var(--gold))' : 'hsl(var(--ink-muted))',
              }}
            >
              <Icon name={trackingRoute ? "RouteOff" : "Route"} size={12} />
              {trackingRoute ? "Стоп" : "Маршрут"}
            </button>
          </div>
        </div>

        {/* Geo error */}
        {geoError && (
          <div className="mt-2 flex items-center gap-2 text-xs font-ibm" style={{ color: 'hsl(0 50% 40%)' }}>
            <Icon name="AlertCircle" size={12} />
            {geoError}
          </div>
        )}
      </div>

      {/* Route progress bar */}
      {trackingRoute && (
        <div className="mb-5 p-4 fade-in-up" style={{ border: '1px solid hsl(var(--gold) / 0.3)', background: 'hsl(var(--gold) / 0.05)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon name="Navigation" size={13} style={{ color: 'hsl(var(--gold))' }} />
              <span className="text-xs font-ibm tracking-[0.12em] uppercase" style={{ color: 'hsl(var(--gold))' }}>
                Прогресс маршрута
              </span>
            </div>
            <span className="font-cormorant text-lg" style={{ color: 'hsl(var(--ink))' }}>
              {visitedIds.length} / {activeRouteIds.length} точек
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 mb-3" style={{ background: 'hsl(var(--border))' }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'hsl(var(--gold))' }}
            />
          </div>

          {nextStop && (
            <div className="flex items-center gap-2 text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))' }}>
              <Icon name="ChevronRight" size={11} style={{ color: 'hsl(var(--gold))' }} />
              Следующая точка:
              <span style={{ color: 'hsl(var(--ink))' }}>{nextStop.name}</span>
            </div>
          )}
          {visitedIds.length === activeRouteIds.length && (
            <div className="flex items-center gap-2 text-xs font-ibm" style={{ color: 'hsl(140 40% 32%)' }}>
              <Icon name="CheckCircle" size={12} />
              Маршрут завершён! Все точки посещены.
            </div>
          )}
        </div>
      )}

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

          {/* Route lines between stops */}
          {trackingRoute && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {routeMonuments.map((m, i) => {
                if (i === 0) return null;
                const prev = routeMonuments[i - 1];
                const visited = visitedIds.includes(prev.id) && visitedIds.includes(m.id);
                return (
                  <line
                    key={`line-${m.id}`}
                    x1={`${prev.x}%`} y1={`${prev.y}%`}
                    x2={`${m.x}%`} y2={`${m.y}%`}
                    stroke={visited ? 'hsl(var(--gold))' : 'hsl(var(--gold) / 0.25)'}
                    strokeWidth={visited ? 2 : 1.5}
                    strokeDasharray={visited ? "none" : "5,4"}
                  />
                );
              })}
            </svg>
          )}

          {/* Compass */}
          <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center font-cormorant text-sm font-bold"
            style={{ border: '1px solid hsl(var(--gold) / 0.4)', color: 'hsl(var(--gold))' }}>
            С
          </div>

          {/* User geolocation dot */}
          {geoPos && (
            <div
              className="absolute pointer-events-none"
              style={{ left: `${geoPos.x}%`, top: `${geoPos.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Accuracy ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 40, height: 40,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'hsl(140 60% 45% / 0.15)',
                  border: '1px solid hsl(140 60% 45% / 0.4)',
                }}
              />
              {/* Pulse ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 20, height: 20,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'hsl(140 60% 45% / 0.2)',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                }}
              />
              {/* Center dot */}
              <div
                className="relative z-10"
                style={{
                  width: 12, height: 12,
                  borderRadius: '50%',
                  background: 'hsl(140 60% 45%)',
                  border: '2px solid white',
                  boxShadow: '0 0 0 2px hsl(140 60% 45% / 0.5)',
                }}
              />
            </div>
          )}

          {/* Markers */}
          {filtered.map((monument) => {
            const isRouteStop = trackingRoute && activeRouteIds.includes(monument.id);
            const isVisited = visitedIds.includes(monument.id);
            const isNext = nextStop?.id === monument.id;
            const routeIdx = trackingRoute ? activeRouteIds.indexOf(monument.id) : -1;

            return (
              <button
                key={monument.id}
                onClick={() => {
                  setSelected(monument);
                  if (trackingRoute && isRouteStop && !isVisited) {
                    toggleVisited(monument.id);
                  }
                }}
                className="absolute group"
                style={{ left: `${monument.x}%`, top: `${monument.y}%`, transform: 'translate(-50%, -50%)', zIndex: isNext ? 20 : 10 }}
              >
                {/* Next stop pulse */}
                {isNext && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 28, height: 28,
                      top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'hsl(var(--gold) / 0.25)',
                      animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                    }}
                  />
                )}
                <div
                  className="map-marker relative flex items-center justify-center"
                  style={{
                    background: isVisited
                      ? 'hsl(140 40% 32%)'
                      : selected?.id === monument.id
                        ? 'hsl(var(--gold))'
                        : typeColors[monument.type],
                    width: isNext ? 18 : (selected?.id === monument.id ? 16 : 12),
                    height: isNext ? 18 : (selected?.id === monument.id ? 16 : 12),
                    opacity: isVisited ? 0.7 : 1,
                  }}
                >
                  {/* Route stop number */}
                  {isRouteStop && routeIdx >= 0 && (
                    <span style={{ fontSize: 7, color: 'white', fontWeight: 700, lineHeight: 1 }}>
                      {routeIdx + 1}
                    </span>
                  )}
                  {isVisited && (
                    <Icon name="Check" size={7} style={{ color: 'white', position: 'absolute' }} />
                  )}
                </div>

                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 whitespace-nowrap text-xs font-ibm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: 'hsl(var(--ink))', color: 'hsl(var(--gold))', border: '1px solid hsl(var(--gold) / 0.3)', zIndex: 50 }}
                >
                  {isVisited ? "✓ " : ""}{monument.name}
                </div>
              </button>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 p-3"
            style={{ background: 'hsl(var(--parchment) / 0.95)', border: '1px solid hsl(var(--border))' }}>
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2 mb-1 last:mb-0">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))' }}>{type}</span>
              </div>
            ))}
            {geoTracking && (
              <div className="flex items-center gap-2 mt-1 pt-1" style={{ borderTop: '1px solid hsl(var(--border))' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(140 60% 45%)' }} />
                <span className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))' }}>Вы здесь</span>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Route checklist */}
          {trackingRoute && (
            <div className="p-4 fade-in-up" style={{ border: '1px solid hsl(var(--gold) / 0.4)', background: 'hsl(var(--parchment-dark))' }}>
              <div className="text-xs tracking-[0.15em] uppercase font-ibm mb-3" style={{ color: 'hsl(var(--gold))' }}>
                Точки маршрута
              </div>
              <div className="space-y-2">
                {routeMonuments.map((m, idx) => {
                  const visited = visitedIds.includes(m.id);
                  const isNext = nextStop?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleVisited(m.id)}
                      className="w-full flex items-center gap-3 text-left transition-opacity"
                      style={{ opacity: visited ? 0.6 : 1 }}
                    >
                      <div
                        className="w-5 h-5 shrink-0 flex items-center justify-center text-xs font-ibm font-bold transition-all"
                        style={{
                          background: visited ? 'hsl(140 40% 32%)' : isNext ? 'hsl(var(--gold))' : 'transparent',
                          border: `1px solid ${visited ? 'hsl(140 40% 32%)' : isNext ? 'hsl(var(--gold))' : 'hsl(var(--border))'}`,
                          color: visited || isNext ? 'white' : 'hsl(var(--ink-muted))',
                        }}
                      >
                        {visited ? <Icon name="Check" size={10} /> : idx + 1}
                      </div>
                      <span
                        className="font-ibm text-xs"
                        style={{
                          color: visited ? 'hsl(var(--ink-muted))' : 'hsl(var(--ink))',
                          textDecoration: visited ? 'line-through' : 'none',
                          fontWeight: isNext ? 500 : 300,
                        }}
                      >
                        {m.name}
                      </span>
                      {isNext && <Icon name="Navigation" size={10} style={{ color: 'hsl(var(--gold))', marginLeft: 'auto', flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Geolocation status */}
          {geoTracking && geoPos && (
            <div className="p-4 fade-in-up" style={{ border: '1px solid hsl(140 40% 32% / 0.4)', background: 'hsl(140 40% 32% / 0.06)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: 'hsl(140 60% 45%)', animation: 'ping 1.5s infinite' }} />
                <span className="text-xs tracking-[0.12em] uppercase font-ibm" style={{ color: 'hsl(140 40% 32%)' }}>
                  GPS активен
                </span>
              </div>
              <div className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}>
                Точность: ±{Math.round(geoPos.accuracy)} м
              </div>
            </div>
          )}

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

                <div className="text-xs font-ibm mb-4 px-3 py-1 inline-block"
                  style={{ border: '1px solid hsl(var(--gold) / 0.3)', color: 'hsl(var(--gold))' }}>
                  {selected.period}
                </div>

                {trackingRoute && activeRouteIds.includes(selected.id) && (
                  <div className="mb-4">
                    {visitedIds.includes(selected.id) ? (
                      <div className="flex items-center gap-2 text-xs font-ibm px-3 py-2"
                        style={{ background: 'hsl(140 40% 32% / 0.1)', border: '1px solid hsl(140 40% 32% / 0.3)', color: 'hsl(140 40% 32%)' }}>
                        <Icon name="CheckCircle" size={12} />
                        Точка посещена
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleVisited(selected.id)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-ibm tracking-[0.12em] uppercase"
                        style={{ background: 'hsl(var(--gold) / 0.1)', border: '1px solid hsl(var(--gold) / 0.4)', color: 'hsl(var(--gold))' }}
                      >
                        <Icon name="MapPinCheck" size={12} />
                        Отметить посещённой
                      </button>
                    )}
                  </div>
                )}

                <p className="font-ibm text-sm leading-relaxed mb-5"
                  style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300, borderTop: '1px solid hsl(var(--border))', paddingTop: 14 }}>
                  {selected.desc}
                </p>

                <button
                  onClick={() => setArticleId(selected.id)}
                  className="w-full py-3 text-xs tracking-[0.15em] uppercase font-ibm transition-all hover:opacity-80 flex items-center justify-center gap-2"
                  style={{ background: 'hsl(var(--gold))', color: 'hsl(var(--ink))' }}
                >
                  <Icon name="FileText" size={12} />
                  Читать статью
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: 200 }}>
                <Icon name="MapPin" size={28} style={{ color: 'hsl(var(--gold) / 0.3)', marginBottom: 10 }} />
                <p className="font-cormorant text-lg italic" style={{ color: 'hsl(var(--ink-muted))' }}>
                  Выберите памятник<br />на карте
                </p>
                <p className="font-ibm text-xs mt-2" style={{ color: 'hsl(var(--ink-muted) / 0.6)', fontWeight: 300 }}>
                  {filtered.length} объектов
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
