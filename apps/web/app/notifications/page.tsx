'use client';

/**
 * /notifications — Full notifications page with pagination.
 * Design §18.1 — Notification UI (Req 37)
 *
 * - Redirects to /login if not authenticated.
 * - Mark all as read button.
 * - Paginated list with type icon, title, body, timestamp.
 */

import { Bell, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { notificationApi, type Notification } from '@/lib/api/notification.api';
import { useAuth } from '@/lib/auth/auth-context';

// ---------------------------------------------------------------------------
// Type icon + label map
// ---------------------------------------------------------------------------

const TYPE_META: Record<string, { icon: string; label: string; color: string }> = {
  BOOKING_CONFIRMED: {
    icon: '✓',
    label: 'Đặt tour thành công',
    color: 'bg-green-100 text-green-700',
  },
  BOOKING_CANCELLED: { icon: '✗', label: 'Đặt tour bị hủy', color: 'bg-red-100 text-red-600' },
  BOOKING_COMPLETED: { icon: '✓', label: 'Tour hoàn thành', color: 'bg-blue-100 text-blue-700' },
  REVIEW_APPROVED: {
    icon: '★',
    label: 'Đánh giá được duyệt',
    color: 'bg-yellow-100 text-yellow-700',
  },
  CONTACT_REPLY: { icon: '✉', label: 'Phản hồi liên hệ', color: 'bg-purple-100 text-purple-700' },
  SYSTEM: { icon: 'ℹ', label: 'Hệ thống', color: 'bg-tv-blue-light text-tv-blue' },
};

function typeMeta(type: string) {
  return TYPE_META[type] ?? { icon: 'ℹ', label: type, color: 'bg-tv-blue-light text-tv-blue' };
}

// ---------------------------------------------------------------------------
// Relative time helper
// ---------------------------------------------------------------------------

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

// ---------------------------------------------------------------------------
// Skeleton row
// ---------------------------------------------------------------------------

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-start gap-4 rounded-tv border border-tv-border bg-white p-4">
      <div className="h-10 w-10 shrink-0 rounded-full tv-skeleton" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded tv-skeleton" />
        <div className="h-3 w-full rounded tv-skeleton" />
        <div className="h-3 w-1/4 rounded tv-skeleton" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch page
  const fetchPage = useCallback(
    async (p: number) => {
      if (!isAuthenticated) return;
      setLoading(true);
      setError(null);
      try {
        const res = await notificationApi.list({ page: p, size: PAGE_SIZE });
        if (res.success) {
          setNotifications(res.data.items);
          setTotalPages(res.data.totalPages);
          setTotalElements(res.data.totalElements);
        } else {
          setError('Không thể tải thông báo. Vui lòng thử lại.');
        }
      } catch {
        setError('Không thể tải thông báo. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  useEffect(() => {
    void fetchPage(page);
  }, [fetchPage, page]);

  // Mark all as read
  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Ignore
    } finally {
      setMarkingAll(false);
    }
  }

  // Mark single as read + navigate
  async function handleClick(n: Notification) {
    if (!n.isRead) {
      try {
        await notificationApi.markRead(n.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)),
        );
      } catch {
        // Ignore
      }
    }
    if (n.link) {
      router.push(n.link);
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ------------------------------------------------------------------
  // Loading / auth guard
  // ------------------------------------------------------------------

  if (authLoading || !isAuthenticated) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-tv bg-tv-blue-light">
            <Bell size={20} className="text-tv-blue" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-tv-ink">Thông báo</h1>
            {totalElements > 0 && (
              <p className="text-sm text-tv-ink-3">
                {totalElements} thông báo
                {unreadCount > 0 && ` · ${unreadCount} chưa đọc`}
              </p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="inline-flex items-center gap-2 rounded-tv-sm border border-tv-border px-3 py-2 text-sm font-bold text-tv-blue transition hover:bg-tv-blue-light disabled:opacity-50"
          >
            <CheckCheck size={16} aria-hidden="true" />
            {markingAll ? 'Đang xử lý…' : 'Đánh dấu tất cả đã đọc'}
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-tv border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600">
          {error}
          <button
            type="button"
            onClick={() => fetchPage(page)}
            className="ml-2 font-bold underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && notifications.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-tv border border-tv-border bg-white py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tv-blue-light">
            <Bell size={28} className="text-tv-blue" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-tv-ink">Chưa có thông báo</p>
            <p className="mt-1 text-sm text-tv-ink-3">
              Các thông báo về đặt tour, đánh giá sẽ xuất hiện ở đây.
            </p>
          </div>
        </div>
      )}

      {/* Notification list */}
      {!loading && notifications.length > 0 && (
        <ul className="space-y-3" aria-label="Danh sách thông báo">
          {notifications.map((n) => {
            const meta = typeMeta(n.type);
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-4 rounded-tv border p-4 text-left transition hover:shadow-md ${
                    !n.isRead
                      ? 'border-tv-blue bg-tv-blue-light hover:bg-[#dce9f8]'
                      : 'border-tv-border bg-white hover:bg-tv-bg'
                  }`}
                >
                  {/* Type icon */}
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold ${meta.color}`}
                  >
                    {meta.icon}
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          !n.isRead ? 'font-bold text-tv-ink' : 'font-bold text-tv-ink-2'
                        }`}
                      >
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span
                          aria-label="Chưa đọc"
                          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-tv-blue"
                        />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-tv-ink-3">{n.body}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.color}`}
                      >
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-tv-ink-3">{relativeTime(n.createdAt)}</span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <nav
          aria-label="Phân trang thông báo"
          className="mt-8 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-tv-sm border border-tv-border px-4 py-2 text-sm font-bold text-tv-blue transition hover:bg-tv-blue-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Trước
          </button>

          <span className="text-sm text-tv-ink-3">
            Trang {page + 1} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-tv-sm border border-tv-border px-4 py-2 text-sm font-bold text-tv-blue transition hover:bg-tv-blue-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            Tiếp →
          </button>
        </nav>
      )}
    </main>
  );
}
