import type { CSSProperties } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "map" | "routes" | "catalog";

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { value: "127", label: "Памятников" },
  { value: "8", label: "Маршрутов" },
  { value: "4", label: "Эпохи" },
  { value: "XII–XX", label: "Века" },
];

const sections = [
  {
    id: "map" as Page,
    icon: "Map",
    title: "Интерактивная карта",
    desc: "Исследуйте памятники на подробной карте региона. Каждый объект снабжён историческими данными и фотографиями.",
    badge: "127 объектов",
  },
  {
    id: "routes" as Page,
    icon: "Route",
    title: "Туристические маршруты",
    desc: "Готовые маршруты для самостоятельных и групповых экскурсий. От коротких прогулок до многодневных путешествий.",
    badge: "8 маршрутов",
  },
  {
    id: "catalog" as Page,
    icon: "BookOpen",
    title: "Каталог памятников",
    desc: "Полный архив исторических объектов с подробными описаниями, датировкой и категоризацией по типу.",
    badge: "С фильтрами",
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.poehali.dev/projects/35e99b30-aa66-45af-aba6-b153e8cdeca7/files/641250ac-a0d6-4367-9fe3-0cf0e48e7445.jpg"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, hsl(var(--ink) / 0.88) 50%, hsl(var(--ink) / 0.55) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-xl">
            {/* Label */}
            <div
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase mb-8 fade-in-up fade-in-up-delay-1"
              style={{ color: 'hsl(var(--gold))' }}
            >
              <div style={{ width: 24, height: 1, background: 'hsl(var(--gold))' }} />
              Культурное наследие региона
            </div>

            <h1
              className="font-cormorant text-6xl leading-tight mb-6 fade-in-up fade-in-up-delay-2"
              style={{ color: 'hsl(36 30% 94%)', fontWeight: 300 }}
            >
              История, <br />
              <em>воплощённая</em> <br />
              в камне
            </h1>

            <p
              className="font-ibm text-sm leading-relaxed mb-10 fade-in-up fade-in-up-delay-3"
              style={{ color: 'hsl(36 20% 70%)', fontWeight: 300, maxWidth: 380 }}
            >
              Исчерпывающий путеводитель по историческим памятникам.
              Интерактивные маршруты, архивные описания, профессиональная навигация.
            </p>

            <div className="flex gap-4 fade-in-up fade-in-up-delay-4">
              <button
                onClick={() => onNavigate("map")}
                className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.15em] uppercase font-ibm transition-all hover:opacity-80"
                style={{
                  background: 'hsl(var(--gold))',
                  color: 'hsl(var(--ink))',
                }}
              >
                <Icon name="Map" size={12} />
                Открыть карту
              </button>
              <button
                onClick={() => onNavigate("catalog")}
                className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.15em] uppercase font-ibm transition-all"
                style={{
                  border: '1px solid hsl(var(--gold) / 0.5)',
                  color: 'hsl(var(--gold))',
                }}
              >
                <Icon name="BookOpen" size={12} />
                Каталог
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
          style={{ color: 'hsl(var(--gold) / 0.5)' }}
        >
          <span className="text-xs tracking-[0.2em] uppercase font-ibm" style={{ writingMode: 'vertical-rl' as CSSProperties['writingMode'] }}>
            Листать
          </span>
          <Icon name="ChevronDown" size={14} />
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'hsl(var(--sepia))', borderBottom: '1px solid hsl(var(--gold) / 0.2)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-4 divide-x" style={{ borderColor: 'hsl(var(--gold) / 0.15)' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="py-8 px-6 text-center">
                <div
                  className="font-cormorant text-4xl mb-1"
                  style={{ color: 'hsl(var(--gold))', fontWeight: 300 }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs tracking-[0.15em] uppercase font-ibm"
                  style={{ color: 'hsl(36 20% 65%)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="ornament mb-4">
            <span className="font-cormorant text-xl italic" style={{ color: 'hsl(var(--ink-muted))' }}>
              Разделы гида
            </span>
          </div>
          <h2
            className="font-cormorant text-4xl"
            style={{ color: 'hsl(var(--ink))', fontWeight: 300 }}
          >
            Исследуйте историю
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`monument-card text-left p-8 fade-in-up fade-in-up-delay-${idx + 1}`}
              style={{
                background: 'hsl(var(--parchment-dark))',
                border: '1px solid hsl(var(--border))',
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{
                    border: '1px solid hsl(var(--gold) / 0.4)',
                    background: 'hsl(var(--gold) / 0.06)',
                  }}
                >
                  <Icon name={section.icon} size={18} style={{ color: 'hsl(var(--gold))' }} />
                </div>
                <span
                  className="text-xs tracking-[0.1em] uppercase font-ibm px-3 py-1"
                  style={{
                    border: '1px solid hsl(var(--gold) / 0.3)',
                    color: 'hsl(var(--gold))',
                    fontSize: '10px',
                  }}
                >
                  {section.badge}
                </span>
              </div>

              <h3
                className="font-cormorant text-2xl mb-3"
                style={{ color: 'hsl(var(--ink))', fontWeight: 400 }}
              >
                {section.title}
              </h3>
              <p
                className="font-ibm text-sm leading-relaxed mb-6"
                style={{ color: 'hsl(var(--ink-muted))', fontWeight: 300 }}
              >
                {section.desc}
              </p>

              <div
                className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase font-ibm"
                style={{ color: 'hsl(var(--gold))' }}
              >
                Перейти
                <Icon name="ArrowRight" size={12} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured image */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden" style={{ height: 320 }}>
          <img
            src="https://cdn.poehali.dev/projects/35e99b30-aa66-45af-aba6-b153e8cdeca7/files/7a1577ca-82a1-40df-995b-b6896c1939f8.jpg"
            alt="Архивные материалы"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 flex items-end p-10"
            style={{ background: 'linear-gradient(to top, hsl(var(--ink) / 0.8), transparent)' }}
          >
            <div>
              <div
                className="text-xs tracking-[0.2em] uppercase font-ibm mb-2"
                style={{ color: 'hsl(var(--gold))' }}
              >
                Архивные материалы
              </div>
              <h3
                className="font-cormorant text-3xl"
                style={{ color: 'hsl(36 30% 94%)', fontWeight: 300 }}
              >
                Документальная база — более 2 000 источников
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: 'hsl(var(--ink))',
          borderTop: '1px solid hsl(var(--gold) / 0.2)',
        }}
        className="py-10"
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div
            className="font-cormorant text-sm"
            style={{ color: 'hsl(var(--gold) / 0.6)' }}
          >
            © 2024 Исторический гид
          </div>
          <div
            className="font-ibm text-xs tracking-[0.15em] uppercase"
            style={{ color: 'hsl(var(--gold) / 0.4)' }}
          >
            Культурное наследие региона
          </div>
        </div>
      </footer>
    </div>
  );
}