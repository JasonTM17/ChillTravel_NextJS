"use client";

/**
 * Booking Detail page — Req 10, 12, 27, 45
 * Shows full booking info: tour, contact, guests, payment status, QR demo.
 */

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
  Users,
} from "lucide-react";
import { bookingApi, type Booking } from "@/lib/api";
import {
  CommerceSurface,
  StatusPill,
  TrustBanner,
} from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning } from "@/lib/vietnamese";
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

function paymentStatusTone(status: string): StatusTone {
  const tones: Record<string, StatusTone> = {
    UNPAID: "orange",
    PAID: "teal",
    FAILED: "gray",
    REFUNDED: "blue",
  };
  return tones[status] ?? "gray";
}

function canCancel(status: string): boolean {
  const s = status.toUpperCase();
  return s === "PENDING" || s === "CONFIRMED";
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-40 rounded-2xl bg-[#eef7ff]" />
      <div className="h-32 rounded-2xl bg-[#eef7ff]" />
      <div className="h-48 rounded-2xl bg-[#eef7ff]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner page content (rendered inside AuthGuard)
// ---------------------------------------------------------------------------

function BookingDetailContent({ code }: { code: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = useCallback(async () => {
    setFetching(true);
    setError(null);
    setErrorCode(null);
    try {
      const res = await bookingApi.getByCode(code);
      if (res.success) {
        setBooking(res.data);
      } else {
        setError(res.message ?? "Không thể tải thông tin booking.");
      }
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 403) {
        setErrorCode(403);
        setError("Bạn không có quyền xem booking này.");
      } else if (status === 404) {
        setErrorCode(404);
        setError("Không tìm thấy booking.");
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      }
    } finally {
      setFetching(false);
    }
  }, [code]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  async function handleCancel() {
    if (!booking) return;
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
        setBooking(res.data);
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
    <PageShell
      eyebrow="Chi tiết booking"
      title={booking ? booking.bookingCode : "Đang tải..."}
    >
      <div className="mb-4">
        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-1 text-sm font-black text-[#0277d4]"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Quay lại danh sách
        </Link>
      </div>

      {fetching ? (
        <DetailSkeleton />
      ) : error ? (
        <CommerceSurface>
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="text-lg font-black text-red-600">
              {errorCode === 403
                ? "403 — Không có quyền"
                : errorCode === 404
                ? "404 — Không tìm thấy"
                : "Lỗi"}
            </p>
            <p className="text-sm text-[#476273]">{error}</p>
            <Link
              href="/my-bookings"
              className="rounded-2xl bg-[#0277d4] px-6 py-3 text-sm font-black text-white"
            >
              Về danh sách booking
            </Link>
          </div>
        </CommerceSurface>
      ) : booking ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-5">
            {/* Payment warning banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#ffd9bd] bg-[#fff7ed] p-4 text-sm text-[#9a3412]">
              <ShieldCheck
                className="mt-0.5 shrink-0"
                size={18}
                aria-hidden="true"
              />
              <p className="font-black">{demoPaymentWarning}</p>
            </div>

            {/* Booking overview */}
            <CommerceSurface>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">
                    Mã booking
                  </p>
                  <p className="mt-1 text-2xl font-black text-[#0277d4]">
                    {booking.bookingCode}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone={bookingStatusTone(booking.status)}>
                    {bookingStatusLabel(booking.status)}
                  </StatusPill>
                  <StatusPill tone={paymentStatusTone(booking.paymentStatus)}>
                    {paymentStatusLabel(booking.paymentStatus)}
                  </StatusPill>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">
                    Tour
                  </p>
                  <p className="mt-1 font-black text-[#071827]">
                    {booking.tour?.title ?? `Tour #${booking.tourId}`}
                  </p>
                  {booking.tour && (
                    <p className="mt-0.5 text-sm text-[#476273]">
                      {booking.tour.durationDays} ngày{" "}
                      {booking.tour.durationNights} đêm
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">
                    Ngày đặt
                  </p>
                  <p className="mt-1 flex items-center gap-1 font-bold text-[#071827]">
                    <CalendarDays size={14} aria-hidden="true" />
                    {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">
                    Số khách
                  </p>
                  <p className="mt-1 flex items-center gap-1 font-bold text-[#071827]">
                    <Users size={14} aria-hidden="true" />
                    {booking.numberOfGuests} khách
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">
                    Tổng tiền
                  </p>
                  <p className="mt-1 text-xl font-black text-[#ff5f12]">
                    {formatVnd(booking.totalPrice)}
                  </p>
                </div>
              </div>

              {booking.specialRequest && (
                <div className="mt-4 rounded-xl bg-[#f7fbff] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">
                    Yêu cầu đặc biệt
                  </p>
                  <p className="mt-1 text-sm text-[#476273]">
                    {booking.specialRequest}
                  </p>
                </div>
              )}
            </CommerceSurface>

            {/* Contact info */}
            <CommerceSurface>
              <h2 className="text-xl font-black mb-4">Thông tin liên hệ</h2>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">
                    Họ tên
                  </p>
                  <p className="mt-1 font-bold text-[#071827]">
                    {booking.contactName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">
                    Email
                  </p>
                  <p className="mt-1 flex items-center gap-1 font-bold text-[#071827]">
                    <Mail size={14} aria-hidden="true" />
                    {booking.contactEmail}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">
                    Điện thoại
                  </p>
                  <p className="mt-1 flex items-center gap-1 font-bold text-[#071827]">
                    <Phone size={14} aria-hidden="true" />
                    {booking.contactPhone}
                  </p>
                </div>
              </div>
            </CommerceSurface>

            {/* Guest list */}
            {booking.guests && booking.guests.length > 0 && (
              <CommerceSurface>
                <h2 className="text-xl font-black mb-4">
                  Danh sách khách ({booking.guests.length})
                </h2>
                <div className="space-y-3">
                  {booking.guests.map((guest, idx) => (
                    <div
                      key={guest.id}
                      className="flex flex-wrap items-center gap-3 rounded-xl border border-[#d9ecfb] bg-[#f7fbff] p-4"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eef7ff] text-sm font-black text-[#0277d4]">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-black text-[#071827]">
                          {guest.fullName}
                        </p>
                        <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-[#6f8594]">
                          {guest.dateOfBirth && (
                            <span>
                              Ngày sinh:{" "}
                              {new Date(
                                guest.dateOfBirth
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          )}
                          {guest.gender && <span>{guest.gender}</span>}
                          {guest.note && <span>{guest.note}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CommerceSurface>
            )}

            {/* Cancel button */}
            {canCancel(booking.status) && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="rounded-2xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-black text-red-600 hover:bg-red-100 disabled:opacity-60"
                >
                  {cancelling ? "Đang hủy..." : "Hủy booking này"}
                </button>
              </div>
            )}
          </section>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <TrustBanner compact />

            {/* QR demo — booking code in a styled box */}
            <CommerceSurface>
              <h2 className="text-lg font-black mb-3">Mã QR (demo)</h2>
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#d9ecfb] bg-[#f7fbff] p-6">
                <QrCode
                  size={48}
                  className="text-[#0277d4]"
                  aria-hidden="true"
                />
                <p className="text-center text-sm font-black text-[#071827] font-mono tracking-widest">
                  {booking.bookingCode}
                </p>
                <p className="text-center text-xs text-[#6f8594]">
                  Mã QR demo — không có giá trị thật
                </p>
              </div>
            </CommerceSurface>

            {/* Payment info */}
            {booking.payment && (
              <CommerceSurface>
                <h2 className="text-lg font-black mb-3">Thanh toán</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6f8594]">Nhà cung cấp</span>
                    <span className="font-bold">
                      {booking.payment.provider}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6f8594]">Số tiền</span>
                    <span className="font-black text-[#ff5f12]">
                      {formatVnd(booking.payment.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6f8594]">Trạng thái</span>
                    <StatusPill
                      tone={paymentStatusTone(booking.payment.status)}
                    >
                      {paymentStatusLabel(booking.payment.status)}
                    </StatusPill>
                  </div>
                  {booking.payment.transactionCode && (
                    <div className="flex justify-between">
                      <span className="text-[#6f8594]">Mã GD</span>
                      <span className="font-bold text-xs">
                        {booking.payment.transactionCode}
                      </span>
                    </div>
                  )}
                  {booking.payment.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-[#6f8594]">Thời gian</span>
                      <span className="font-bold">
                        {new Date(booking.payment.paidAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </CommerceSurface>
            )}
          </aside>
        </div>
      ) : null}
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);

  return (
    <AuthGuard>
      <BookingDetailContent code={code} />
    </AuthGuard>
  );
}
