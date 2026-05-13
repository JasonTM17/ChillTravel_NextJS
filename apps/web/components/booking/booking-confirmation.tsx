'use client';

import { CheckCircle2, XCircle, Home, RotateCcw } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface BookingConfirmationProps {
  status: 'success' | 'failed';
  referenceCode?: string;
  serviceName: string;
  departureDate?: string;
  guests?: number;
  totalPaid?: number;
  onRetry?: () => void;
  onBackToHome?: () => void;
  className?: string;
}

/**
 * Booking confirmation page component.
 * Shows success state with reference code and booking details,
 * or failed state with error message and retry option.
 */
export function BookingConfirmation({
  status,
  referenceCode,
  serviceName,
  departureDate,
  guests,
  totalPaid,
  onRetry,
  onBackToHome,
  className,
}: BookingConfirmationProps) {
  const { t, fmt } = useLocale();

  if (status === 'failed') {
    return (
      <div className={cn('flex flex-col items-center text-center py-10 px-4', className)}>
        {/* Error icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-5">
          <XCircle size={36} className="text-red-500" aria-hidden="true" />
        </div>

        <h2 className="text-xl font-bold text-ink mb-2">{t.booking.paymentFailed}</h2>
        <p className="text-sm text-muted-ink mb-6 max-w-sm">{t.errors.paymentFailed}</p>

        {/* Retry button */}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 rounded-tv bg-orange-cta px-6 py-3 text-sm font-bold text-white hover:bg-orange-cta/90 transition-colors"
          >
            <RotateCcw size={16} aria-hidden="true" />
            {t.booking.retryPayment}
          </button>
        )}

        {/* Back to home */}
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="mt-3 flex items-center gap-2 text-sm font-medium text-booking-blue hover:underline"
          >
            <Home size={14} aria-hidden="true" />
            {t.booking.backToHome}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center text-center py-10 px-4', className)}>
      {/* Success animation/icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-5 animate-[scale-in_0.3s_ease-out]">
        <CheckCircle2 size={36} className="text-emerald-500" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold text-ink mb-1">{t.status.confirmed}</h2>
      <p className="text-sm text-muted-ink mb-6">{t.booking.demoPaymentNote}</p>

      {/* Booking details card */}
      <div className="w-full max-w-md rounded-tv border border-border bg-white shadow-card p-5 text-left space-y-3">
        {/* Reference code */}
        {referenceCode && (
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-ink">
              {t.booking.bookingReference}
            </span>
            <span className="font-mono text-sm font-bold text-booking-blue">{referenceCode}</span>
          </div>
        )}

        <hr className="border-border" />

        {/* Service name */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-ink">Dịch vụ</span>
          <span className="text-sm font-semibold text-ink">{serviceName}</span>
        </div>

        {/* Departure date */}
        {departureDate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-ink">{t.booking.departure}</span>
            <span className="text-sm text-ink">{departureDate}</span>
          </div>
        )}

        {/* Guests */}
        {guests != null && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-ink">{t.booking.guests}</span>
            <span className="text-sm text-ink">{guests}</span>
          </div>
        )}

        {/* Total paid */}
        {totalPaid != null && (
          <>
            <hr className="border-border" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-ink">{t.booking.total}</span>
              <span className="text-base font-bold text-booking-blue">
                {fmt.formatCurrency(totalPaid)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Back to home button */}
      {onBackToHome && (
        <button
          type="button"
          onClick={onBackToHome}
          className="mt-6 flex items-center gap-2 rounded-tv bg-booking-blue px-6 py-3 text-sm font-bold text-white hover:bg-deep-blue transition-colors"
        >
          <Home size={16} aria-hidden="true" />
          {t.booking.backToHome}
        </button>
      )}
    </div>
  );
}
