"use client";

/**
 * Booking Form page — /booking/new
 * Req 10, 12, 35, 45 | Design §7
 *
 * URL params: tourId, departureId?, guests?, coupon?
 * Flow: fill form → POST /bookings → navigate to /booking/payment?bookingId=xxx
 */

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  ChevronRight,
  Loader2,
  Mail,
  Minus,
  Phone,
  Plus,
  ShieldAlert,
  Tag,
  User,
  Users,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/lib/auth/auth-context";
import { tourApi, type Tour, type TourDeparture } from "@/lib/api/tour.api";
import { bookingApi, type CreateBookingGuestRequest } from "@/lib/api/booking.api";
import { CommerceSurface, StatusPill } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning, formatDateVi } from "@/lib/vietnamese";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GuestForm {
  fullName: string;
  gender: string;
  dateOfBirth: string;
}

// ---------------------------------------------------------------------------
// Demo banner
// ---------------------------------------------------------------------------

function DemoBanner() {
  return (
    <div className="rounded-tv border border-[#f0b3ad] bg-[#ffe4e1] p-4 text-[#9f1239]">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
        <div>
          <p className="font-bold">{demoPaymentWarning}</p>
          <p className="mt-1 text-sm font-bold text-[#9f1239]/80">
            Không nhập thông tin thẻ thật. Mọi giao dịch là mô phỏng.
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
              className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active
                  ? "bg-[tv-blue] text-white ring-4 ring-[#b8ddff]"
                  : done
                  ? "bg-[#0f8b7b] text-white"
                  : "bg-[tv-border] text-[#8b99a7]"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`hidden font-bold sm:inline ${
                active ? "text-[tv-blue]" : done ? "text-[#0f8b7b]" : "text-[#8b99a7]"
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
// Guest row
// ---------------------------------------------------------------------------

function GuestRow({
  index,
  guest,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  guest: GuestForm;
  onChange: (field: keyof GuestForm, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-tv border border-[tv-border] bg-[tv-bg] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-[tv-blue]">Khách {index + 1}</p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
          >
            Xóa
          </button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="sm:col-span-3">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]">
            Họ và tên *
          </span>
          <input
            type="text"
            value={guest.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            required
            className="w-full rounded-tv-sm border border-[#c8d5e3] bg-white px-3 py-2.5 text-sm font-bold text-[tv-ink] outline-none focus:border-[tv-blue] focus:ring-2 focus:ring-[tv-blue]/15"
            placeholder="Nguyễn Văn A"
          />
        </label>
        <label>
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]">
            Giới tính
          </span>
          <select
            value={guest.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className="w-full rounded-tv-sm border border-[#c8d5e3] bg-white px-3 py-2.5 text-sm font-bold text-[tv-ink] outline-none focus:border-[tv-blue]"
          >
            <option value="">-- Chọn --</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]">
            Ngày sinh
          </span>
          <input
            type="date"
            value={guest.dateOfBirth}
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
            className="w-full rounded-tv-sm border border-[#c8d5e3] bg-white px-3 py-2.5 text-sm font-bold text-[tv-ink] outline-none focus:border-[tv-blue]"
          />
        </label>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page content
// ---------------------------------------------------------------------------

function BookingNewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const tourId = searchParams.get("tourId") ?? "";
  const departureId = searchParams.get("departureId") ?? "";
  const initialGuests = parseInt(searchParams.get("guests") ?? "1", 10);
  const initialCoupon = searchParams.get("coupon") ?? "";

  // Tour data
  const [tour, setTour] = useState<Tour | null>(null);
  const [tourLoading, setTourLoading] = useState(true);
  const [tourError, setTourError] = useState<string | null>(null);

  // Contact info
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  // Guests
  const [guests, setGuests] = useState<GuestForm[]>(() =>
    Array.from({ length: Math.max(1, initialGuests) }, () => ({
      fullName: "",
      gender: "",
      dateOfBirth: "",
    }))
  );

  // Coupon
  const [couponCode, setCouponCode] = useState(initialCoupon.toUpperCase());
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setContactName(user.fullName ?? "");
      setContactEmail(user.email ?? "");
      setContactPhone(user.phone ?? "");
    }
  }, [user]);

  // Fetch tour
  useEffect(() => {
    if (!tourId) {
      setTourError("Thiếu thông tin tour. Vui lòng quay lại trang tour.");
      setTourLoading(false);
      return;
    }

    let cancelled = false;
    setTourLoading(true);

    // tourId may be an id or slug — try getBySlug first (slug is more common from URL)
    tourApi
      .getBySlug(tourId)
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setTour(res.data as Tour);
        } else {
          setTourError("Không tìm thấy tour. Vui lòng quay lại.");
        }
      })
      .catch(() => {
        if (!cancelled) setTourError("Lỗi kết nối. Vui lòng thử lại.");
      })
      .finally(() => {
        if (!cancelled) setTourLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tourId]);

  // Derived values
  const selectedDeparture: TourDeparture | undefined = tour?.departures?.find(
    (d) => d.id === departureId
  );
  const displayPrice = tour
    ? (selectedDeparture?.priceOverride ?? tour.salePrice ?? tour.basePrice)
    : 0;
  const guestCount = guests.length;
  const subtotal = displayPrice * guestCount;
  // Coupon discount is applied server-side; show 0 until confirmed
  const discount = couponApplied ? 0 : 0; // server calculates actual discount
  const total = subtotal - discount;

  // Guest helpers
  const addGuest = useCallback(() => {
    if (!tour || guests.length >= tour.maxGuests) return;
    setGuests((prev) => [...prev, { fullName: "", gender: "", dateOfBirth: "" }]);
  }, [tour, guests.length]);

  const removeGuest = useCallback((index: number) => {
    setGuests((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateGuest = useCallback(
    (index: number, field: keyof GuestForm, value: string) => {
      setGuests((prev) =>
        prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
      );
    },
    []
  );

  function handleApplyCoupon() {
    if (!couponCode.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá.");
      return;
    }
    // Coupon validation happens server-side on submit
    setCouponApplied(true);
    setCouponError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tour) return;

    // Basic validation
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setSubmitError("Vui lòng điền đầy đủ thông tin liên hệ.");
      return;
    }
    if (guests.some((g) => !g.fullName.trim())) {
      setSubmitError("Vui lòng điền họ tên cho tất cả khách.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const guestPayload: CreateBookingGuestRequest[] = guests.map((g) => ({
      fullName: g.fullName.trim(),
      gender: g.gender || undefined,
      dateOfBirth: g.dateOfBirth || undefined,
    }));

    try {
      const res = await bookingApi.create({
        tourId: tour.id,
        departureId: departureId || undefined,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        numberOfGuests: guestCount,
        specialRequest: specialRequest.trim() || undefined,
        couponCode: couponApplied && couponCode ? couponCode : undefined,
        guests: guestPayload,
      });

      if (res.success) {
        const booking = res.data;
        router.push(`/booking/payment?bookingId=${booking.id}`);
      } else {
        setSubmitError(
          (res as { message?: string }).message ?? "Đặt tour thất bại. Vui lòng thử lại."
        );
      }
    } catch {
      setSubmitError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  // Loading state
  if (tourLoading) {
    return (
      <PageShell eyebrow="Đặt tour" title="Đang tải thông tin tour...">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[tv-blue]" aria-hidden="true" />
        </div>
      </PageShell>
    );
  }

  // Error state
  if (tourError || !tour) {
    return (
      <PageShell eyebrow="Đặt tour" title="Không tìm thấy tour">
        <CommerceSurface>
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <AlertCircle size={40} className="text-red-400" aria-hidden="true" />
            <p className="text-lg font-bold text-red-600">
              {tourError ?? "Không tìm thấy tour."}
            </p>
            <Link
              href="/tours"
              className="rounded-tv bg-[tv-blue] px-6 py-3 text-sm font-bold text-white"
            >
              Quay lại danh sách tour
            </Link>
          </div>
        </CommerceSurface>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Đặt tour" title={`Đặt tour: ${tour.title}`}>
      <div className="mb-6">
        <Stepper current={0} />
      </div>

      <DemoBanner />

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left column — form sections */}
          <div className="space-y-6">
            {/* Contact info */}
            <CommerceSurface>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <User size={20} className="text-[tv-blue]" aria-hidden="true" />
                Thông tin liên hệ
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]">
                    <User size={12} aria-hidden="true" />
                    Họ và tên *
                  </span>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full rounded-tv-sm border border-[#c8d5e3] bg-[tv-bg] px-4 py-3 font-bold text-[tv-ink] outline-none transition focus:border-[tv-blue] focus:ring-2 focus:ring-[tv-blue]/15"
                    placeholder="Nguyễn Văn A"
                  />
                </label>
                <label>
                  <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]">
                    <Mail size={12} aria-hidden="true" />
                    Email *
                  </span>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full rounded-tv-sm border border-[#c8d5e3] bg-[tv-bg] px-4 py-3 font-bold text-[tv-ink] outline-none transition focus:border-[tv-blue] focus:ring-2 focus:ring-[tv-blue]/15"
                    placeholder="email@example.com"
                  />
                </label>
                <label>
                  <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]">
                    <Phone size={12} aria-hidden="true" />
                    Số điện thoại *
                  </span>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full rounded-tv-sm border border-[#c8d5e3] bg-[tv-bg] px-4 py-3 font-bold text-[tv-ink] outline-none transition focus:border-[tv-blue] focus:ring-2 focus:ring-[tv-blue]/15"
                    placeholder="0901234567"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]">
                    Yêu cầu đặc biệt
                  </span>
                  <textarea
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    rows={3}
                    className="w-full rounded-tv-sm border border-[#c8d5e3] bg-[tv-bg] px-4 py-3 font-bold text-[tv-ink] outline-none transition focus:border-[tv-blue] focus:ring-2 focus:ring-[tv-blue]/15"
                    placeholder="Ăn chay, dị ứng thực phẩm, yêu cầu đặc biệt..."
                  />
                </label>
              </div>
            </CommerceSurface>

            {/* Guest list */}
            <CommerceSurface>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Users size={20} className="text-[tv-blue]" aria-hidden="true" />
                  Danh sách khách ({guestCount} người)
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeGuest(guests.length - 1)}
                    disabled={guests.length <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-tv-sm border border-[tv-border] bg-white font-bold text-[tv-blue] hover:bg-[tv-blue-light] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Giảm số khách"
                  >
                    <Minus size={14} aria-hidden="true" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{guestCount}</span>
                  <button
                    type="button"
                    onClick={addGuest}
                    disabled={!tour || guests.length >= tour.maxGuests}
                    className="flex h-8 w-8 items-center justify-center rounded-tv-sm border border-[tv-border] bg-white font-bold text-[tv-blue] hover:bg-[tv-blue-light] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Thêm khách"
                  >
                    <Plus size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {guests.map((guest, i) => (
                  <GuestRow
                    key={i}
                    index={i}
                    guest={guest}
                    onChange={(field, value) => updateGuest(i, field, value)}
                    onRemove={() => removeGuest(i)}
                    canRemove={guests.length > 1}
                  />
                ))}
              </div>
            </CommerceSurface>

            {/* Coupon */}
            <CommerceSurface>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Tag size={20} className="text-[tv-blue]" aria-hidden="true" />
                Mã giảm giá
              </h2>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponApplied(false);
                    setCouponError(null);
                  }}
                  className="flex-1 rounded-tv-sm border border-[#c8d5e3] bg-[tv-bg] px-4 py-3 font-bold text-[tv-ink] outline-none transition focus:border-[tv-blue] focus:ring-2 focus:ring-[tv-blue]/15"
                  placeholder="Nhập mã giảm giá..."
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-tv-sm border border-[tv-blue] bg-[tv-blue-light] px-4 py-3 text-sm font-bold text-[tv-blue] hover:bg-[tv-border]"
                >
                  Áp dụng
                </button>
              </div>
              {couponApplied && (
                <p className="mt-2 text-sm font-bold text-[#0f8b7b]">
                  ✓ Mã giảm giá sẽ được áp dụng khi xác nhận đặt tour.
                </p>
              )}
              {couponError && (
                <p className="mt-2 text-sm font-bold text-red-600">{couponError}</p>
              )}
            </CommerceSurface>

            {/* Submit error */}
            {submitError && (
              <div className="rounded-tv border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-red-600">
                  <AlertCircle size={16} aria-hidden="true" />
                  {submitError}
                </p>
              </div>
            )}
          </div>

          {/* Right column — order summary */}
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <CommerceSurface>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-blue]">
                Tóm tắt đơn hàng
              </p>

              {/* Tour info */}
              <div className="mt-4 space-y-2">
                <p className="font-bold text-[tv-ink]">{tour.title}</p>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone="blue">
                    {tour.durationDays} ngày {tour.durationNights} đêm
                  </StatusPill>
                  {tour.destination && (
                    <StatusPill tone="gray">{tour.destination.city ?? tour.destination.name}</StatusPill>
                  )}
                </div>
              </div>

              {/* Departure */}
              {selectedDeparture && (
                <div className="mt-4 flex items-center gap-2 rounded-tv-sm bg-[tv-blue-light] px-3 py-2 text-sm">
                  <CalendarDays size={14} className="text-[tv-blue]" aria-hidden="true" />
                  <span className="font-bold text-[tv-ink]">
                    {formatDateVi(new Date(selectedDeparture.departureDate))}
                  </span>
                </div>
              )}

              {/* Price breakdown */}
              <div className="mt-5 space-y-2 border-t border-[tv-border] pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[tv-ink-3]">
                    {formatVnd(displayPrice)} × {guestCount} khách
                  </span>
                  <span className="font-bold text-[tv-ink]">{formatVnd(subtotal)}</span>
                </div>
                {couponApplied && couponCode && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#0f8b7b]">Mã: {couponCode}</span>
                    <span className="font-bold text-[#0f8b7b]">Áp dụng khi xác nhận</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-[tv-border] pt-2">
                  <span className="font-bold text-[tv-ink]">Tổng cộng</span>
                  <span className="text-xl font-bold text-[tv-orange]">{formatVnd(total)}</span>
                </div>
                <p className="text-xs font-bold text-[tv-ink-3]">
                  * Giá cuối cùng sẽ được xác nhận sau khi áp mã giảm giá.
                </p>
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-tv bg-[tv-orange] px-4 py-4 font-bold text-white shadow-tv-card transition hover:bg-[tv-orange-dark] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Tiếp tục thanh toán
                    <ChevronRight size={18} aria-hidden="true" />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs font-bold text-[#9a3412]">
                {demoPaymentWarning}
              </p>
            </CommerceSurface>

            {/* Back link */}
            <Link
              href={`/tours/${tour.slug}`}
              className="block text-center text-sm font-bold text-[tv-blue] hover:underline"
            >
              ← Quay lại trang tour
            </Link>
          </aside>
        </div>
      </form>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Export with AuthGuard + Suspense
// ---------------------------------------------------------------------------

function BookingNewFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[tv-blue]" />
    </div>
  );
}

export default function BookingNewPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<BookingNewFallback />}>
        <BookingNewContent />
      </Suspense>
    </AuthGuard>
  );
}
