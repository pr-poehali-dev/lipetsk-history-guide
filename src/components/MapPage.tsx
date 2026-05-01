import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import Icon from "@/components/ui/icon";
import ArticlePage from "@/components/ArticlePage";
import type { ActiveRouteState } from "@/pages/Index";

interface MapPageProps {
  initialRoute?: ActiveRouteState | null;
  onRouteClear?: () => void;
}

interface Monument {
  id: number;
  name: string;
  type: string;
  period: string;
  lat: number;
  lng: number;
  desc: string;
}

const monuments: Monument[] = [
  { id: 1,  name: "Успенский собор",            type: "Архитектура", period: "XII в.",            lat: 52.6089, lng: 39.5993, desc: "Белокаменный собор домонгольского периода, памятник федерального значения." },
  { id: 2,  name: "Городище Старое",             type: "Археология",  period: "VIII–X вв.",        lat: 52.5800, lng: 39.6300, desc: "Остатки раннесредневекового укреплённого поселения с оборонительными валами." },
  { id: 3,  name: "Дворянская усадьба",          type: "Архитектура", period: "XVIII в.",          lat: 52.6240, lng: 39.5640, desc: "Усадебный комплекс эпохи классицизма, главный дом с колонным портиком." },
  { id: 4,  name: "Курганный могильник",         type: "Археология",  period: "VI–VIII вв.",       lat: 52.5580, lng: 39.6550, desc: "Группа курганов раннеславянского времени, частично исследована экспедицией 1987 г." },
  { id: 5,  name: "Заповедный бор",              type: "Природа",     period: "XIX в.",            lat: 52.6350, lng: 39.6100, desc: "Реликтовый сосновый бор, охраняемый с 1890 года, ботанический памятник." },
  { id: 6,  name: "Монастырь Троицкий",          type: "Архитектура", period: "XVI в.",            lat: 52.6050, lng: 39.5750, desc: "Монастырский ансамбль с сохранившимися трапезной, звонницей и кельями." },
  { id: 7,  name: "Наскальные петроглифы",       type: "Археология",  period: "III тыс. до н.э.", lat: 52.5400, lng: 39.7200, desc: "Наскальные изображения эпохи бронзы, открытые в 1962 году." },
  { id: 8,  name: "Парк культуры",               type: "Природа",     period: "XIX в.",            lat: 52.6150, lng: 39.6050, desc: "Исторический пейзажный парк с редкими породами деревьев и беседками." },
  { id: 13, name: "Аргамач-Пальна",              type: "Природа",     period: "–",                lat: 52.5200, lng: 38.9800, desc: "Природно-исторический памятник на высоком берегу Быстрой Сосны с городищем скифского времени." },
  { id: 14, name: "Центр романовской игрушки",   type: "Культура",    period: "XIX в.",            lat: 52.7100, lng: 39.1500, desc: "Центр возрождения уникального народного промысла — романовской глиняной игрушки Липецкого края." },
];

const typeColors: Record<string, string> = {
  "Архитектура": "#8B5E2A",
  "Археология":  "#2E6E8E",
  "Природа":     "#2E6B40",
  "Культура":    "#5E3A8B",
};

const typeIconChar: Record<string, string> = {
  "Архитектура": "🏛",
  "Археология":  "⚔",
  "Природа":     "🌲",
  "Культура":    "🎨",
};

function makeIcon(type: string, isRoute: boolean, routeIndex: number, isVisited: boolean) {
  const color = typeColors[type] ?? "#8B5E2A";
  const size = isRoute ? 36 : 30;
  const label = isRoute
    ? `<span style="font-family:monospace;font-size:11px;font-weight:700;color:white;line-height:1">${routeIndex + 1}</span>`
    : `<span style="font-size:13px;line-height:1">${typeIconChar[type] ?? "📍"}</span>`;
  const opacity = isVisited ? 0.45 : 1;
  const ring = isRoute && !isVisited ? `box-shadow:0 0 0 3px ${color}55,0 2px 8px rgba(0,0,0,0.35);` : "box-shadow:0 2px 6px rgba(0,0,0,0.25);";

  const html = `<div style="
    width:${size}px;height:${size}px;
    border-radius:50% 50% 50% 4px;
    transform:rotate(-45deg);
    background:${color};
    display:flex;align-items:center;justify-content:center;
    border:2px solid rgba(255,255,255,0.8);
    ${ring}
    opacity:${opacity};
  ">
    <div style="transform:rotate(45deg)">${label}</div>
  </div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function FlyToRoute({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
    }
  }, [map, positions]);
  return null;
}

function GeoMarker({ lat, lng }: { lat: number; lng: number }) {
  const geoIcon = L.divIcon({
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#3B82F6;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 2px 6px rgba(0,0,0,0.3)"></div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  return <Marker position={[lat, lng]} icon={geoIcon} />;
}

export default function MapPage({ initialRoute, onRouteClear }: MapPageProps) {
  const [articleId, setArticleId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState("Все");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [geoPos, setGeoPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoTracking, setGeoTracking] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [trackingRoute, setTrackingRoute] = useState(() => !!initialRoute);
  const [visitedIds, setVisitedIds] = useState<number[]>([]);
  const [activeRouteIds, setActiveRouteIds] = useState<number[]>(
    initialRoute?.routeIds ?? []
  );
  const [activeRouteTitle, setActiveRouteTitle] = useState(initialRoute?.routeTitle ?? "");

  useEffect(() => {
    if (initialRoute) {
      setActiveRouteIds(initialRoute.routeIds);
      setActiveRouteTitle(initialRoute.routeTitle);
      setTrackingRoute(true);
      setVisitedIds([]);
    }
  }, [initialRoute]);

  const startGeo = () => {
    if (!navigator.geolocation) { setGeoError("Геолокация не поддерживается"); return; }
    setGeoError(null);
    setGeoTracking(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => setGeoPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const msgs: Record<number, string> = { 1: "Доступ запрещён", 2: "Недоступно", 3: "Таймаут" };
        setGeoError(msgs[err.code] ?? "Ошибка GPS");
        setGeoTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopGeo = () => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
    setGeoTracking(false);
    setGeoPos(null);
  };

  useEffect(() => () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); }, []);

  const stopTracking = () => {
    setTrackingRoute(false);
    setVisitedIds([]);
    setActiveRouteTitle("");
    setActiveRouteIds([]);
    onRouteClear?.();
  };

  if (articleId !== null) {
    return <ArticlePage monumentId={articleId} onBack={() => setArticleId(null)} />;
  }

  const types = ["Все", "Архитектура", "Археология", "Природа", "Культура"];
  const filtered = filterType === "Все" ? monuments : monuments.filter((m) => m.type === filterType);

  const routeMonuments = activeRouteIds
    .map((id) => monuments.find((m) => m.id === id))
    .filter(Boolean) as Monument[];

  const routePositions: [number, number][] = routeMonuments.map((m) => [m.lat, m.lng]);
  const progress = activeRouteIds.length > 0
    ? Math.round((visitedIds.length / activeRouteIds.length) * 100)
    : 0;
  const nextStop = routeMonuments.find((m) => !visitedIds.includes(m.id)) ?? null;

  const center: [number, number] = [52.607, 39.599];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="text-xs tracking-[0.2em] uppercase font-ibm mb-2 flex items-center gap-2" style={{ color: 'hsl(var(--gold))' }}>
          <div style={{ width: 20, height: 1, background: 'hsl(var(--gold))' }} />
          Интерактивная карта
        </div>
        <div className="flex items-end justify-between">
          <h1 className="font-cormorant text-5xl" style={{ color: 'hsl(var(--ink))', fontWeight: 300 }}>
            Памятники на карте
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={geoTracking ? stopGeo : startGeo}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-[0.12em] uppercase font-ibm transition-all"
              style={{
                border: `1px solid ${geoTracking ? '#2E6B40' : 'hsl(var(--border))'}`,
                background: geoTracking ? 'rgba(46,107,64,0.1)' : 'transparent',
                color: geoTracking ? '#2E6B40' : 'hsl(var(--ink-muted))',
              }}
            >
              <Icon name={geoTracking ? "LocateFixed" : "Locate"} size={12} />
              {geoTracking ? "GPS вкл." : "GPS"}
            </button>
            {trackingRoute && (
              <button
                onClick={stopTracking}
                className="flex items-center gap-2 px-4 py-2 text-xs tracking-[0.12em] uppercase font-ibm transition-all"
                style={{ border: '1px solid hsl(var(--gold))', background: 'hsl(var(--gold) / 0.1)', color: 'hsl(var(--gold))' }}
              >
                <Icon name="RouteOff" size={12} />
                Завершить
              </button>
            )}
          </div>
        </div>
        {geoError && (
          <div className="mt-2 flex items-center gap-2 text-xs font-ibm" style={{ color: 'hsl(0 50% 40%)' }}>
            <Icon name="AlertCircle" size={12} />
            {geoError}
          </div>
        )}
      </div>

      {/* Route progress */}
      {trackingRoute && routeMonuments.length > 0 && (
        <div className="mb-5 p-4 fade-in-up" style={{ border: '1px solid hsl(var(--gold) / 0.3)', background: 'hsl(var(--gold) / 0.05)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon name="Navigation" size={13} style={{ color: 'hsl(var(--gold))' }} />
              <span className="text-xs font-ibm tracking-[0.12em] uppercase" style={{ color: 'hsl(var(--gold))' }}>
                {activeRouteTitle || "Маршрут"}
              </span>
            </div>
            <span className="font-cormorant text-lg" style={{ color: 'hsl(var(--ink))' }}>
              {visitedIds.length} / {activeRouteIds.length} точек
            </span>
          </div>
          <div className="h-1 mb-3" style={{ background: 'hsl(var(--border))' }}>
            <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: 'hsl(var(--gold))' }} />
          </div>
          {nextStop && (
            <div className="flex items-center gap-2 text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))' }}>
              <Icon name="ChevronRight" size={11} style={{ color: 'hsl(var(--gold))' }} />
              Следующая точка:
              <span style={{ color: 'hsl(var(--ink))' }}>{nextStop.name}</span>
            </div>
          )}
          {progress === 100 && (
            <div className="flex items-center gap-2 text-xs font-ibm mt-1" style={{ color: '#2E6B40' }}>
              <Icon name="CheckCircle" size={12} />
              Маршрут завершён!
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          {/* Filter */}
          <div className="mb-5">
            <div className="text-xs tracking-[0.15em] uppercase font-ibm mb-3" style={{ color: 'hsl(var(--ink-muted))' }}>
              Тип объекта
            </div>
            <div className="flex flex-col gap-1">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className="text-left px-3 py-2 text-xs font-ibm transition-all"
                  style={{
                    background: filterType === t ? 'hsl(var(--gold) / 0.15)' : 'transparent',
                    border: filterType === t ? '1px solid hsl(var(--gold) / 0.4)' : '1px solid transparent',
                    color: filterType === t ? 'hsl(var(--ink))' : 'hsl(var(--ink-muted))',
                    fontWeight: filterType === t ? 400 : 300,
                  }}
                >
                  {t !== "Все" && <span className="mr-2">{typeIconChar[t]}</span>}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Monument list */}
          <div className="text-xs tracking-[0.15em] uppercase font-ibm mb-3" style={{ color: 'hsl(var(--ink-muted))' }}>
            Объектов: {filtered.length}
          </div>
          <div className="flex flex-col gap-1 max-h-[480px] overflow-y-auto pr-1">
            {filtered.map((m) => {
              const routeIdx = activeRouteIds.indexOf(m.id);
              const inRoute = routeIdx !== -1;
              const visited = visitedIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id === selectedId ? null : m.id)}
                  className="text-left px-3 py-2 text-xs font-ibm transition-all"
                  style={{
                    background: selectedId === m.id ? 'hsl(var(--gold) / 0.12)' : 'transparent',
                    border: `1px solid ${selectedId === m.id ? 'hsl(var(--gold) / 0.35)' : 'hsl(var(--border))'}`,
                    color: visited ? 'hsl(var(--ink-muted))' : 'hsl(var(--ink))',
                    opacity: visited ? 0.6 : 1,
                    marginBottom: 2,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {inRoute && (
                      <span className="w-4 h-4 flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ background: typeColors[m.type] ?? '#888', color: 'white', borderRadius: '50%' }}>
                        {routeIdx + 1}
                      </span>
                    )}
                    <span className="truncate" style={{ fontWeight: 300 }}>{m.name}</span>
                    {visited && <Icon name="CheckCircle" size={10} style={{ color: '#2E6B40', marginLeft: 'auto', flexShrink: 0 }} />}
                  </div>
                  <div style={{ color: typeColors[m.type] ?? '#888', fontSize: 10, marginTop: 2 }}>{m.type} · {m.period}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="col-span-3">
          <div style={{ height: 580, border: '1px solid hsl(var(--border))', borderRadius: 2, overflow: 'hidden' }}>
            <MapContainer
              center={center}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Route line */}
              {trackingRoute && routePositions.length > 1 && (
                <>
                  <Polyline
                    positions={routePositions}
                    pathOptions={{ color: "#8B5E2A", weight: 3, opacity: 0.5, dashArray: "8 6" }}
                  />
                  <FlyToRoute positions={routePositions} />
                </>
              )}

              {/* GPS position */}
              {geoPos && <GeoMarker lat={geoPos.lat} lng={geoPos.lng} />}

              {/* Monument markers */}
              {filtered.map((m) => {
                const routeIdx = activeRouteIds.indexOf(m.id);
                const inRoute = trackingRoute && routeIdx !== -1;
                const visited = visitedIds.includes(m.id);
                const icon = makeIcon(m.type, inRoute, routeIdx, visited);
                return (
                  <Marker
                    key={m.id}
                    position={[m.lat, m.lng]}
                    icon={icon}
                    eventHandlers={{ click: () => setSelectedId(m.id) }}
                  >
                    <Popup
                      closeButton={false}
                      className="heritage-popup"
                    >
                      <div style={{ minWidth: 220, fontFamily: 'IBM Plex Mono, monospace' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: typeColors[m.type] ?? '#888' }}>
                            {m.type} · {m.period}
                          </span>
                          {inRoute && (
                            <span style={{ fontSize: 10, background: typeColors[m.type], color: 'white', borderRadius: 10, padding: '1px 7px' }}>
                              #{routeIdx + 1}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 500, color: '#1e140a', marginBottom: 6, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.3 }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#5a4a3a', lineHeight: 1.7, marginBottom: 10, fontWeight: 300 }}>
                          {m.desc}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => setArticleId(m.id)}
                            style={{ flex: 1, padding: '5px 0', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', background: '#8B5E2A', color: 'white', border: 'none', cursor: 'pointer' }}
                          >
                            Читать
                          </button>
                          {inRoute && !visited && (
                            <button
                              onClick={() => setVisitedIds((p) => [...p, m.id])}
                              style={{ flex: 1, padding: '5px 0', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', background: '#2E6B40', color: 'white', border: 'none', cursor: 'pointer' }}
                            >
                              Посещено
                            </button>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-3">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                <span className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}>{type}</span>
              </div>
            ))}
            {geoPos && (
              <div className="flex items-center gap-1.5 ml-auto">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} />
                <span className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}>Вы здесь</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
