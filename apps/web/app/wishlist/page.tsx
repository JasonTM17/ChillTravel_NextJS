'use client';

/**
 * Saved items page — Req 14, 27, 45
 * Shows user's saved items fetched from the favorites API.
 * Supports remove with optimistic update.
 */

import { Heart, Luggage, MapPin, Share2, Ticket, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { CommerceSurface, StatusPill, TrustBanner } from '@/components/commerce-primitives';
import { PageShell } from '@/components/page-shell';
import { wishlistApi as favoritesApi } from '@/lib/api';
import { formatVnd } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FavoriteEntry = Awaited<ReturnType<typeof favoritesApi.list>>['data'][number];

function getItemName(entry: FavoriteEntry): string {
  const item = entry.item as Record<string, unknown> | undefined;
  if (!item) return entry.itemId;
  return (item.title as string) ?? (item.name as string) ?? entry.itemId;
}

function getItemSlug(entry: FavoriteEntry): string {
  const item = entry.item as Record<string, unknown> | undefined;
  return (item?.slug as string) ?? entry.itemId;
}

function getItemImageUrl(entry: FavoriteEntry): string | null {
  const item = entry.item as Record<string, unknown> | undefined;
  return (item?.imageUrl as string) ?? null;
}

function getItemPrice(entry: FavoriteEntry): number | null {
  const item = entry.item as Record<string, unknown> | undefined;
  if (!item) return null;
  const price =
    (item.salePrice as number) ?? (item.basePrice as number) ?? (item.budgetMin as number) ?? null;
  return price;
}

function getItemHref(entry: FavoriteEntry): string {
  const slug = getItemSlug(entry);
  if (entry.itemType === 'TOUR') return `/tours/${slug}`;
  return `/destinations/${slug}`;
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function FavoriteSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-tv border border-tv-border bg-white h-40" />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Saved item card
// ---------------------------------------------------------------------------

function FavoriteCard({
  entry,
  onRemove,
}: {
  entry: FavoriteEntry;
  onRemove: (id: string) => void;
}) {
  const [removing, setRemoving] = useState(false);
  const name = getItemName(entry);
  const imageUrl = getItemImageUrl(entry);
  const price = getItemPrice(entry);
  const href = getItemHref(entry);

  async function handleRemove() {
    setRemoving(true);
    // Optimistic: remove immediately from UI
    onRemove(entry.id);
    try {
      await favoritesApi.remove(entry.id);
    } catch {
      // If it fails, the parent already removed it optimistically.
      // A real app would restore it; for demo we keep it removed.
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="group overflow-hidden rounded-tv border border-tv-border bg-white shadow-tv-card">
      <div className="flex">
        {imageUrl ? (
          <div
            className="h-32 w-32 shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
            role="img"
            aria-label={name}
          />
        ) : (
          <div className="h-32 w-32 shrink-0 bg-tv-blue-light flex items-center justify-center">
            <Heart size={28} className="text-tv-border" aria-hidden="true" />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <StatusPill tone={entry.itemType === 'TOUR' ? 'blue' : 'teal'}>
                {entry.itemType === 'TOUR' ? 'Tour' : 'Điểm đến'}
              </StatusPill>
              <Link href={href}>
                <h3 className="mt-2 font-bold text-tv-ink group-hover:text-tv-blue">{name}</h3>
              </Link>
              {price !== null && (
                <p className="mt-1 text-sm font-bold text-tv-orange">
                  {formatVnd(price)}
                  {entry.itemType === 'DESTINATION' && ' / ngày'}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="shrink-0 rounded-tv-sm border border-tv-border bg-white p-2 text-tv-ink-3 hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-60"
              aria-label={`Xóa ${name} khỏi danh sách yêu thích`}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Link
              href={href}
              className="rounded-tv-sm bg-tv-blue px-4 py-2 text-xs font-bold text-white"
            >
              Xem chi tiết
            </Link>
            <Heart size={16} fill="#FF6D00" className="text-tv-orange" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner page content (rendered inside AuthGuard)
// ---------------------------------------------------------------------------

function FavoriteContent() {
  const [entries, setEntries] = useState<FavoriteEntry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const res = await favoritesApi.list();
      if (res.success) {
        setEntries(res.data);
      } else {
        setError(res.message ?? 'Không thể tải danh sách yêu thích.');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Optimistic remove
  function handleRemove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const tours = entries.filter((e) => e.itemType === 'TOUR');
  const destinations = entries.filter((e) => e.itemType === 'DESTINATION');

  return (
    <PageShell eyebrow="Yêu thích" title="Lưu điểm đến, nơi ở và trải nghiệm theo từng chuyến">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-5">
          {fetching ? (
            <FavoriteSkeleton />
          ) : error ? (
            <CommerceSurface>
              <p className="text-sm font-bold text-red-600">{error}</p>
              <button
                type="button"
                onClick={fetchFavorites}
                className="mt-3 rounded-tv-sm bg-tv-blue px-4 py-2 text-sm font-bold text-white"
              >
                Thử lại
              </button>
            </CommerceSurface>
          ) : entries.length === 0 ? (
            <CommerceSurface>
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <Heart size={40} className="text-tv-border" aria-hidden="true" />
                <p className="text-lg font-bold text-tv-ink">Danh sách yêu thích trống</p>
                <p className="text-sm text-tv-ink-3">
                  Nhấn vào biểu tượng trái tim trên các tour và điểm đến để lưu vào đây.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/tours"
                    className="rounded-tv bg-tv-blue px-6 py-3 text-sm font-bold text-white"
                  >
                    Khám phá tour
                  </Link>
                  <Link
                    href="/destinations"
                    className="rounded-tv border border-tv-border bg-white px-6 py-3 text-sm font-bold text-tv-blue"
                  >
                    Điểm đến
                  </Link>
                </div>
              </div>
            </CommerceSurface>
          ) : (
            <>
              {tours.length > 0 && (
                <CommerceSurface>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <StatusPill tone="blue">{tours.length} tour đã lưu</StatusPill>
                      <h2 className="mt-2 text-xl font-bold">Tour yêu thích</h2>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {tours.map((entry) => (
                      <FavoriteCard key={entry.id} entry={entry} onRemove={handleRemove} />
                    ))}
                  </div>
                </CommerceSurface>
              )}

              {destinations.length > 0 && (
                <CommerceSurface>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <StatusPill tone="teal">{destinations.length} điểm đến đã lưu</StatusPill>
                      <h2 className="mt-2 text-xl font-bold">Điểm đến yêu thích</h2>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {destinations.map((entry) => (
                      <FavoriteCard key={entry.id} entry={entry} onRemove={handleRemove} />
                    ))}
                  </div>
                </CommerceSurface>
              )}
            </>
          )}
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-bold">Hành động nhanh</h2>
            <div className="mt-4 space-y-3">
              {(
                [
                  [
                    Luggage,
                    'Tạo gói offline',
                    'Lưu lịch trình, checklist và thông tin khẩn cấp mẫu.',
                  ],
                  [Ticket, 'Đặt chỗ demo', 'Chuyển mục đã lưu thành giữ chỗ mô phỏng.'],
                  [Share2, 'Link đọc công khai', 'Tạo trang chia sẻ read-only như travel story.'],
                  [MapPin, 'Xem trên bản đồ', 'Gom các marker theo từng nhóm chuyến.'],
                ] as const
              ).map(([Icon, title, body]) => (
                <div key={String(title)} className="flex gap-3 rounded-tv bg-tv-bg p-4">
                  <Icon className="mt-0.5 shrink-0 text-tv-blue" size={20} aria-hidden="true" />
                  <div>
                    <p className="font-bold">{String(title)}</p>
                    <p className="mt-1 text-sm leading-6 text-tv-ink-3">{String(body)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FavoritePage() {
  return (
    <AuthGuard>
      <FavoriteContent />
    </AuthGuard>
  );
}
