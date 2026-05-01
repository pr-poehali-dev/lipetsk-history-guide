import { useState, useEffect, useRef } from "react";
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
  { id: 1,  name: "Древне-Успенская церковь",     type: "Архитектура", period: "XVII в.",           lat: 52.6126, lng: 39.6103, desc: "Один из старейших храмов Липецка в стиле русского барокко, памятник федерального значения. Основан в XVII веке как Паройская пустынь, где бывал Пётр I." },
  { id: 2,  name: "Собор Рождества Христова",     type: "Архитектура", period: "1842 г.",           lat: 52.6095, lng: 39.6010, desc: "Кафедральный собор на Соборной площади Липецка. Построен по указу Екатерины II, архитектор Томмазо Адолини. Строительство завершено в 1842 году." },
  { id: 3,  name: "Нижний парк",                  type: "Природа",     period: "XVIII в.",          lat: 52.6070, lng: 39.5940, desc: "Исторический парк у минеральных источников, основан при Петре I. Здесь находятся бювет минеральных вод, фонтан «Липа» и Комсомольский пруд." },
  { id: 4,  name: "Верхний парк",                 type: "Природа",     period: "XIX в.",            lat: 52.6135, lng: 39.5980, desc: "Исторический пейзажный парк в центре Липецка с фонтанами, вековыми деревьями и видовыми площадками. Рядом — Древне-Успенская церковь." },
  { id: 5,  name: "Заповедник «Галичья гора»",   type: "Природа",     period: "1925 г.",           lat: 52.6091, lng: 38.9165, desc: "Один из самых маленьких заповедников мира. Уникальные скалы девонского известняка на берегу Дона с реликтовой флорой. Основан в 1925 году, в 45 км от Липецка." },
  { id: 6,  name: "Задонский монастырь",          type: "Архитектура", period: "XVI в.",            lat: 52.3894, lng: 38.9244, desc: "Задонский Рождество-Богородицкий мужской монастырь. Основан в XVI веке. Место паломничества — здесь хранятся мощи святителя Тихона Задонского." },
  { id: 7,  name: "Археопарк «Аргамач»",         type: "Археология",  period: "XIV–XV вв.",        lat: 52.6800, lng: 38.6000, desc: "Археологический парк у горы Аргамач близ Ельца. Средневековое городище эпохи Елецкого княжества. Ландшафтно-биологический памятник природы на берегу реки Пальны." },
  { id: 8,  name: "Липецкий краеведческий музей", type: "Культура",   period: "1909 г.",           lat: 52.6063, lng: 39.5975, desc: "Один из старейших музеев Липецкой области. Основан в 1909 году. Экспозиции по истории края от древнейших времён до XX века, коллекции по природе и быту." },
  { id: 9,  name: "Путевой дворец Петра I",       type: "Архитектура", period: "XVIII в.",          lat: 52.6053, lng: 39.5961, desc: "Памятник истории, связанный с посещением Петром I Липецких железоделательных заводов в начале XVIII века. Расположен в историческом центре города." },
  { id: 10, name: "Центр романовской игрушки",   type: "Культура",    period: "XIX в.",            lat: 52.8570, lng: 40.0210, desc: "Центр возрождения романовской глиняной игрушки в слободе Романово Липецкой области. Уникальный народный промысел, внесённый в список культурного наследия региона." },
];

const TYPE_COLORS: Record<string, string> = {
  "Архитектура": "#8B5E2A",
  "Археология":  "#2E6E8E",
  "Природа":     "#2E6B40",
  "Культура":    "#5E3A8B",
};

const TYPE_EMOJI: Record<string, string> = {
  "Архитектура": "🏛",
  "Археология":  "⚔",
  "Природа":     "🌲",
  "Культура":    "🎨",
};

function makeMarkerIcon(type: string, routeIndex: number, isVisited: boolean) {
  const color = TYPE_COLORS[type] ?? "#8B5E2A";
  const inRoute = routeIndex >= 0;
  const size = inRoute ? 36 : 30;
  const inner = inRoute
    ? `<b style="color:white;font-size:12px;font-family:monospace">${routeIndex + 1}</b>`
    : `<span style="font-size:14px">${TYPE_EMOJI[type] ?? "📍"}</span>`;

  return L.divIcon({
    className: "",
    iconSize:   [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor:[0, -size - 4],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:${color};border:2px solid rgba(255,255,255,0.85);box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;opacity:${isVisited ? 0.4 : 1}"><div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center">${inner}</div></div>`,
  });
}

function makeGpsIcon() {
  return L.divIcon({
    className: "",
    iconSize:   [18, 18],
    iconAnchor: [9, 9],
    html: `<div style="width:18px;height:18px;border-radius:50%;background:#3B82F6;border:3px solid white;box-shadow:0 0 0 5px rgba(59,130,246,0.25),0 2px 6px rgba(0,0,0,0.3)"></div>`,
  });
}

export default function MapPage({ initialRoute, onRouteClear }: MapPageProps) {
  const mapDivRef    = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markersRef   = useRef<Map<number, L.Marker>>(new Map());
  const routeLineRef = useRef<L.Polyline | null>(null);
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const watchRef     = useRef<number | null>(null);

  const [articleId,      setArticleId]      = useState<number | null>(null);
  const [filterType,     setFilterType]     = useState("Все");
  const [visitedIds,     setVisitedIds]     = useState<number[]>([]);
  const [trackingRoute,  setTrackingRoute]  = useState(!!initialRoute);
  const [activeRouteIds, setActiveRouteIds] = useState<number[]>(initialRoute?.routeIds ?? []);
  const [routeTitle,     setRouteTitle]     = useState(initialRoute?.routeTitle ?? "");
  const [geoOn,          setGeoOn]          = useState(false);
  const [geoError,       setGeoError]       = useState<string | null>(null);

  // Keep mutable refs in sync so popup callbacks always have fresh values
  const visitedRef     = useRef(visitedIds);
  const routeIdsRef    = useRef(activeRouteIds);
  const trackingRef    = useRef(trackingRoute);
  visitedRef.current   = visitedIds;
  routeIdsRef.current  = activeRouteIds;
  trackingRef.current  = trackingRoute;

  // ── Init Leaflet map once ─────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [52.6095, 39.5990],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Markers (re-render on filter / visited / route changes) ──────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((mk) => mk.remove());
    markersRef.current.clear();

    const filtered = filterType === "Все"
      ? monuments
      : monuments.filter((m) => m.type === filterType);

    filtered.forEach((m) => {
      const routeIdx = activeRouteIds.indexOf(m.id);
      const visited  = visitedIds.includes(m.id);
      const icon     = makeMarkerIcon(m.type, routeIdx, visited);
      const marker   = L.marker([m.lat, m.lng], { icon }).addTo(map);

      const node = document.createElement("div");
      node.style.cssText = "min-width:220px;font-family:'IBM Plex Mono',monospace";
      const showVisited = trackingRoute && routeIdx >= 0 && !visited;
      node.innerHTML = `
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:${TYPE_COLORS[m.type] ?? '#888'};margin-bottom:4px">
          ${m.type} · ${m.period}
          ${routeIdx >= 0 ? `<span style="margin-left:6px;background:${TYPE_COLORS[m.type]};color:white;border-radius:10px;padding:1px 7px">#${routeIdx + 1}</span>` : ""}
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:16px;color:#1e140a;margin-bottom:6px;line-height:1.3">${m.name}</div>
        <div style="font-size:11px;color:#5a4a3a;line-height:1.7;margin-bottom:10px;font-weight:300">${m.desc}</div>
        <div style="display:flex;gap:6px">
          <button data-read style="flex:1;padding:6px 0;font-size:9px;text-transform:uppercase;letter-spacing:.15em;background:#8B5E2A;color:white;border:none;cursor:pointer">Читать</button>
          ${showVisited ? `<button data-visit style="flex:1;padding:6px 0;font-size:9px;text-transform:uppercase;letter-spacing:.15em;background:#2E6B40;color:white;border:none;cursor:pointer">Посещено ✓</button>` : ""}
        </div>
      `;

      node.querySelector("[data-read]")?.addEventListener("click", () => setArticleId(m.id));
      node.querySelector("[data-visit]")?.addEventListener("click", () => {
        setVisitedIds((p) => p.includes(m.id) ? p : [...p, m.id]);
        marker.closePopup();
      });

      marker.bindPopup(node, { closeButton: false, maxWidth: 280 });
      markersRef.current.set(m.id, marker);
    });
   
  }, [filterType, visitedIds, activeRouteIds, trackingRoute]);

  // ── Route polyline ───────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    routeLineRef.current?.remove();
    routeLineRef.current = null;

    if (!trackingRoute || activeRouteIds.length < 2) return;

    const pts = activeRouteIds
      .map((id) => monuments.find((m) => m.id === id))
      .filter(Boolean)
      .map((m) => [m!.lat, m!.lng] as [number, number]);

    routeLineRef.current = L.polyline(pts, {
      color: "#8B5E2A", weight: 3, opacity: 0.55, dashArray: "10 7",
    }).addTo(map);

    map.fitBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: 13 });
  }, [trackingRoute, activeRouteIds]);

  // ── Sync initialRoute prop ───────────────────────────────────────
  useEffect(() => {
    if (initialRoute) {
      setActiveRouteIds(initialRoute.routeIds);
      setRouteTitle(initialRoute.routeTitle);
      setTrackingRoute(true);
      setVisitedIds([]);
    }
  }, [initialRoute]);

  // ── GPS ──────────────────────────────────────────────────────────
  const startGeo = () => {
    if (!navigator.geolocation) { setGeoError("Геолокация не поддерживается"); return; }
    setGeoError(null); setGeoOn(true);
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const ll: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        const map = mapRef.current;
        if (!map) return;
        if (!gpsMarkerRef.current) {
          gpsMarkerRef.current = L.marker(ll, { icon: makeGpsIcon(), zIndexOffset: 1000 }).addTo(map);
        } else {
          gpsMarkerRef.current.setLatLng(ll);
        }
      },
      (err) => {
        const msgs: Record<number, string> = { 1: "Доступ запрещён", 2: "Недоступно", 3: "Таймаут" };
        setGeoError(msgs[err.code] ?? "Ошибка GPS"); setGeoOn(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopGeo = () => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    gpsMarkerRef.current?.remove(); gpsMarkerRef.current = null;
    setGeoOn(false); setGeoError(null);
  };

  useEffect(() => () => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
  }, []);

  const stopTracking = () => {
    setTrackingRoute(false);
    setActiveRouteIds([]);
    setRouteTitle("");
    setVisitedIds([]);
    onRouteClear?.();
  };

  if (articleId !== null) {
    return <ArticlePage monumentId={articleId} onBack={() => setArticleId(null)} />;
  }

  const types    = ["Все", "Архитектура", "Археология", "Природа", "Культура"];
  const filtered = filterType === "Все" ? monuments : monuments.filter((m) => m.type === filterType);
  const routeMonuments = activeRouteIds.map((id) => monuments.find((m) => m.id === id)).filter(Boolean) as Monument[];
  const progress = activeRouteIds.length > 0 ? Math.round((visitedIds.length / activeRouteIds.length) * 100) : 0;
  const nextStop = routeMonuments.find((m) => !visitedIds.includes(m.id)) ?? null;

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
              onClick={geoOn ? stopGeo : startGeo}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-[0.12em] uppercase font-ibm transition-all"
              style={{
                border: `1px solid ${geoOn ? '#2E6B40' : 'hsl(var(--border))'}`,
                background: geoOn ? 'rgba(46,107,64,0.1)' : 'transparent',
                color: geoOn ? '#2E6B40' : 'hsl(var(--ink-muted))',
              }}
            >
              <Icon name={geoOn ? "LocateFixed" : "Locate"} size={12} />
              {geoOn ? "GPS вкл." : "GPS"}
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
                {routeTitle || "Маршрут"}
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
              Следующая точка: <span style={{ color: 'hsl(var(--ink))' }}>{nextStop.name}</span>
            </div>
          )}
          {progress === 100 && (
            <div className="mt-1 flex items-center gap-2 text-xs font-ibm" style={{ color: '#2E6B40' }}>
              <Icon name="CheckCircle" size={12} /> Маршрут завершён!
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="mb-5">
            <div className="text-xs tracking-[0.15em] uppercase font-ibm mb-3" style={{ color: 'hsl(var(--ink-muted))' }}>Тип объекта</div>
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
                  {t !== "Все" && <span className="mr-2">{TYPE_EMOJI[t]}</span>}
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs tracking-[0.12em] uppercase font-ibm mb-2" style={{ color: 'hsl(var(--ink-muted))' }}>
            Объектов: {filtered.length}
          </div>
          <div className="flex flex-col gap-1 max-h-[440px] overflow-y-auto pr-1">
            {filtered.map((m) => {
              const routeIdx = activeRouteIds.indexOf(m.id);
              const visited  = visitedIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    const mk = markersRef.current.get(m.id);
                    if (mk && mapRef.current) {
                      mapRef.current.setView([m.lat, m.lng], 14, { animate: true });
                      mk.openPopup();
                    }
                  }}
                  className="text-left px-3 py-2 text-xs font-ibm transition-all hover:opacity-80"
                  style={{
                    border: '1px solid hsl(var(--border))',
                    color: visited ? 'hsl(var(--ink-muted))' : 'hsl(var(--ink))',
                    opacity: visited ? 0.6 : 1,
                    marginBottom: 2,
                    background: 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2">
                    {routeIdx >= 0 && (
                      <span className="w-4 h-4 flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ background: TYPE_COLORS[m.type] ?? '#888', color: 'white', borderRadius: '50%' }}>
                        {routeIdx + 1}
                      </span>
                    )}
                    <span className="truncate" style={{ fontWeight: 300 }}>{m.name}</span>
                    {visited && <Icon name="CheckCircle" size={10} style={{ color: '#2E6B40', marginLeft: 'auto', flexShrink: 0 }} />}
                  </div>
                  <div style={{ color: TYPE_COLORS[m.type] ?? '#888', fontSize: 10, marginTop: 2 }}>{m.type} · {m.period}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="col-span-3 flex flex-col gap-3">
          <div ref={mapDivRef} style={{ height: 580, border: '1px solid hsl(var(--border))', borderRadius: 2 }} />
          <div className="flex items-center gap-5 flex-wrap">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                <span className="text-xs font-ibm" style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}>
                  {TYPE_EMOJI[type]} {type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}