'use client';

import { Check } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export type BookingStep = 'select' | 'details' | 'payment' | 'confirmation';

const STEPS: BookingStep[] = ['select', 'details', 'payment', 'confirmation'];

interface BookingStepperProps {
  currentStep: BookingStep;
  className?: string;
}

/**
 * Multi-step progress indicator for the booking flow.
 * Horizontal on desktop, compact on mobile.
 * Highlights current step in booking blue, completed steps with green checkmark.
 */
export function BookingStepper({ currentStep, className }: BookingStepperProps) {
  const { t } = useLocale();

  const stepLabels: Record<BookingStep, string> = {
    select: t.booking.stepSelect,
    details: t.booking.stepDetails,
    payment: t.booking.stepPayment,
    confirmation: t.booking.stepConfirmation,
  };

  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <nav aria-label="Booking progress" className={cn('w-full', className)}>
      {/* Desktop: horizontal stepper */}
      <ol className="hidden sm:flex items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5 w-full">
                <div className="flex items-center w-full">
                  {/* Step circle */}
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors',
                      isCompleted && 'border-emerald-500 bg-emerald-500 text-white',
                      isCurrent && 'border-booking-blue bg-booking-blue text-white',
                      !isCompleted && !isCurrent && 'border-border bg-white text-muted-ink',
                    )}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Connector line */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'h-0.5 flex-1 mx-2 transition-colors',
                        index < currentIndex ? 'bg-emerald-500' : 'bg-border',
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    'text-xs font-medium text-center whitespace-nowrap',
                    isCurrent && 'text-booking-blue font-bold',
                    isCompleted && 'text-emerald-600',
                    !isCompleted && !isCurrent && 'text-muted-ink',
                  )}
                >
                  {stepLabels[step]}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Mobile: compact stepper */}
      <div className="flex sm:hidden items-center justify-between gap-1 px-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  isCompleted && 'bg-emerald-500 text-white',
                  isCurrent && 'bg-booking-blue text-white',
                  !isCompleted && !isCurrent && 'bg-gray-200 text-muted-ink',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check size={12} aria-hidden="true" /> : <span>{index + 1}</span>}
              </div>
              <span
                className={cn(
                  'text-[10px] text-center leading-tight',
                  isCurrent && 'text-booking-blue font-bold',
                  isCompleted && 'text-emerald-600',
                  !isCompleted && !isCurrent && 'text-muted-ink',
                )}
              >
                {stepLabels[step]}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
