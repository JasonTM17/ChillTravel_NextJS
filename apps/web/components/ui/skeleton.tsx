import * as React from 'react';
import { cn } from '@/lib/utils';

/* ─── Base Skeleton ──────────────────────────────────────────────────────────── */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width in px or CSS value (e.g. "100%", "200px") */
  width?: string | number;
  /** Height in px or CSS value */
  height?: string | number;
  /** Border-radius override: "full" for circle, or a CSS value */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
}

/**
 * Base skeleton placeholder with shimmer animation.
 * Cycles background from #E0E0E0 to #F5F5F5 over ~1.8s.
 */
export function Skeleton({ className, width, height, rounded, style, ...props }: SkeletonProps) {
  const roundedClass = rounded
    ? ({
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      }[rounded] ?? '')
    : '';

  return (
    <div
      className={cn('tv-skeleton', roundedClass, className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...(rounded && !['sm', 'md', 'lg', 'xl', 'full'].includes(rounded)
          ? { borderRadius: rounded }
          : {}),
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

/* ─── SkeletonText ───────────────────────────────────────────────────────────── */

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of the text line (default "100%") */
  width?: string | number;
  /** Number of text lines to render (default 1) */
  lines?: number;
  /** Gap between lines in px (default 8) */
  gap?: number;
}

/**
 * Single or multi-line text placeholder.
 * Last line is rendered at 75% width for a natural look.
 */
export function SkeletonText({
  className,
  width = '100%',
  lines = 1,
  gap = 8,
  ...props
}: SkeletonTextProps) {
  if (lines === 1) {
    return <Skeleton className={cn('h-4', className)} width={width} rounded="sm" {...props} />;
  }

  return (
    <div
      className={cn('flex flex-col', className)}
      style={{ gap: `${gap}px` }}
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4" width={i === lines - 1 ? '75%' : width} rounded="sm" />
      ))}
    </div>
  );
}

/* ─── SkeletonImage ──────────────────────────────────────────────────────────── */

export interface SkeletonImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width (default "100%") */
  width?: string | number;
  /** Height (default "auto") */
  height?: string | number;
  /** Aspect ratio as "w/h" string, e.g. "16/9", "4/3", "1/1" (default "16/9") */
  aspectRatio?: string;
}

/**
 * Rectangular image placeholder with configurable aspect ratio.
 */
export function SkeletonImage({
  className,
  width = '100%',
  height,
  aspectRatio = '16/9',
  ...props
}: SkeletonImageProps) {
  return (
    <Skeleton
      className={cn('w-full', className)}
      width={width}
      height={height}
      rounded="md"
      style={{
        aspectRatio: height ? undefined : aspectRatio,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      {...props}
    />
  );
}

/* ─── SkeletonAvatar ─────────────────────────────────────────────────────────── */

export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Diameter in px (default 40) */
  size?: number;
}

/**
 * Circular avatar placeholder.
 */
export function SkeletonAvatar({ className, size = 40, ...props }: SkeletonAvatarProps) {
  return <Skeleton className={className} width={size} height={size} rounded="full" {...props} />;
}

/* ─── SkeletonCard ───────────────────────────────────────────────────────────── */

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to show the image area (default true) */
  showImage?: boolean;
  /** Image aspect ratio (default "16/9") */
  imageAspectRatio?: string;
  /** Number of text lines below the image (default 3) */
  textLines?: number;
}

/**
 * Card-shaped placeholder with image area + text lines.
 * Matches the expected dimensions of listing/booking cards.
 */
export function SkeletonCard({
  className,
  showImage = true,
  imageAspectRatio = '16/9',
  textLines = 3,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-tv-border bg-tv-surface p-0',
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      {showImage && <SkeletonImage aspectRatio={imageAspectRatio} className="rounded-none" />}
      <div className="flex flex-col gap-3 p-4">
        {/* Title line */}
        <Skeleton className="h-5 w-3/4" rounded="sm" />
        {/* Body text lines */}
        <SkeletonText lines={textLines} width="100%" />
        {/* Price / CTA area */}
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-6 w-24" rounded="sm" />
          <Skeleton className="h-9 w-20" rounded="md" />
        </div>
      </div>
    </div>
  );
}
