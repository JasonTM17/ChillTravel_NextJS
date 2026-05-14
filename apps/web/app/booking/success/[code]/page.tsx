'use client';

/**
 * Mock Payment page — /booking/payment
 * Req 12, 45 | Design §7
 *
 * URL params: bookingId
 * Flow: show booking summary → select payment method → click "Thanh toán demo"
 *       → POST /payments/mock-checkout → POST /payments/mock-callback → navigate to /booking/success/[code]
 */

import {
  AlertCircle,
  Building2,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Landmark,
  Loader2,
  LockKeyhole,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Users,
  WalletCards,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { CommerceSurface, StatusPill } from '@/components/commerce-primitives';
import { PageShell } from '@/components/page-shell';
import { bookingApi, type Booking } from '@/lib/api/booking.api';
import { paymentApi } from '@/lib/api/payment.api';
import { formatVnd } from '@/lib/utils';
import { demoPaymentWarning, formatDateVi } from '@/lib/vietnamese';

// ---------------------------------------------------------------------------
// Payment methods
// ---------------------------------------------------------------------------

interface PaymentMethod {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'MOCK_CARD',
    label: 'Thẻ demo',
    description: 'Token giả lập — không nhập số thẻ thật',
    icon: CreditCard,
  },
  {
    id: 'MOCK_MOMO',
    label: 'MoMo demo',
    description: 'Ví điện tử local/mô phỏng',
    icon: Smartphone,
  },
  {
    id: 'MOCK_VNPAY',
    label: 'VNPay demo',
    description: 'Cổng thanh toán thử nghiệm giả lập',
    icon: WalletCards,
  },
  {
    id: 'MOCK_ZALOPAY',
    label: 'ZaloPay demo',
    description: 'Không gọi nhà cung cấp thật',
    icon: QrCode,
  },
  {
    id: 'MOCK_BANK',
    label: 'Chuyển khoản demo',
    description: 'Không tạo giao dịch ngân hàng',
    icon: Building2,
  },
  {
    id: 'MOCK_CASH',
    label: 'Tiền mặt khi đến',
    description: 'Trạng thái xác nhận mẫu',
    icon: Landmark,
  },
];

// ---------------------------------------------------------------------------
// Demo banner
// ---------------------------------------------------------------------------

function DemoBanner() {
  return (
    <div className="rounded-tv border border-[#f0b3ad] bg-[#ffe4e1] p-4 text-[#9f1239]">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 shrink-0" size={22} aria-hidden="true" />
        <div>
          <p className="text-lg font-bold">{demoPaymentWarning}</p>
          <p className="mt-1 text-sm font-bold text-[#9f1239]/80">
            Mọi nhà cung cấp trong trang này là local/mô phỏng/thử nghiệm. Không phát sinh giao dịch
            thật, không lưu số thẻ.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------

const STEPS = ['Thông tin đặt tour', 'Thanh toán demo', 'Xác nhận'] as const;

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
                  ? 'bg-tv-blue text-white ring-4 ring-[#b8ddff]'
                  : done
                    ? 'bg-[#0f8b7b] text-white'
                    : 'bg-tv-border text-[#8b99a7]'
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`hidden font-bold sm:inline ${
                active ? 'text-tv-blue' : done ? 'text-[#0f8b7b]' : 'text-[#8b99a7]'
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
// Booking summary card
// ---------------------------------------------------------------------------

function BookingSummaryCard({ booking }: { booking: Booking }) {
  return (
    <CommerceSurface>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">Tóm tắt đặt tour</p>
      <div className="mt-4 space-y-3">
        <div>
          <p className="font-bold text-tv-ink">
            {booking.tour?.title ?? `Tour #${booking.tourId}`}
          </p>
          <p className="mt-1 text-sm font-bold text-tv-ink-3">
            Mã đặt tour: <span className="font-bold text-tv-blue">{booking.bookingCode}</span>
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-tv-ink-3">
            <CalendarDays size={14} className="text-tv-blue" aria-hidden="true" />
            <span>Ngày đặt: {formatDateVi(new Date(booking.bookingDate))}</span>
          </div>
          <div className="flex items-center gap-2 text-tv-ink-3">
            <Users size={14} className="text-tv-blue" aria-hidden="true" />
            <span>{booking.numberOfGuests} khách</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusPill tone="orange">Chờ thanh toán</StatusPill>
        </div>

        <div className="border-t border-tv-border pt-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-tv-ink">Tổng thanh toán</span>
            <span className="text-xl font-bold text-tv-orange">
              {formatVnd(booking.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </CommerceSurface>
  );
}

// ---------------------------------------------------------------------------
// Main page content
// ---------------------------------------------------------------------------

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get('bookingId') ?? '';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [selectedMethod, setSelectedMethod] = useState<string>('MOCK_CARD');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Fetch booking by ID — we use bookingCode from the booking object
  useEffect(() => {
    if (!bookingId) {
      setBookingError('Thiếu thông tin booking. Vui lòng quay lại.');
      setBookingLoading(false);
      return;
    }

    let cancelled = false;
    setBookingLoading(true);

    // bookingId here is the booking's database id; we need to find it
    // The API getByCode accepts bookingCode, but we have the id from the create response.
    // We'll use listMine and find by id, or use getByCode if we stored the code.
    // Since we navigate with bookingId (the DB id), we need to list and find.
    bookingApi
      .listMine({ page: 0, size: 50 })
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          const found = res.data.items.find((b) => b.id === bookingId);
          if (found) {
            setBooking(found);
          } else {
            setBookingError('Không tìm thấy booking. Vui lòng kiểm tra lại.');
          }
        } else {
          setBookingError('Không thể tải thông tin booking.');
        }
      })
      .catch(() => {
        if (!cancelled) setBookingError('Lỗi kết nối. Vui lòng thử lại.');
      })
      .finally(() => {
        if (!cancelled) setBookingLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  async function handlePay() {
    if (!booking) return;
    setPaying(true);
    setPayError(null);

    try {
      // Step 1: mock-checkout — pass bookingCode
      const checkoutRes = await paymentApi.mockCheckout(booking.bookingCode);
      if (!checkoutRes.success) {
        setPayError(
          (checkoutRes as { message?: string }).message ?? 'Khởi tạo thanh toán thất bại.',
        );
        setPaying(false);
        return;
      }

      const { transactionCode, bookingCode } = checkoutRes.data;

      // Step 2: mock-callback with SUCCESS
      const callbackRes = await paymentApi.mockCallback({
        transactionCode,
        status: 'SUCCESS',
      });

      if (!callbackRes.success) {
        setPayError(
          (callbackRes as { message?: string }).message ?? 'Xác nhận thanh toán thất bại.',
        );
        setPaying(false);
        return;
      }

      // Step 3: navigate to success page
      const code = callbackRes.data.bookingCode ?? bookingCode;
      router.push(`/booking/success/${code}`);
    } catch {
      setPayError('Lỗi kết nối. Vui lòng thử lại.');
      setPaying(false);
    }
  }

  // Loading
  if (bookingLoading) {
    return (
      <PageShell eyebrow="Thanh toán" title="Đang tải thông tin...">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-tv-blue" aria-hidden="true" />
        </div>
      </PageShell>
    );
  }

  // Error
  if (bookingError || !booking) {
    return (
      <PageShell eyebrow="Thanh toán" title="Không tìm thấy booking">
        <CommerceSurface>
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <AlertCircle size={40} className="text-red-400" aria-hidden="true" />
            <p className="text-lg font-bold text-red-600">
              {bookingError ?? 'Không tìm thấy booking.'}
            </p>
            <Link
              href="/my-bookings"
              className="rounded-tv bg-tv-blue px-6 py-3 text-sm font-bold text-white"
            >
              Xem lịch sử booking
            </Link>
          </div>
        </CommerceSurface>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Thanh toán demo" title="Xác nhận thanh toán">
      <div className="mb-6">
        <Stepper current={1} />
      </div>

      <DemoBanner />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left — payment method selector */}
        <div className="space-y-6">
          <CommerceSurface>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
                <p className="mt-1 text-sm text-tv-ink-3">
                  Chọn phương thức demo. Không nhập số thẻ thật.
                </p>
              </div>
              <span className="inline-flex rounded-full bg-[#e7f8f5] px-3 py-1 text-xs font-bold text-[#0f8b7b]">
                Local / mô phỏng / thử nghiệm
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {PAYMENT_METHODS.map(({ id, label, description, icon: Icon }) => {
                const active = selectedMethod === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedMethod(id)}
                    className={`flex items-center gap-3 rounded-tv border p-4 text-left transition ${
                      active
                        ? 'border-tv-blue bg-tv-blue-light ring-2 ring-tv-blue/10'
                        : 'border-tv-border bg-white hover:border-tv-blue hover:bg-tv-bg'
                    }`}
                    aria-pressed={active}
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        active ? 'border-tv-blue bg-tv-blue' : 'border-[#8b99a7]'
                      }`}
                    >
                      {active && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                    <Icon
                      size={24}
                      className={active ? 'text-tv-blue' : 'text-tv-ink-3'}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block font-bold">{label}</span>
                      <span className="mt-0.5 block text-sm text-tv-ink-3">{description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </CommerceSurface>

          {/* Pay error */}
          {payError && (
            <div className="rounded-tv border border-red-200 bg-red-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-red-600">
                <AlertCircle size={16} aria-hidden="true" />
                {payError}
              </p>
            </div>
          )}
        </div>

        {/* Right — summary + CTA */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <BookingSummaryCard booking={booking} />

          {/* Pay button */}
          <CommerceSurface>
            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="inline-flex w-full items-center justify-center gap-2 rounded-tv bg-tv-orange px-4 py-4 font-bold text-white shadow-tv-card transition hover:bg-tv-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Đang xử lý thanh toán...
                </>
              ) : (
                <>
                  <LockKeyhole size={18} aria-hidden="true" />
                  Thanh toán demo
                  <ChevronRight size={18} aria-hidden="true" />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#e7f8f5] px-3 py-2 text-sm font-bold text-[#0f8b7b]">
              <ShieldCheck size={16} aria-hidden="true" />
              {demoPaymentWarning}
            </div>

            {paying && (
              <p className="mt-3 text-center text-xs font-bold text-tv-ink-3">
                Đang mô phỏng giao dịch... Vui lòng không đóng trang.
              </p>
            )}
          </CommerceSurface>

          {/* QR preview */}
          <div className="rounded-tv border border-tv-border bg-tv-blue-light p-5 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-tv bg-white text-tv-blue">
              <QrCode size={48} aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-base font-bold">Vé QR demo</h3>
            <p className="mt-1 text-xs leading-5 text-tv-ink-3">
              Vé điện tử demo sẽ được tạo sau khi xác nhận thanh toán.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Export with AuthGuard + Suspense
// ---------------------------------------------------------------------------

function PaymentFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tv-blue" />
    </div>
  );
}

export default function BookingPaymentPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<PaymentFallback />}>
        <PaymentContent />
      </Suspense>
    </AuthGuard>
  );
}
