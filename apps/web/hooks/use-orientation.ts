'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type OrientationType = 'portrait' | 'landscape';

export interface UseOrientationReturn {
  /** Current orientation: "portrait" or "landscape" */
  orientation: OrientationType;
  /** Screen angle in degrees (0, 90, 180, 270) */
  angle: number;
  /** Whether an orientation change is currently being processed */
  isTransitioning: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getOrientation(): OrientationType {
  if (typeof window === 'undefined') return 'portrait';

  // Use Screen Orientation API if available
  if (window.screen?.orientation) {
    const type = window.screen.orientation.type;
    return type.startsWith('landscape') ? 'landscape' : 'portrait';
  }

  // Fallback: use window dimensions
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

function getAngle(): number {
  if (typeof window === 'undefined') return 0;

  if (window.screen?.orientation) {
    return window.screen.orientation.angle;
  }

  // Fallback for older browsers
  return (window.orientation as number) || 0;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Custom hook that detects orientation changes and manages content reflow.
 *
 * - Detects orientation changes via the Screen Orientation API (with fallback)
 * - Signals a transitioning state for up to 500ms to allow content reflow
 * - Preserves user scroll position across orientation changes
 */
export function useOrientation(): UseOrientationReturn {
  const [orientation, setOrientation] = useState<OrientationType>(getOrientation);
  const [angle, setAngle] = useState<number>(getAngle);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scrollPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOrientationChange = useCallback(() => {
    // Save current scroll position before reflow
    scrollPositionRef.current = {
      x: window.scrollX,
      y: window.scrollY,
    };

    // Signal transition start
    setIsTransitioning(true);

    // Update orientation state
    setOrientation(getOrientation());
    setAngle(getAngle());

    // Clear any existing timer
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    // Allow 500ms for content reflow, then restore scroll and end transition
    transitionTimerRef.current = setTimeout(() => {
      // Restore scroll position
      window.scrollTo(scrollPositionRef.current.x, scrollPositionRef.current.y);
      setIsTransitioning(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use Screen Orientation API change event
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }

    // Also listen to resize as a fallback (covers orientation changes on
    // devices that don't fire the orientation event reliably)
    window.addEventListener('resize', handleOrientationChange);

    // Legacy orientationchange event for older mobile browsers
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, [handleOrientationChange]);

  return { orientation, angle, isTransitioning };
}
