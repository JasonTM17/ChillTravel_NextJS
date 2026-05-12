"use client";

/**
 * Booking Confirmation page — /booking/success/[code]
 * Req 10, 12, 45 | Design §7
 *
 * URL params: code (booking code, e.g. WV-20260101-ABCDEF)
 * Shows: booking code (QR demo), tour name, dates, guests, total price, payment status.
 */

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Home,
  Loader2,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { bookingApi, type Booking } from "@/lib/api/booking.api";
import { CommerceSurface, StatusPill } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning, formatDateVi } from "@/lib/vietnamese";

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

function bookingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    COMPLETED: "Hoàn thành",
    REFUNDED: "Đã hoàn tiền (demo)",
  };
  return labels[status.toUpperCase()] ?? status;
}

function paymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    UNPAID: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    FAILED: "Thanh toán thất bại",
    REFUNDED: "Đã hoàn tiền (demo)",
  };
  return labels[status.toUpperCase()] ?? status;
}

type StatusTone = "blue" | "orange" | "teal" | "gray";

function paymentStatusTone(status: string): StatusTone {
  const s = status.toUpperCase();
  if (s === "PAID") return "teal";
  if (s === "FAILED") return "gray";
  if (s === "UNPAID") return "orange";
  return "blue";
}

function bookingStatusTone(status: string): StatusTone {
  const s = status.toUpperCase();
  if (s === "CONFIRMED") return "teal";
  if (s === "COMPLETED") return "blue";
  if (s === "CANCELLED") return "gray";
  return "orange";
}

// ---------------------------------------------------------------------------
// Demo banner
// ---------------------------------------------------------------------------

function DemoBanner() {
  return (
    <div className="rounded-2xl border border-[#f0b3ad] bg-[#ffe4e1] p-4 text-[#9f1239]">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
        <div>
          <p className="font-black">{demoPaymentWarning}</p>
          <p className="mt-1 text-sm font-bold text-[#9f1239]/80">
            Đây là xác nhận demo. Không phát sinh giao dịch thật.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------

const STEPS = ["Thông tin đặt tour", "Thanh toán demo", "Xác nhận"] as const;

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Tiến trình đặt tour">
      {STEPS.map((step, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                active
                  ? "bg-[#0277d4] text-white ring-4 ring-[#b8ddff]"
                  : done
                  ? "bg-[#0f8b7b] text-white"
                  : "bg-[#edf4fa] text-[#8b99a7]"
              }`}
            >
              {done ? <CheckCircle2 size={14} aria-hidden="true" /> : i + 1}
            </span>
            <span
              className={`hidden font-black sm:inline ${
                active ? "text-[#0277d4]" : done ? "text-[#0f8b7b]" : "text-[#8b99a7]"
              }`}
            >
              {step}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight size={14} className="text-[#c8d5e3]" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// QR Demo card
// ---------------------------------------------------------------------------

function QrDemoCard({ bookingCode }: { bookingCode: string }) {
  return (
    <div className="rounded-2xl border border-[#d9ecfb] bg-[#eef7ff] p-6 text-center">
      <div className="mx-auto grid h-28 w-28 place-items-center rounded-2xl bg-white shadow-[0_8px_24px_rgba(2,68,120,0.12)] text-[#0277d4]">
        <QrCode size={64} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-black text-[#071827]">Vé điện tử demo</h3>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">
        Mã đặt tour
      </p>
      <p className="mt-1 text-2xl font-black text-[#071827] tracking-wider">{bookingCode}</p>
      <p className="mt-3 text-xs leading-5 text-[#476273]">
        Vé QR demo — không có giá trị thật. Xuất trình mã này khi check-in (demo).
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page content
// ---------------------------------------------------------------------------

function SuccessContent({ code }: { code: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError("Thiếu mã đặt tour.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    bookingApi
      .getByCode(code)
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setBooking(res.data);
        } else {
          setError("Không tìm thấy booking. Vui lòng kiểm tra lại.");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Lỗi kết nối. Vui lòng thử lại.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  // Loading
  if (loading) {
    return (
      <PageShell eyebrow="Xác nhận đặt tour" title="Đang tải thông tin...">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#0277d4]" aria-hidden="true" />
        </div>
      </PageShell>
    );
  }

  // Error
  if (error || !booking) {
    return (
      <PageShell eyebrow="Xác nhận đặt tour" title="Không tìm thấy booking">
        <CommerceSurface>
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <AlertCircle size={40} className="text-red-400" aria-hidden="true" />
            <p className="text-lg font-black text-red-600">
              {error ?? "Không tìm thấy booking."}
            </p>
            <Link
              href="/my-bookings"
              className="rounded-2xl bg-[#0277d4] px-6 py-3 text-sm font-black text-white"
            >
              Xem lịch sử booking
            </Link>
          </div>
        </CommerceSurface>
      </PageShell>
    );
  }

  const isPaid = booking.paymentStatus?.toUpperCase() === "PAID";

  return (
    <PageShell eyebrow="Xác nhận đặt tour" title="Đặt tour thành công!">
      <div className="mb-6">
        <Stepper current={2} />
      </div>

      <DemoBanner />

      {/* Success hero */}
      <div className="mt-6 rounded-2xl border border-[#c3f0e0] bg-[#e7f8f5] p-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#0f8b7b] text-white">
          <BadgeCheck size={36} aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-black text-[#071827]">
          {isPaid ? "Thanh toán thành công!" : "Đặt tour thành công!"}
        </h2>
        <p className="mt-2 text-sm font-bold text-[#476273]">
          {isPaid
            ? "Booking của bạn đã được xác nhận. Kiểm tra email để nhận vé điện tử demo."
            : "Booking đã được tạo. Vui lòng hoàn tất thanh toán để xác nhận chỗ."}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left — booking details */}
        <div className="space-y-6">
          {/* Booking info */}
          <CommerceSurface>
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">
                Chi tiết đặt tour
              </p>
              <div className="flex gap-2">
                <StatusPill tone={bookingStatusTone(booking.status)}>
                  {bookingStatusLabel(booking.status)}
                </StatusPill>
                <StatusPill tone={paymentStatusTone(booking.paymentStatus)}>
                  {paymentStatusLabel(booking.paymentStatus)}
                </StatusPill>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {/* Tour name */}
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6f8594]">
                  Tour
                </p>
                <p className="mt-1 text-lg font-black text-[#071827]">
                  {booking.tour?.title ?? `Tour #${booking.tourId}`}
                </p>
                {booking.tour && (
                  <p className="mt-0.5 text-sm font-bold text-[#476273]">
                    {booking.tour.durationDays} ngày {booking.tour.durationNights} đêm
                  </p>
                )}
              </div>

              {/* Booking code */}
              <div className="flex items-center gap-3 rounded-xl bg-[#eef7ff] px-4 py-3">
                <Ticket size={18} className="text-[#0277d4]" aria-hidden="true" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6f8594]">
                    Mã đặt tour
                  </p>
                  <p className="font-black text-[#0277d4] tracking-wider">{booking.bookingCode}</p>
                </div>
              </div>

              {/* Date & guests */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-[#476273]">
                  <CalendarDays size={16} className="text-[#0277d4]" aria-hidden="true" />
                  <span>
                    Ngày đặt: <span className="font-black text-[#071827]">{formatDateVi(new Date(booking.bookingDate))}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#476273]">
                  <Users size={16} className="text-[#0277d4]" aria-hidden="true" />
                  <span>
                    Số khách: <span className="font-black text-[#071827]">{booking.numberOfGuests} người</span>
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div className="rounded-xl border border-[#d9ecfb] bg-[#f7fbff] p-4 space-y-1 text-sm">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6f8594] mb-2">
                  Thông tin liên hệ
                </p>
                <p className="font-bold text-[#071827]">{booking.contactName}</p>
                <p className="text-[#476273]">{booking.contactEmail}</p>
                <p className="text-[#476273]">{booking.contactPhone}</p>
              </div>

              {/* Guest list */}
              {booking.guests && booking.guests.length > 0 && (
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6f8594] mb-2">
                    Danh sách khách
                  </p>
                  <div className="space-y-2">
                    {booking.guests.map((guest, i) => (
                      <div
                        key={guest.id}
                        className="flex items-center gap-2 rounded-xl bg-[#f7fbff] px-3 py-2 text-sm"
                      >
                        <CheckCircle2 size={14} className="text-[#0f8b7b]" aria-hidden="true" />
                        <span className="font-bold text-[#071827]">
                          Khách {i + 1}: {guest.fullName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special request */}
              {booking.specialRequest && (
                <div className="rounded-xl border border-[#d9ecfb] bg-[#f7fbff] p-3 text-sm">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6f8594] mb-1">
                    Yêu cầu đặc biệt
                  </p>
                  <p className="text-[#476273]">{booking.specialRequest}</p>
                </div>
              )}
            </div>
          </CommerceSurface>

          {/* Payment info */}
          {booking.payment && (
            <CommerceSurface>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">
                Thông tin thanh toán
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#476273]">Nhà cung cấp</span>
                  <span className="font-black text-[#071827]">
                    {booking.payment.provider} (demo)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#476273]">Trạng thái</span>
                  <StatusPill tone={paymentStatusTone(booking.payment.status)}>
                    {paymentStatusLabel(booking.payment.status)}
                  </StatusPill>
                </div>
                {booking.payment.transactionCode && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#476273]">Mã giao dịch</span>
                    <span className="font-black text-[#071827] text-xs tracking-wider">
                      {booking.payment.transactionCode}
                    </span>
                  </div>
                )}
                {booking.payment.paidAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#476273]">Thời gian thanh toán</span>
                    <span className="font-black text-[#071827]">
                      {formatDateVi(new Date(booking.payment.paidAt))}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-[#edf4fa] pt-3">
                  <span className="font-black text-[#071827]">Tổng thanh toán</span>
                  <span className="text-xl font-black text-[#ff5f12]">
                    {formatVnd(booking.totalPrice)}
                  </span>
                </div>
              </div>
            </CommerceSurface>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/my-bookings"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#0277d4] bg-[#eef7ff] px-5 py-3 font-black text-[#0277d4] transition hover:bg-[#d9ecfb]"
            >
              <Ticket size={18} aria-hidden="true" />
              Xem lịch sử booking
            </Link>
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d9ecfb] bg-white px-5 py-3 font-black text-[#476273] transition hover:bg-[#f7fbff]"
            >
              <Home size={18} aria-hidden="true" />
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* Right — QR demo + summary */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <QrDemoCard bookingCode={booking.bookingCode} />

          {/* Price summary */}
          <CommerceSurface>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">
              Tóm tắt giá
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#476273]">{booking.numberOfGuests} khách</span>
                <span className="font-black text-[#071827]">{formatVnd(booking.totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#edf4fa] pt-2">
                <span className="font-black text-[#071827]">Tổng cộng</span>
                <span className="text-xl font-black text-[#ff5f12]">
                  {formatVnd(booking.totalPrice)}
                </span>
              </div>
            </div>
          </CommerceSurface>

          {/* Demo trust badge */}
          <div className="flex items-center justify-center gap-2 rounded-full bg-[#e7f8f5] px-4 py-3 text-sm font-black text-[#0f8b7b]">
            <ShieldCheck size={16} aria-hidden="true" />
            {demoPaymentWarning}
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Export with AuthGuard
// ---------------------------------------------------------------------------

function SuccessPageInner({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  return <SuccessContent code={code} />;
}

export default function BookingSuccessPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <AuthGuard>
      <SuccessPageInner params={params} />
    </AuthGuard>
  );
}
