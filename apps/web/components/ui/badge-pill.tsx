import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgePillVariant = 'trust' | 'demo-warning' | 'info';

export interface BadgePillProps {
  variant: BadgePillVariant;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const variantStyles: Record<BadgePillVariant, string> = {
  trust: 'bg-teal-trust text-white',
  'demo-warning': 'bg-orange-50 text-orange-700 border border-orange-200',
  info: 'bg-sky-surface text-booking-blue',
};

/**
 * Rounded-pill badge component for trust indicators, demo warnings, and info labels.
 * Uses Design DNA palette tokens configured in Tailwind.
 */
export function BadgePill({ variant, icon, label, className }: BadgePillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      <span className="flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </span>
  );
}
