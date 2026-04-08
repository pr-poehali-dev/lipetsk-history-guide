import { useState } from "react";
import HomePage from "@/components/HomePage";
import MapPage from "@/components/MapPage";
import RoutesPage from "@/components/RoutesPage";
import CatalogPage from "@/components/CatalogPage";
import Navigation from "@/components/Navigation";
import ReviewsSection from "@/components/ReviewsSection";

export type Page = "home" | "map" | "routes" | "catalog";

export interface ActiveRouteState {
  routeIds: number[];
  routeTitle: string;
}

export default function Index() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [activeRoute, setActiveRoute] = useState<ActiveRouteState | null>(null);

  const handleStartRoute = (routeIds: number[], routeTitle: string) => {
    setActiveRoute({ routeIds, routeTitle });
    setActivePage("map");
  };

  const handleNavigate = (page: Page) => {
    if (page !== "map") setActiveRoute(null);
    setActivePage(page);
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--parchment))' }}>
      <Navigation activePage={activePage} onNavigate={handleNavigate} />
      <main>
        {activePage === "home" && <HomePage onNavigate={handleNavigate} />}
        {activePage === "map" && (
          <MapPage
            initialRoute={activeRoute}
            onRouteClear={() => setActiveRoute(null)}
          />
        )}
        {activePage === "routes" && (
          <RoutesPage onStartRoute={handleStartRoute} />
        )}
        {activePage === "catalog" && <CatalogPage />}
      </main>
      {activePage === "home" && <ReviewsSection />}
    </div>
  );
}
