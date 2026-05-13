'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export interface OrderItem {
  label: string;
  amount: number;
}

interface OrderSummaryProps {
  serviceName: string;
  dates?: string;
  guests?: number;
  items: OrderItem[];
  total: number;
  className?: string;
}

/**
 * Order summary component.
 * Desktop (≥1024px): sticky sidebar with full breakdown.
 * Mobile (<1024px): collapsible bottom sheet — collapsed shows total (56px bar),
 * expanded shows max 85% viewport. Toggled by tapping or vertical drag.
 */
export function OrderSummary({
  serviceName,
  dates,
  guests,
  items,
  total,
  className,
}: OrderSummaryProps) {
  const { t, fmt } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current === null) return;
      const endY = e.changedTouches[0]?.clientY;
      if (endY === undefined) return;
      const deltaY = endY - touchStartY.current;
      // Swipe up (negative delta) → expand; swipe down (positive delta) → collapse
      if (deltaY < -30 && !expanded) {
        setExpanded(true);
      } else if (deltaY > 30 && expanded) {
        setExpanded(false);
      }
      touchStartY.current = null;
    },
    [expanded],
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside
        className={cn(
          'hidden lg:block sticky top-24 rounded-tv bg-white border border-border shadow-card p-5',
          className,
        )}
      >
        <h3 className="text-tv-md font-bold text-ink mb-4">{t.booking.orderSummary}</h3>

        <div className="space-y-2 mb-4">
          <p className="text-sm font-semibold text-ink">{serviceName}</p>
          {dates && (
            <p className="text-xs text-muted-ink">
              {t.booking.departure}: {dates}
            </p>
          )}
          {guests != null && (
            <p className="text-xs text-muted-ink">
              {t.booking.guests}: {guests}
            </p>
          )}
        </div>

        <hr className="border-border mb-4" />

        {/* Price breakdown */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-ink">
            {t.booking.priceBreakdown}
          </p>
          {items.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-muted-ink">{item.label}</span>
              <span className="text-ink">{fmt.formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>

        <hr className="border-border mb-4" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-ink">{t.booking.total}</span>
          <span className="text-lg font-bold text-booking-blue">{fmt.formatCurrency(total)}</span>
        </div>
      </aside>

      {/* Mobile: collapsible bottom sheet */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50">
        {/* Backdrop when expanded */}
        {expanded && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setExpanded(false)}
            aria-hidden="true"
          />
        )}

        <div
          className={cn(
            'relative z-50 bg-white border-t border-border rounded-t-tv-xl shadow-tv-modal transition-all duration-300 ease-in-out',
            expanded ? 'max-h-[85vh] overflow-y-auto' : 'h-14',
          )}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Collapsed bar */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full h-14 px-4"
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse order summary' : 'Expand order summary'}
          >
            <span className="text-sm font-bold text-ink">{t.booking.total}</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-booking-blue">
                {fmt.formatCurrency(total)}
              </span>
              {expanded ? (
                <ChevronDown size={18} className="text-muted-ink" />
              ) : (
                <ChevronUp size={18} className="text-muted-ink" />
              )}
            </div>
          </button>

          {/* Expanded content */}
          {expanded && (
            <div className="px-4 pb-6 pt-2 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-ink">{serviceName}</p>
                {dates && (
                  <p className="text-xs text-muted-ink">
                    {t.booking.departure}: {dates}
                  </p>
                )}
                {guests != null && (
                  <p className="text-xs text-muted-ink">
                    {t.booking.guests}: {guests}
                  </p>
                )}
              </div>

              <hr className="border-border" />

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-ink">
                  {t.booking.priceBreakdown}
                </p>
                {items.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-ink">{item.label}</span>
                    <span className="text-ink">{fmt.formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-border" />

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-ink">{t.booking.total}</span>
                <span className="text-lg font-bold text-booking-blue">
                  {fmt.formatCurrency(total)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
