'use client';

/**
 * NotificationBell — navbar bell icon with unread badge + dropdown.
 * Design §18.1 — Notification UI (Req 37)
 *
 * - Polls every 30 s for unread count.
 * - Dropdown shows last 10 notifications.
 * - Click marks as read and navigates to link.
 * - Hidden when user is not authenticated.
 */

import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { notificationApi, type Notification } from '@/lib/api/notification.api';
import { useAuth } from '@/lib/auth/auth-context';

// ---------------------------------------------------------------------------
// Type icon map
// ---------------------------------------------------------------------------

const TYPE_ICON: Record<string, string> = {
  BOOKING_CONFIRMED: '✓',
  BOOKING_CANCELLED: '✗',
  BOOKING_COMPLETED: '✓',
  REVIEW_APPROVED: '★',
  CONTACT_REPLY: '✉',
  SYSTEM: 'ℹ',
};

function typeIcon(type: string): string {
  return TYPE_ICON[type] ?? 'ℹ';
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
  return `${days} ngày trước`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------------
  // Fetch last 10 notifications + derive unread count
  // ------------------------------------------------------------------

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationApi.list({ page: 0, size: 10 });
      if (res.success) {
        const items = res.data.items;
        setNotifications(items);
        setUnreadCount(items.filter((n) => !n.isRead).length);
      }
    } catch {
      // Silently ignore — network may be unavailable
    }
  }, [isAuthenticated]);

  // Initial fetch + polling every 30 s
  useEffect(() => {
    if (!isAuthenticated) return;

    void fetchNotifications();

    const interval = setInterval(() => {
      void fetchNotifications();
    }, 30_000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  // Re-fetch on route change (pathname change triggers re-render of layout)
  // We rely on the polling + manual open-dropdown fetch for simplicity.

  // ------------------------------------------------------------------
  // Close dropdown on outside click
  // ------------------------------------------------------------------

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------

  async function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      await fetchNotifications();
      setLoading(false);
    }
  }

  async function handleNotificationClick(n: Notification) {
    setOpen(false);
    // Mark as read (fire-and-forget)
    if (!n.isRead) {
      try {
        await notificationApi.markRead(n.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)),
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // Ignore
      }
    }
    if (n.link) {
      router.push(n.link);
    }
  }

  // ------------------------------------------------------------------
  // Don't render for unauthenticated users
  // ------------------------------------------------------------------

  if (!isAuthenticated) return null;

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`Thông báo${unreadCount > 0 ? ` — ${unreadCount} chưa đọc` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative hidden rounded-tv-sm border border-[tv-border] p-2 text-[tv-ink-3] transition hover:bg-[tv-blue-light] hover:text-[tv-blue] md:inline-flex"
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold leading-none text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="Thông báo gần đây"
          className="absolute right-0 mt-3 w-80 overflow-hidden rounded-tv border border-[tv-border] bg-white shadow-[0_18px_48px_rgba(2,68,120,0.16)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[tv-border] px-4 py-3">
            <span className="text-sm font-bold text-[tv-ink]">Thông báo</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[tv-blue-light] px-2 py-0.5 text-xs font-bold text-[tv-blue]">
                {unreadCount} chưa đọc
              </span>
            )}
          </div>

          {/* List */}
          <ul className="max-h-[360px] overflow-y-auto">
            {loading && notifications.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-[tv-ink-3]">Đang tải…</li>
            )}
            {!loading && notifications.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-[tv-ink-3]">
                Chưa có thông báo nào
              </li>
            )}
            {notifications.map((n) => (
              <li key={n.id} role="menuitem">
                <button
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[tv-blue-light] ${
                    !n.isRead ? 'bg-[#f0f8ff]' : ''
                  }`}
                >
                  {/* Type icon */}
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      !n.isRead ? 'bg-[tv-blue] text-white' : 'bg-[tv-border] text-[tv-ink-3]'
                    }`}
                  >
                    {typeIcon(n.type)}
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm ${
                        !n.isRead ? 'font-bold text-[tv-ink]' : 'font-medium text-[tv-ink-2]'
                      }`}
                    >
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[tv-ink-3]">{n.body}</p>
                    <p className="mt-1 text-[10px] text-[#8aabb8]">{relativeTime(n.createdAt)}</p>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[tv-blue]"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="border-t border-[tv-border] px-4 py-2.5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push('/notifications');
              }}
              className="w-full rounded-tv-sm py-2 text-center text-sm font-bold text-[tv-blue] transition hover:bg-[tv-blue-light]"
            >
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
