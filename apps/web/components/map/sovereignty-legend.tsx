'use client';

/**
 * Sovereignty Legend Panel
 *
 * Renders a legend in the bottom-left corner of the map explaining the
 * sovereignty marker symbols, dashed boundary style, and red color indicator.
 * Visible only at zoom levels 4-10 (where sovereignty markers are displayed).
 *
 * Requirements: 6.1
 */

import type { Locale } from '@/lib/i18n/types';

// ─── Props ───────────────────────────────────────────────────────────────────

interface SovereigntyLegendProps {
  locale: Locale;
  visible: boolean;
}

// ─── Localized Labels ────────────────────────────────────────────────────────

const LEGEND_LABELS: Record<Locale, { title: string; marker: string; boundary: string }> = {
  vi: {
    title: 'Chủ quyền Việt Nam',
    marker: 'Đảo Việt Nam',
    boundary: 'Ranh giới chủ quyền',
  },
  en: {
    title: 'Vietnamese Sovereignty',
    marker: 'Vietnamese Island',
    boundary: 'Sovereignty boundary',
  },
  ja: {
    title: 'ベトナム主権',
    marker: 'ベトナムの島',
    boundary: '主権境界',
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function SovereigntyLegend({ locale, visible }: SovereigntyLegendProps) {
  if (!visible) {
    return null;
  }

  const labels = LEGEND_LABELS[locale] || LEGEND_LABELS.vi;

  return (
    <div
      className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-md px-3 py-2.5 pointer-events-auto"
      style={{ minWidth: 160 }}
      role="region"
      aria-label={labels.title}
    >
      {/* Title */}
      <p className="text-xs font-bold text-red-700 mb-2">{labels.title}</p>

      {/* Island marker legend item */}
      <div className="flex items-center gap-2 mb-1.5">
        <svg
          width="12"
          height="16"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z"
            fill="#dc2626"
          />
          <circle cx="8" cy="8" r="3" fill="#fff" />
        </svg>
        <span className="text-xs text-gray-700">{labels.marker}</span>
      </div>

      {/* Dashed boundary legend item */}
      <div className="flex items-center gap-2">
        <svg
          width="24"
          height="8"
          viewBox="0 0 24 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="4"
            x2="24"
            y2="4"
            stroke="#dc2626"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        </svg>
        <span className="text-xs text-gray-700">{labels.boundary}</span>
      </div>
    </div>
  );
}
