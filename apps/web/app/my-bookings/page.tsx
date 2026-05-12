"use client";

/**
 * My Bookings page — Req 10, 27, 45
 * Lists the current user's bookings with status badges and cancel action.
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, Ticket } from "lucide-react";
import { bookingApi, type Booking } from "@/lib/api";
import {
  CommerceSurface,
  StatusPill,
  TrustBanner,
} from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { formatVnd } from "@/lib/utils";
import { AuthGuard } from "@/components/auth-guard";

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

type StatusTone = "blue" | "orange" | "teal" | "gray";

function bookingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    pending: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    confirmed: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    cancelled: "Đã hủy",
    COMPLETED: "Hoàn thành",
    completed: "Hoàn thành",
    REFUNDED: "Đã hoàn tiền (demo)",
    refunded_mock: "Đã hoàn tiền (demo)",
  };
  return labels[status] ?? status;
}

function bookingStatusTone(status: string): StatusTone {
  const s = status.toUpperCase();
  if (s === "PENDING") return "orange";
  if (s === "CONFIRMED") return "teal";
  if (s === "COMPLETED") return "blue";
  return "gray";
}

function paymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    UNPAID: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    FAILED: "Thanh toán thất bại",
    REFUNDED: "Đã hoàn tiền",
  };
  return labels[status] ?? status;
}

function canCancel(status: string): boolean {
  const s = status.toUpperCase();
  return s === "PENDING" || s === "CONFIRMED";
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function BookingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="tv-card h-28 p-5"
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Booking row
// ---------------------------------------------------------------------------

function BookingRow({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (code: string) => void;
}) {
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    if (
      !window.confirm(
        `Bạn có chắc muốn hủy booking ${booking.bookingCode}?`
      )
    )
      return;
    setCancelling(true);
    try {
      const res = await bookingApi.cancel(booking.bookingCode);
      if (res.success) {
        onCancel(booking.bookingCode);
      } else {
        alert(res.message ?? "Hủy booking thất bại.");
      }
    } catch {
      alert("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="tv-card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-tv-blue">
              {booking.bookingCode}
            </span>
            <StatusPill tone={bookingStatusTone(booking.status)}>
              {bookingStatusLabel(booking.status)}
            </StatusPill>
            <StatusPill tone="gray">
              {paymentStatusLabel(booking.paymentStatus)}
            </StatusPill>
          </div>
          <p className="font-bold text-tv-ink">
            {booking.tour?.title ?? `Tour #${booking.tourId}`}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-tv-ink-3">
            <span className="flex items-center gap-1">
              <CalendarDays size={14} aria-hidden="true" />
              {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}
            </span>
            <span>{booking.numberOfGuests} khách</span>
            <span className="font-bold text-tv-orange">
              {formatVnd(booking.totalPrice)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canCancel(booking.status) && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-tv-sm border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
            >
              {cancelling ? "Đang hủy..." : "Hủy booking"}
            </button>
          )}
          <Link
            href={`/bookings/${booking.bookingCode}`}
            className="flex items-center gap-1 rounded-tv-sm bg-tv-blue px-4 py-2 text-sm font-bold text-white"
          >
            Chi tiết
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner page content (rendered inside AuthGuard)
// ---------------------------------------------------------------------------

function MyBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 20;

  const fetchBookings = useCallback(async (pageNum: number) => {
    setFetching(true);
    setError(null);
    try {
      const res = await bookingApi.listMine({ page: pageNum, size: PAGE_SIZE });
      if (res.success) {
        setBookings(res.data.items);
        setTotalPages(res.data.totalPages ?? 1);
      } else {
        setError(res.message ?? "Không thể tải danh sách booking.");
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(page);
  }, [fetchBookings, page]);

  function handleCancelled(code: string) {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingCode === code ? { ...b, status: "CANCELLED" } : b
      )
    );
  }

  return (
    <PageShell
      eyebrow="Tài khoản"
      title="Lịch sử đặt tour của bạn"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="space-y-4">
          {fetching ? (
            <BookingSkeleton />
          ) : error ? (
            <CommerceSurface>
              <p className="text-sm font-bold text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => fetchBookings(page)}
                className="mt-3 rounded-tv-sm bg-tv-blue px-4 py-2 text-sm font-bold text-white"
              >
                Thử lại
              </button>
            </CommerceSurface>
          ) : bookings.length === 0 ? (
            <CommerceSurface>
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <Ticket size={40} className="text-tv-border" aria-hidden="true" />
                <p className="text-lg font-bold text-tv-ink">
                  Bạn chưa có booking nào
                </p>
                <p className="text-sm text-tv-ink-3">
                  Khám phá các tour hấp dẫn và đặt chuyến đi đầu tiên của bạn.
                </p>
                <Link
                  href="/tours"
                  className="rounded-tv bg-tv-blue px-6 py-3 text-sm font-bold text-white"
                >
                  Khám phá tour
                </Link>
              </div>
            </CommerceSurface>
          ) : (
            <>
              {bookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelled}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="rounded-tv-sm border border-tv-border bg-white px-4 py-2 text-sm font-bold text-tv-blue disabled:opacity-40"
                  >
                    Trước
                  </button>
                  <span className="text-sm font-bold text-tv-ink-3">
                    Trang {page + 1} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="rounded-tv-sm border border-tv-border bg-white px-4 py-2 text-sm font-bold text-tv-blue disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-lg font-bold mb-3">Trạng thái booking</h2>
            <div className="space-y-2 text-sm">
              {(
                [
                  ["Chờ xác nhận", "orange"],
                  ["Đã xác nhận", "teal"],
                  ["Hoàn thành", "blue"],
                  ["Đã hủy", "gray"],
                  ["Đã hoàn tiền (demo)", "gray"],
                ] as [string, StatusTone][]
              ).map(([label, tone]) => (
                <div key={label} className="flex items-center gap-2">
                  <StatusPill tone={tone}>{label}</StatusPill>
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

export default function MyBookingsPage() {
  return (
    <AuthGuard>
      <MyBookingsContent />
    </AuthGuard>
  );
}
