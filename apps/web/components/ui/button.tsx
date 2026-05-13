import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-sunset text-white hover:bg-orange-600',
    secondary: 'bg-teal text-white hover:bg-teal/90',
    ghost: 'bg-white/10 text-white hover:bg-white/20',
  };
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold transition',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
