'use client';

import { ArrowLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BookingConfirmation } from './booking-confirmation';
import { BookingStepper, type BookingStep } from './booking-stepper';
import { MockPayment, type PaymentFormData } from './mock-payment';
import { OrderSummary, type OrderItem } from './order-summary';

const STEP_ORDER: BookingStep[] = ['select', 'details', 'payment', 'confirmation'];

export interface BookingFormData {
  /** Selected service/tour/hotel */
  serviceName: string;
  /** Departure or check-in date */
  departureDate: string;
  /** Number of guests */
  guests: number;
  /** Line items for order summary */
  items: OrderItem[];
  /** Total price */
  total: number;
  /** Any additional details from the details step */
  details: Record<string, string>;
}

interface BookingFlowProps {
  /** Initial form data (e.g., from service selection) */
  initialData?: Partial<BookingFormData>;
  /** Render prop for the "select" step content */
  renderSelectStep?: (props: {
    data: BookingFormData;
    onUpdate: (updates: Partial<BookingFormData>) => void;
    onNext: () => void;
  }) => React.ReactNode;
  /** Render prop for the "details" step content */
  renderDetailsStep?: (props: {
    data: BookingFormData;
    onUpdate: (updates: Partial<BookingFormData>) => void;
    onNext: () => void;
  }) => React.ReactNode;
  /** Called when user returns to home */
  onBackToHome?: () => void;
  className?: string;
}

const DEFAULT_FORM_DATA: BookingFormData = {
  serviceName: '',
  departureDate: '',
  guests: 1,
  items: [],
  total: 0,
  details: {},
};

const DEFAULT_PAYMENT_DATA: PaymentFormData = {
  method: 'credit-card',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

/**
 * Booking flow orchestrator.
 * Manages step state (select → details → payment → confirmation),
 * preserves form data across steps, and handles back/forward navigation.
 */
export function BookingFlow({
  initialData,
  renderSelectStep,
  renderDetailsStep,
  onBackToHome,
  className,
}: BookingFlowProps) {
  const { t } = useLocale();
  const [currentStep, setCurrentStep] = useState<BookingStep>('select');
  const [formData, setFormData] = useState<BookingFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });
  const [paymentData, setPaymentData] = useState<PaymentFormData>(DEFAULT_PAYMENT_DATA);
  const [referenceCode, setReferenceCode] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  const updateFormData = useCallback((updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updatePaymentData = useCallback((updates: Partial<PaymentFormData>) => {
    setPaymentData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    const nextStep = STEP_ORDER[nextIndex];
    if (nextIndex < STEP_ORDER.length && nextStep) {
      setCurrentStep(nextStep);
    }
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    const prevIndex = currentIndex - 1;
    const prevStep = STEP_ORDER[prevIndex];
    if (prevIndex >= 0 && prevStep) {
      setCurrentStep(prevStep);
    }
  }, [currentIndex]);

  const handlePaymentSuccess = useCallback((ref: string) => {
    setReferenceCode(ref);
    setPaymentStatus('success');
    setCurrentStep('confirmation');
  }, []);

  const handlePaymentFailure = useCallback(() => {
    setPaymentStatus('failed');
    setCurrentStep('confirmation');
  }, []);

  const handleRetry = useCallback(() => {
    setPaymentStatus(null);
    setCurrentStep('payment');
  }, []);

  const handleBackToHome = useCallback(() => {
    if (onBackToHome) {
      onBackToHome();
    }
  }, [onBackToHome]);

  return (
    <div className={cn('w-full max-w-6xl mx-auto', className)}>
      {/* Stepper */}
      <BookingStepper currentStep={currentStep} className="mb-8" />

      {/* Main content area */}
      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-6">
        <div className="min-w-0">
          {/* Back button (not shown on first step or confirmation) */}
          {currentIndex > 0 && currentStep !== 'confirmation' && (
            <button
              type="button"
              onClick={goToPrevious}
              className="flex items-center gap-1.5 text-sm font-medium text-booking-blue hover:underline mb-4"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              {t.common.back}
            </button>
          )}

          {/* Step content */}
          {currentStep === 'select' && (
            <div>
              {renderSelectStep ? (
                renderSelectStep({
                  data: formData,
                  onUpdate: updateFormData,
                  onNext: goToNext,
                })
              ) : (
                <DefaultSelectStep data={formData} onUpdate={updateFormData} onNext={goToNext} />
              )}
            </div>
          )}

          {currentStep === 'details' && (
            <div>
              {renderDetailsStep ? (
                renderDetailsStep({
                  data: formData,
                  onUpdate: updateFormData,
                  onNext: goToNext,
                })
              ) : (
                <DefaultDetailsStep data={formData} onUpdate={updateFormData} onNext={goToNext} />
              )}
            </div>
          )}

          {currentStep === 'payment' && (
            <MockPayment
              initialData={paymentData}
              onDataChange={updatePaymentData}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          )}

          {currentStep === 'confirmation' && (
            <BookingConfirmation
              status={paymentStatus === 'failed' ? 'failed' : 'success'}
              referenceCode={referenceCode}
              serviceName={formData.serviceName}
              departureDate={formData.departureDate}
              guests={formData.guests}
              totalPaid={formData.total}
              onRetry={handleRetry}
              onBackToHome={handleBackToHome}
            />
          )}
        </div>

        {/* Order summary sidebar (visible on non-confirmation steps) */}
        {currentStep !== 'confirmation' && (
          <OrderSummary
            serviceName={formData.serviceName}
            dates={formData.departureDate}
            guests={formData.guests}
            items={formData.items}
            total={formData.total}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Default step placeholders ──────────────────────────────────────────────── */

function DefaultSelectStep({
  data,
  onUpdate: _onUpdate,
  onNext,
}: {
  data: BookingFormData;
  onUpdate: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
}) {
  const { t } = useLocale();

  return (
    <div className="rounded-tv border border-border bg-white p-5 space-y-4">
      <h3 className="text-tv-md font-bold text-ink">{t.booking.stepSelect}</h3>
      <p className="text-sm text-muted-ink">
        Chọn dịch vụ, ngày và số khách để tiếp tục.
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={!data.serviceName}
        className={cn(
          'rounded-tv px-5 py-2.5 text-sm font-bold text-white transition-colors',
          data.serviceName
            ? 'bg-orange-cta hover:bg-orange-cta/90'
            : 'bg-gray-300 cursor-not-allowed',
        )}
      >
        {t.common.confirm}
      </button>
    </div>
  );
}

function DefaultDetailsStep({
  data: _data,
  onUpdate: _onUpdate,
  onNext,
}: {
  data: BookingFormData;
  onUpdate: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
}) {
  const { t } = useLocale();

  return (
    <div className="rounded-tv border border-border bg-white p-5 space-y-4">
      <h3 className="text-tv-md font-bold text-ink">{t.booking.stepDetails}</h3>
      <p className="text-sm text-muted-ink">Điền thông tin hành khách để tiến hành thanh toán.</p>
      <button
        type="button"
        onClick={onNext}
        className="rounded-tv bg-orange-cta px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-cta/90 transition-colors"
      >
        {t.common.confirm}
      </button>
    </div>
  );
}
