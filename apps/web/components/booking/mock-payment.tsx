'use client';

import { ShieldCheck, CreditCard, Building2, Wallet } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type PaymentMethod = 'credit-card' | 'bank-transfer' | 'e-wallet';

export interface PaymentFormData {
  method: PaymentMethod;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface MockPaymentProps {
  /** Previously entered payment data (restored on back/forward navigation) */
  initialData?: PaymentFormData;
  /** Called when payment form data changes (for state preservation) */
  onDataChange?: (data: Partial<PaymentFormData>) => void;
  onSuccess: (referenceCode: string) => void;
  onFailure: () => void;
  className?: string;
}

/**
 * Generates a booking reference code: WV-YYYYMMDD-XXXXXX
 */
function generateReferenceCode(): string {
  const now = new Date();
  const dateStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }

  return `WV-${dateStr}-${random}`;
}

/**
 * Mock payment step with demo warning banner, payment method selection,
 * and fake credit card form. Never processes real transactions.
 * Accepts initialData to restore previously entered values on back/forward navigation.
 */
export function MockPayment({ initialData, onDataChange, onSuccess, onFailure, className }: MockPaymentProps) {
  const { t } = useLocale();
  const [method, setMethod] = useState<PaymentMethod>(initialData?.method ?? 'credit-card');
  const [cardNumber, setCardNumber] = useState(initialData?.cardNumber ?? '');
  const [expiry, setExpiry] = useState(initialData?.expiry ?? '');
  const [cvv, setCvv] = useState(initialData?.cvv ?? '');
  const [processing, setProcessing] = useState(false);

  // Report data changes to parent for preservation
  const reportChange = useCallback(
    (updates: Partial<PaymentFormData>) => {
      onDataChange?.(updates);
    },
    [onDataChange],
  );

  const handleMethodChange = useCallback(
    (m: PaymentMethod) => {
      setMethod(m);
      reportChange({ method: m });
    },
    [reportChange],
  );

  const handleCardNumberChange = useCallback(
    (value: string) => {
      setCardNumber(value);
      reportChange({ cardNumber: value });
    },
    [reportChange],
  );

  const handleExpiryChange = useCallback(
    (value: string) => {
      setExpiry(value);
      reportChange({ expiry: value });
    },
    [reportChange],
  );

  const handleCvvChange = useCallback(
    (value: string) => {
      setCvv(value);
      reportChange({ cvv: value });
    },
    [reportChange],
  );

  const handleConfirmPayment = () => {
    setProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setProcessing(false);
      // 90% success rate for demo purposes
      if (Math.random() > 0.1) {
        const ref = generateReferenceCode();
        onSuccess(ref);
      } else {
        onFailure();
      }
    }, 1500);
  };

  const methods: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
    { id: 'credit-card', label: t.booking.creditCard, icon: CreditCard },
    { id: 'bank-transfer', label: t.booking.bankTransfer, icon: Building2 },
    { id: 'e-wallet', label: t.booking.eWallet, icon: Wallet },
  ];

  return (
    <div className={cn('space-y-5', className)}>
      {/* Demo payment warning banner */}
      <div className="rounded-tv border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 shrink-0 text-amber-600" size={18} aria-hidden="true" />
          <div>
            <p className="font-bold text-amber-800">{t.booking.demoPaymentNote}</p>
            <p className="mt-1 text-sm text-amber-700">{t.booking.paymentWarning}</p>
          </div>
        </div>
      </div>

      {/* Payment method selection */}
      <div className="space-y-3">
        {methods.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleMethodChange(id)}
            className={cn(
              'flex items-center gap-3 w-full rounded-tv border p-4 text-left transition-colors',
              method === id
                ? 'border-booking-blue bg-sky-surface'
                : 'border-border bg-white hover:border-booking-blue/50',
            )}
          >
            <Icon
              size={20}
              className={cn(method === id ? 'text-booking-blue' : 'text-muted-ink')}
              aria-hidden="true"
            />
            <span
              className={cn(
                'text-sm font-medium flex-1',
                method === id ? 'text-booking-blue font-bold' : 'text-ink',
              )}
            >
              {label}
            </span>
            {/* DEMO badge */}
            <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-cta">
              DEMO
            </span>
          </button>
        ))}
      </div>

      {/* Credit card form (shown when credit-card selected) */}
      {method === 'credit-card' && (
        <div className="rounded-tv border border-border bg-white p-4 space-y-4">
          <div>
            <label htmlFor="card-number" className="block text-xs font-bold text-muted-ink mb-1.5">
              Số thẻ
            </label>
            <input
              id="card-number"
              type="text"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              className="w-full rounded-tv-sm border border-border px-3 py-2.5 text-sm text-ink placeholder:text-muted-ink/60 focus:border-booking-blue focus:outline-none focus:ring-1 focus:ring-booking-blue"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="card-expiry"
                className="block text-xs font-bold text-muted-ink mb-1.5"
              >
                Hết hạn
              </label>
              <input
                id="card-expiry"
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full rounded-tv-sm border border-border px-3 py-2.5 text-sm text-ink placeholder:text-muted-ink/60 focus:border-booking-blue focus:outline-none focus:ring-1 focus:ring-booking-blue"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="card-cvv" className="block text-xs font-bold text-muted-ink mb-1.5">
                CVV
              </label>
              <input
                id="card-cvv"
                type="text"
                placeholder="123"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full rounded-tv-sm border border-border px-3 py-2.5 text-sm text-ink placeholder:text-muted-ink/60 focus:border-booking-blue focus:outline-none focus:ring-1 focus:ring-booking-blue"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bank transfer info */}
      {method === 'bank-transfer' && (
        <div className="rounded-tv border border-border bg-white p-4">
          <p className="text-sm text-muted-ink">
            Chuyển khoản demo — không phát sinh giao dịch thật.
          </p>
          <div className="mt-3 rounded-tv-sm bg-sky-surface p-3 text-xs text-ink space-y-1">
            <p>
              <span className="font-bold">Bank:</span> Demo Bank Vietnam
            </p>
            <p>
              <span className="font-bold">Account:</span> 0000-1234-5678-9999
            </p>
            <p>
              <span className="font-bold">Name:</span> WANDERVIET DEMO
            </p>
          </div>
        </div>
      )}

      {/* E-wallet info */}
      {method === 'e-wallet' && (
        <div className="rounded-tv border border-border bg-white p-4">
          <p className="text-sm text-muted-ink">Ví điện tử demo — chọn để mô phỏng thanh toán.</p>
          <div className="mt-3 flex gap-3">
            {['MoMo', 'ZaloPay', 'VNPay'].map((wallet) => (
              <div
                key={wallet}
                className="flex-1 rounded-tv-sm border border-border bg-sky-surface p-3 text-center text-xs font-bold text-ink"
              >
                {wallet}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm payment button */}
      <button
        type="button"
        onClick={handleConfirmPayment}
        disabled={processing}
        className={cn(
          'w-full rounded-tv py-3 px-6 text-sm font-bold text-white transition-colors',
          processing
            ? 'bg-orange-cta/60 cursor-not-allowed'
            : 'bg-orange-cta hover:bg-orange-cta/90 active:bg-orange-cta/80',
        )}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Đang xử lý...
          </span>
        ) : (
          t.booking.confirmPayment
        )}
      </button>
    </div>
  );
}
