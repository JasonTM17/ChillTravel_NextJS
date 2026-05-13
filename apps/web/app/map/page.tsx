'use client';

import { Filter } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { destinationApi, getCountryName } from '@/lib/api/destination.api';
import type { Destination } from '@/lib/api/destination.api';
import { useLocale } from '@/lib/i18n';

// Lazy-load the map component (Leaflet requires window)
const MapView = dynamic(() => import('@/components/map-view'), { ssr: false });

/* ─── Destination coordinates (from seed data) ─────────────────────────────── */
const COORDS: Record<string, [number, number]> = {
  'ha-long-bay': [20.9101, 107.1839],
  'da-nang': [16.0544, 108.2022],
  'hoi-an': [15.8801, 108.338],
  sapa: [22.3364, 103.8438],
  'ninh-binh': [20.2506, 105.9745],
  'phu-quoc': [10.2899, 103.984],
  'da-lat': [11.9404, 108.4583],
  'ha-giang': [23.0035, 105.0146],
  bali: [-8.3405, 115.092],
  tokyo: [35.6762, 139.6503],
  paris: [48.8566, 2.3522],
  bangkok: [13.7563, 100.5018],
  'nha-trang': [12.2388, 109.1967],
  hue: [16.4637, 107.5909],
  'ha-noi': [21.0285, 105.8542],
  'can-tho': [10.0452, 105.7469],
  seoul: [37.5665, 126.978],
  singapore: [1.3521, 103.8198],
  london: [51.5074, -0.1278],
  sydney: [-33.8688, 151.2093],
};

/* ─── Filter categories ────────────────────────────────────────────────────── */
const CATEGORIES = ['Tất cả', 'Biển', 'Núi', 'Văn hóa', 'Ẩm thực', 'Nghỉ dưỡng', 'Phiêu lưu'];

export default function MapPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const { locale } = useLocale();

  useEffect(() => {
    destinationApi
      .list({ size: 20 })
      .then((res) => {
        if (res.success) setDestinations(res.data.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === 'Tất cả'
      ? destinations
      : destinations.filter((d) =>
          d.category?.toLowerCase().includes(activeCategory.toLowerCase()),
        );

  const markers = filtered
    .filter((d) => COORDS[d.slug])
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      position: COORDS[d.slug] as [number, number],
      country: getCountryName(d),
    }));

  return (
    <main className="min-h-screen bg-tv-bg">
      {/* Header */}
      <div className="border-b border-tv-border bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-4">
          <h1 className="text-tv-xl font-bold text-tv-ink">Bản đồ điểm đến</h1>
          <p className="mt-1 text-tv-sm text-tv-ink-3">
            Khám phá {destinations.length} điểm đến trên bản đồ thật
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-5">
        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Filter */}
            <div className="rounded-tv border border-tv-border bg-white p-4 shadow-tv-card">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-tv-blue" />
                <span className="text-tv-sm font-bold text-tv-ink">Lọc theo loại</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-3 py-1.5 text-tv-xs font-semibold transition-colors ${
                      activeCategory === cat
                        ? 'bg-tv-blue text-white'
                        : 'border border-tv-border bg-white text-tv-ink-2 hover:border-tv-blue hover:text-tv-blue'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination list */}
            <div className="rounded-tv border border-tv-border bg-white shadow-tv-card">
              <div className="border-b border-tv-border px-4 py-3">
                <span className="text-tv-sm font-bold text-tv-ink">{filtered.length} điểm đến</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="tv-skeleton h-12 rounded-tv-sm" />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <p className="p-4 text-tv-sm text-tv-ink-3">Không tìm thấy điểm đến.</p>
                ) : (
                  <div className="divide-y divide-tv-border">
                    {filtered.map((d, i) => (
                      <Link
                        key={d.slug}
                        href={`/destinations/${d.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-tv-bg transition-colors"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tv-blue text-tv-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-tv-sm font-semibold text-tv-ink truncate">{d.name}</p>
                          <p className="text-tv-xs text-tv-ink-3">{getCountryName(d)}</p>
                        </div>
                        {d.ratingAvg != null && (
                          <span className="text-tv-xs font-bold text-amber-600">
                            ★ {d.ratingAvg.toFixed(1)}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Map */}
          <div
            className="rounded-tv border border-tv-border bg-white shadow-tv-card overflow-hidden"
            style={{ minHeight: 500 }}
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="tv-skeleton h-full w-full" />
              </div>
            ) : (
              <MapView markers={markers} locale={locale} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
