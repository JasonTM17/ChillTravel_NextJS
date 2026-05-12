"use client";

/**
 * NotificationBell — navbar bell icon with unread badge + dropdown.
 * Design §18.1 — Notification UI (Req 37)
 *
 * - Polls every 30 s for unread count.
 * - Dropdown shows last 10 notifications.
 * - Click marks as read and navigates to link.
 * - Hidden when user is not authenticated.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { notificationApi, type Notification } from "@/lib/api/notification.api";

// ---------------------------------------------------------------------------
// Type icon map
// ---------------------------------------------------------------------------

const TYPE_ICON: Record<string, string> = {
  BOOKING_CONFIRMED: "✓",
  BOOKING_CANCELLED: "✗",
  BOOKING_COMPLETED: "✓",
  REVIEW_APPROVED: "★",
  CONTACT_REPLY: "✉",
  SYSTEM: "ℹ",
};

function typeIcon(type: string): string {
  return TYPE_ICON[type] ?? "ℹ";
}

// ---------------------------------------------------------------------------
// Relative time helper
// ---------------------------------------------------------------------------

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Vừa xong";
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
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
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
        aria-label={`Thông báo${unreadCount > 0 ? ` — ${unreadCount} chưa đọc` : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative hidden rounded-xl border border-[#d9ecfb] p-2 text-[#476273] transition hover:bg-[#eef7ff] hover:text-[#0277d4] md:inline-flex"
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-black leading-none text-white"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="Thông báo gần đây"
          className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-[#d9ecfb] bg-white shadow-[0_18px_48px_rgba(2,68,120,0.16)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e4eef6] px-4 py-3">
            <span className="text-sm font-black text-[#071827]">Thông báo</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#eef7ff] px-2 py-0.5 text-xs font-bold text-[#0277d4]">
                {unreadCount} chưa đọc
              </span>
            )}
          </div>

          {/* List */}
          <ul className="max-h-[360px] overflow-y-auto">
            {loading && notifications.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-[#476273]">
                Đang tải…
              </li>
            )}
            {!loading && notifications.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-[#476273]">
                Chưa có thông báo nào
              </li>
            )}
            {notifications.map((n) => (
              <li key={n.id} role="menuitem">
                <button
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[#eef7ff] ${
                    !n.isRead ? "bg-[#f0f8ff]" : ""
                  }`}
                >
                  {/* Type icon */}
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                      !n.isRead
                        ? "bg-[#0277d4] text-white"
                        : "bg-[#e4eef6] text-[#476273]"
                    }`}
                  >
                    {typeIcon(n.type)}
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm ${
                        !n.isRead ? "font-bold text-[#071827]" : "font-medium text-[#334e60]"
                      }`}
                    >
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[#476273]">{n.body}</p>
                    <p className="mt-1 text-[10px] text-[#8aabb8]">{relativeTime(n.createdAt)}</p>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0277d4]"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="border-t border-[#e4eef6] px-4 py-2.5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/notifications");
              }}
              className="w-full rounded-xl py-2 text-center text-sm font-bold text-[#0277d4] transition hover:bg-[#eef7ff]"
            >
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
