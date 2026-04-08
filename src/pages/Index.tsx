import { useState } from "react";
import HomePage from "@/components/HomePage";
import MapPage from "@/components/MapPage";
import RoutesPage from "@/components/RoutesPage";
import CatalogPage from "@/components/CatalogPage";
import Navigation from "@/components/Navigation";

type Page = "home" | "map" | "routes" | "catalog";

export default function Index() {
  const [activePage, setActivePage] = useState<Page>("home");

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--parchment))' }}>
      <Navigation activePage={activePage} onNavigate={setActivePage} />
      <main>
        {activePage === "home" && <HomePage onNavigate={setActivePage} />}
        {activePage === "map" && <MapPage />}
        {activePage === "routes" && <RoutesPage />}
        {activePage === "catalog" && <CatalogPage />}
      </main>
    </div>
  );
}
