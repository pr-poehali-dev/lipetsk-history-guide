import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  tag: string;
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Марина В.",
    date: "март 2024",
    rating: 5,
    text: "Прекрасный ресурс. Наконец-то все памятники региона собраны в одном месте с подробными описаниями. Статьи написаны очень грамотно — чувствуется серьёзная работа с источниками.",
    tag: "Исследователь",
  },
  {
    id: 2,
    name: "Дмитрий К.",
    date: "февраль 2024",
    rating: 5,
    text: "Использовал маршрут «Белокаменное кольцо» для прогулки с семьёй. Всё подробно, понятно. Карта с отметками — очень удобно, не нужно ничего дополнительно гуглить.",
    tag: "Турист",
  },
  {
    id: 3,
    name: "Елена С.",
    date: "январь 2024",
    rating: 4,
    text: "Отличный дизайн, приятно читать. Особенно понравились статьи об археологических памятниках — узнала много нового о регионе. Буду рекомендовать студентам.",
    tag: "Преподаватель",
  },
  {
    id: 4,
    name: "Андрей Т.",
    date: "декабрь 2023",
    rating: 5,
    text: "Аргамач — моё любимое место, рад что он теперь есть на карте с полным описанием. Функция отслеживания маршрута — настоящая находка для пеших прогулок.",
    tag: "Краевед",
  },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !text.trim()) return;
    const newReview: Review = {
      id: Date.now(),
      name: name.trim(),
      date: "только что",
      rating,
      text: text.trim(),
      tag: "Гость",
    };
    setReviews((prev) => [newReview, ...prev]);
    setName("");
    setText("");
    setRating(5);
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section style={{ background: 'hsl(var(--sepia))', borderTop: '1px solid hsl(var(--gold) / 0.2)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-ibm mb-3 flex items-center gap-2" style={{ color: 'hsl(var(--gold))' }}>
              <div style={{ width: 20, height: 1, background: 'hsl(var(--gold))' }} />
              Отзывы посетителей
            </div>
            <h2 className="font-cormorant text-4xl" style={{ color: 'hsl(36 30% 90%)', fontWeight: 300 }}>
              Что говорят путешественники
            </h2>
          </div>

          {/* Rating summary */}
          <div className="text-right">
            <div className="font-cormorant text-5xl" style={{ color: 'hsl(var(--gold))', fontWeight: 300 }}>
              {avgRating}
            </div>
            <div className="flex items-center justify-end gap-1 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Icon
                  key={s}
                  name="Star"
                  size={12}
                  style={{ color: s <= Math.round(Number(avgRating)) ? 'hsl(var(--gold))' : 'hsl(var(--gold) / 0.25)' }}
                />
              ))}
            </div>
            <div className="text-xs font-ibm" style={{ color: 'hsl(36 20% 60%)', fontWeight: 300 }}>
              {reviews.length} отзывов
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-2 gap-5 mb-10">
          {reviews.map((review, idx) => (
            <div
              key={review.id}
              className={`p-6 fade-in-up fade-in-up-delay-${(idx % 4) + 1}`}
              style={{ border: '1px solid hsl(var(--gold) / 0.15)', background: 'hsl(30 20% 14%)' }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center font-cormorant text-lg"
                    style={{ background: 'hsl(var(--gold) / 0.15)', color: 'hsl(var(--gold))', border: '1px solid hsl(var(--gold) / 0.25)' }}
                  >
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="font-ibm text-sm" style={{ color: 'hsl(36 25% 85%)', fontWeight: 400 }}>
                      {review.name}
                    </div>
                    <div className="font-ibm text-xs" style={{ color: 'hsl(36 15% 50%)', fontWeight: 300 }}>
                      {review.date}
                    </div>
                  </div>
                </div>
                <span
                  className="text-xs font-ibm px-2 py-0.5 tracking-[0.08em]"
                  style={{ border: '1px solid hsl(var(--gold) / 0.25)', color: 'hsl(var(--gold) / 0.7)', fontSize: 10 }}
                >
                  {review.tag}
                </span>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Icon
                    key={s}
                    name="Star"
                    size={11}
                    style={{ color: s <= review.rating ? 'hsl(var(--gold))' : 'hsl(var(--gold) / 0.2)' }}
                  />
                ))}
              </div>

              <p className="font-ibm text-sm leading-relaxed" style={{ color: 'hsl(36 15% 65%)', fontWeight: 300, lineHeight: 1.8 }}>
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* Success message */}
        {submitted && (
          <div className="mb-6 flex items-center gap-3 p-4 fade-in-up"
            style={{ border: '1px solid hsl(140 40% 32% / 0.4)', background: 'hsl(140 40% 32% / 0.1)' }}>
            <Icon name="CheckCircle" size={16} style={{ color: 'hsl(140 50% 45%)' }} />
            <span className="font-ibm text-sm" style={{ color: 'hsl(140 50% 65%)', fontWeight: 300 }}>
              Спасибо! Ваш отзыв опубликован.
            </span>
          </div>
        )}

        {/* Write review */}
        {!showForm ? (
          <div className="flex justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-8 py-3 text-xs tracking-[0.2em] uppercase font-ibm transition-all hover:opacity-80"
              style={{ border: '1px solid hsl(var(--gold) / 0.5)', color: 'hsl(var(--gold))' }}
            >
              <Icon name="PenLine" size={13} />
              Оставить отзыв
            </button>
          </div>
        ) : (
          <div
            className="p-8 fade-in-up"
            style={{ border: '1px solid hsl(var(--gold) / 0.25)', background: 'hsl(30 20% 14%)' }}
          >
            <h3 className="font-cormorant text-2xl mb-6" style={{ color: 'hsl(36 25% 88%)', fontWeight: 300 }}>
              Ваш отзыв
            </h3>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase font-ibm mb-2" style={{ color: 'hsl(var(--gold) / 0.7)' }}>
                  Ваше имя
                </label>
                <input
                  type="text"
                  placeholder="Имя или инициалы..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 font-ibm text-sm outline-none"
                  style={{ border: '1px solid hsl(var(--gold) / 0.2)', background: 'hsl(30 18% 11%)', color: 'hsl(36 25% 85%)', fontWeight: 300 }}
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase font-ibm mb-2" style={{ color: 'hsl(var(--gold) / 0.7)' }}>
                  Оценка
                </label>
                <div className="flex items-center gap-2 py-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                    >
                      <Icon
                        name="Star"
                        size={22}
                        style={{
                          color: s <= (hoverRating || rating)
                            ? 'hsl(var(--gold))'
                            : 'hsl(var(--gold) / 0.2)',
                          transition: 'color 0.15s',
                        }}
                      />
                    </button>
                  ))}
                  <span className="font-cormorant text-xl ml-1" style={{ color: 'hsl(var(--gold))' }}>
                    {rating}/5
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs tracking-[0.15em] uppercase font-ibm mb-2" style={{ color: 'hsl(var(--gold) / 0.7)' }}>
                Текст отзыва
              </label>
              <textarea
                rows={4}
                placeholder="Расскажите о вашем опыте..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 font-ibm text-sm outline-none resize-none"
                style={{ border: '1px solid hsl(var(--gold) / 0.2)', background: 'hsl(30 18% 11%)', color: 'hsl(36 25% 85%)', fontWeight: 300 }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !text.trim()}
                className="flex items-center gap-2 px-8 py-3 text-xs tracking-[0.15em] uppercase font-ibm transition-all hover:opacity-80"
                style={{
                  background: (!name.trim() || !text.trim()) ? 'hsl(30 15% 20%)' : 'hsl(var(--gold))',
                  color: (!name.trim() || !text.trim()) ? 'hsl(36 15% 45%)' : 'hsl(var(--ink))',
                  cursor: (!name.trim() || !text.trim()) ? 'not-allowed' : 'pointer',
                }}
              >
                <Icon name="Send" size={12} />
                Опубликовать
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 text-xs tracking-[0.12em] uppercase font-ibm"
                style={{ border: '1px solid hsl(var(--gold) / 0.2)', color: 'hsl(36 20% 55%)' }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
