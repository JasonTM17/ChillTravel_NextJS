import * as React from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'booking' | 'comparison' | 'listing';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant controlling border-radius and shadow intensity */
  variant?: CardVariant;
  /** Optional click handler — adds cursor-pointer when provided */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'rounded-tv-lg shadow-card',
  booking: 'rounded-tv-xl shadow-card-lg',
  comparison: 'rounded-tv-lg shadow-card-sm',
  listing: 'rounded-tv-lg shadow-card hover:shadow-card-lg transition-shadow duration-200',
};

/**
 * Shared card component with Traveloka-style blue-tinted shadows.
 *
 * Variants:
 * - `default`    — 12px radius, medium shadow
 * - `booking`    — 16px radius, large shadow (booking surfaces)
 * - `comparison` — 12px radius, subtle shadow (comparison grids)
 * - `listing`    — 12px radius, medium shadow with hover elevation
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', onClick, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-white', variantStyles[variant], onClick && 'cursor-pointer', className)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
