'use client';

/**
 * Sovereignty Information Panel
 *
 * A collapsible panel displaying historical context about Vietnamese sovereignty
 * over Hoang Sa and Truong Sa archipelagos. Collapsed by default, expands on click
 * to show full historical context in the active locale.
 *
 * Positioned top-right to avoid overlap with the legend panel (bottom-left).
 *
 * Requirements: 6.2, 6.3, 6.5
 */

import type { Locale } from '@/lib/i18n/types';

// ─── Props ───────────────────────────────────────────────────────────────────

interface SovereigntyInfoPanelProps {
  locale: Locale;
  expanded: boolean;
  onToggle: () => void;
}

// ─── Localized Content ───────────────────────────────────────────────────────

interface InfoPanelContent {
  title: string;
  hoangSaName: string;
  truongSaName: string;
  sovereigntyStatement: string;
  historicalAdmin: string;
  coordinates: string;
  expand: string;
  collapse: string;
}

const INFO_CONTENT: Record<Locale, InfoPanelContent> = {
  vi: {
    title: 'Thông tin chủ quyền',
    hoangSaName: 'Quần đảo Hoàng Sa',
    truongSaName: 'Quần đảo Trường Sa',
    sovereigntyStatement:
      'Quần đảo Hoàng Sa và Trường Sa là lãnh thổ không thể tách rời của Việt Nam',
    historicalAdmin:
      'Việt Nam đã thực thi chủ quyền liên tục đối với quần đảo Hoàng Sa và Trường Sa từ thế kỷ 17, với các bằng chứng lịch sử về quản lý hành chính qua nhiều triều đại.',
    coordinates: 'Tọa độ',
    expand: 'Mở rộng',
    collapse: 'Thu gọn',
  },
  en: {
    title: 'Sovereignty information',
    hoangSaName: 'Hoang Sa Archipelago (Paracel Islands)',
    truongSaName: 'Truong Sa Archipelago (Spratly Islands)',
    sovereigntyStatement:
      'The Hoang Sa and Truong Sa archipelagos are inseparable territories of Vietnam',
    historicalAdmin:
      'Vietnam has continuously exercised sovereignty over the Hoang Sa and Truong Sa archipelagos since the 17th century, with historical evidence of administrative governance across multiple dynasties.',
    coordinates: 'Coordinates',
    expand: 'Expand',
    collapse: 'Collapse',
  },
  ja: {
    title: '主権情報',
    hoangSaName: 'ホアンサ諸島（パラセル諸島）',
    truongSaName: 'チュオンサ諸島（スプラトリー諸島）',
    sovereigntyStatement: 'ホアンサ諸島とチュオンサ諸島はベトナムの不可分の領土です',
    historicalAdmin:
      'ベトナムは17世紀以来、ホアンサ諸島とチュオンサ諸島に対する主権を継続的に行使してきました。複数の王朝にわたる行政管理の歴史的証拠があります。',
    coordinates: '座標',
    expand: '展開',
    collapse: '折りたたむ',
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function SovereigntyInfoPanel({
  locale,
  expanded,
  onToggle,
}: SovereigntyInfoPanelProps) {
  const content = INFO_CONTENT[locale] || INFO_CONTENT.vi;

  return (
    <div
      className="absolute top-4 right-4 z-[1000] pointer-events-auto"
      style={{ maxWidth: 320 }}
      role="region"
      aria-label={content.title}
    >
      {/* Collapsed / Header button */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 bg-white rounded-lg shadow-md px-3 py-2 w-full text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-expanded={expanded}
        aria-controls="sovereignty-info-content"
      >
        <span className="text-base" aria-hidden="true">
          ℹ️
        </span>
        <span className="text-xs font-semibold text-gray-800 flex-1">{content.title}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            d="M2 4.5L6 8.5L10 4.5"
            stroke="#476273"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          id="sovereignty-info-content"
          className="bg-white rounded-lg shadow-md mt-1 px-3 py-3 text-xs"
        >
          {/* Sovereignty statement */}
          <p className="text-red-700 font-semibold mb-3 leading-relaxed">
            🇻🇳 {content.sovereigntyStatement}
          </p>

          {/* Hoang Sa */}
          <div className="mb-2.5">
            <p className="font-bold text-gray-800 mb-0.5">{content.hoangSaName}</p>
            <p className="text-gray-500">{content.coordinates}: 16.5°N, 112.0°E</p>
          </div>

          {/* Truong Sa */}
          <div className="mb-3">
            <p className="font-bold text-gray-800 mb-0.5">{content.truongSaName}</p>
            <p className="text-gray-500">{content.coordinates}: 8.65°N, 111.92°E</p>
          </div>

          {/* Historical administration */}
          <div className="border-t border-gray-200 pt-2">
            <p className="text-gray-600 leading-relaxed">{content.historicalAdmin}</p>
          </div>
        </div>
      )}
    </div>
  );
}
