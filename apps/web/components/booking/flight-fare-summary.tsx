'use client';

import { useLocale } from '@/lib/i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FlightFareSummaryProps {
  baseFare: number;
  taxes: number;
  passengers?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FlightFareSummary({ baseFare, taxes, passengers = 1 }: FlightFareSummaryProps) {
  const { t, fmt } = useLocale();

  const totalPerPassenger = baseFare + taxes;
  const grandTotal = totalPerPassenger * passengers;

  return (
    <div className="rounded-2xl border border-[#D9ECFB] bg-white p-5 shadow-[0_2px_12px_rgba(2,119,212,0.08)]">
      <h3 className="text-sm font-bold text-[#071827]">{t.flight.fareSummary}</h3>

      <div className="mt-4 space-y-3">
        {/* Base fare */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#476273]">{t.booking.baseFare}</span>
          <span className="font-medium text-[#071827]">{fmt.formatCurrency(baseFare)}</span>
        </div>

        {/* Taxes */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#476273]">{t.booking.taxes}</span>
          <span className="font-medium text-[#071827]">{fmt.formatCurrency(taxes)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#D9ECFB]" />

        {/* Total per passenger */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#476273]">{t.flight.pricePerPassenger}</span>
          <span className="font-semibold text-[#071827]">
            {fmt.formatCurrency(totalPerPassenger)}
          </span>
        </div>

        {/* Grand total */}
        {passengers > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#476273]">
              {t.booking.total} ({passengers} {t.booking.guests.toLowerCase()})
            </span>
            <span className="text-lg font-bold text-[#0277D4]">
              {fmt.formatCurrency(grandTotal)}
            </span>
          </div>
        )}

        {passengers === 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#476273]">{t.booking.total}</span>
            <span className="text-lg font-bold text-[#0277D4]">
              {fmt.formatCurrency(grandTotal)}
            </span>
          </div>
        )}
      </div>

      {/* Demo payment warning */}
      <div className="mt-4 rounded-lg bg-[#FFF7F0] border border-[#FFD5BD] px-3 py-2">
        <p className="text-xs font-medium text-[#C24F05]">{t.booking.demoPaymentNote}</p>
      </div>
    </div>
  );
}
