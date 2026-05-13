'use client';

import { Search, X } from 'lucide-react';
import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useLocale } from '@/lib/i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MobileSearchOverlayProps {
  /** The search form content to render inside the overlay */
  children: ReactNode;
  /** Summary text shown in the collapsed bar */
  summary?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MobileSearchOverlay({ children, summary }: MobileSearchOverlayProps) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Restore focus after close animation
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 300);
  }, []);

  // ─── Trap focus inside overlay when open ─────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  // ─── Focus the close button when overlay opens ───────────────────────

  useEffect(() => {
    if (isOpen && overlayRef.current) {
      const closeBtn = overlayRef.current.querySelector<HTMLButtonElement>('[data-close-btn]');
      closeBtn?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* ── Collapsed Search Bar (mobile only) ──────────────────────────── */}
      <button
        type="button"
        onClick={open}
        className="flex min-h-[44px] w-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-2.5 shadow-sm transition-shadow hover:shadow-md md:hidden"
        aria-label={t.common.search}
      >
        <Search size={18} className="shrink-0 text-booking-blue" aria-hidden="true" />
        <span className="truncate text-sm text-muted-ink">{summary || t.common.search}</span>
      </button>

      {/* ── Full-screen Overlay ─────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.common.search}
        className={`fixed inset-0 z-[100] flex flex-col bg-white transition-all duration-300 md:hidden ${
          isOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-full opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-ink">{t.common.search}</h2>
          <button
            type="button"
            data-close-btn
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-sky-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-booking-blue"
            aria-label={t.common.close}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}
