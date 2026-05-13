'use client';

/**
 * Sovereignty Overlay Component
 *
 * Renders dashed circular boundaries, persistent text labels, individual
 * island markers, and clickable archipelago center markers with sovereignty
 * popups for Hoang Sa and Truong Sa archipelagos on the Leaflet map.
 * Visibility is controlled by zoom level per archipelago configuration.
 *
 * Requirements: 4.2, 4.3, 4.4, 4.5, 5.2, 5.3, 5.4, 5.5, 5.6
 */

import L from 'leaflet';
import { useState, useEffect } from 'react';
import { Circle, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import type { Locale } from '@/lib/i18n/types';
import {
  HOANG_SA_CONFIG,
  TRUONG_SA_CONFIG,
  type ArchipelagoConfig,
  type IslandMarker,
} from './sovereignty-data';

// ─── Props ───────────────────────────────────────────────────────────────────

interface SovereigntyOverlayProps {
  locale: Locale;
}

// ─── Custom Icons ────────────────────────────────────────────────────────────

/** Red pin icon for individual island markers */
const islandPinIcon = new L.DivIcon({
  html: `<div style="display:flex;align-items:center;justify-content:center;">
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z" fill="#dc2626"/>
      <circle cx="8" cy="8" r="3" fill="#fff"/>
    </svg>
  </div>`,
  iconSize: [16, 20],
  iconAnchor: [8, 20],
  className: '',
});

/** Invisible icon used for archipelago label markers */
const labelIcon = new L.DivIcon({
  html: '',
  iconSize: [0, 0],
  iconAnchor: [0, 0],
  className: '',
});

/** Larger red pin icon for clickable archipelago center markers */
const archipelagoPinIcon = new L.DivIcon({
  html: `<div style="display:flex;align-items:center;justify-content:center;cursor:pointer;">
    <svg width="24" height="30" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z" fill="#dc2626"/>
      <circle cx="8" cy="8" r="3" fill="#fff"/>
    </svg>
  </div>`,
  iconSize: [24, 30],
  iconAnchor: [12, 30],
  className: '',
});

// ─── Sovereignty Statement Translations ──────────────────────────────────────

/** Localized sovereignty statement for popup display */
const SOVEREIGNTY_STATEMENTS: Record<Locale, string> = {
  vi: 'Chủ quyền Việt Nam',
  en: 'Vietnamese Sovereignty',
  ja: 'ベトナム主権',
};

// ─── Helper: Get localized island name ───────────────────────────────────────

function getLocalizedName(island: IslandMarker, locale: Locale): string {
  switch (locale) {
    case 'en':
      return island.nameEn;
    case 'ja':
      return island.nameJa;
    case 'vi':
    default:
      return island.nameVi;
  }
}

// ─── Archipelago Boundary Component ──────────────────────────────────────────

interface ArchipelagoBoundaryProps {
  config: ArchipelagoConfig;
  locale: Locale;
  currentZoom: number;
  label: string;
  nameVi: string;
  nameEn: string;
  maxPopupWidth?: number;
}

function ArchipelagoBoundary({
  config,
  locale,
  currentZoom,
  label,
  nameVi,
  nameEn,
  maxPopupWidth = 250,
}: ArchipelagoBoundaryProps) {
  const [minLabelZoom, maxLabelZoom] = config.labelVisibleZoomRange;
  const showLabel = currentZoom >= minLabelZoom && currentZoom <= maxLabelZoom;
  const showIslands = currentZoom >= config.islandVisibleMinZoom;
  const sovereigntyStatement = SOVEREIGNTY_STATEMENTS[locale];

  return (
    <>
      {/* Dashed circular boundary */}
      <Circle
        center={config.center}
        radius={config.radiusKm * 1000} // Convert km to meters
        pathOptions={{
          color: '#dc2626',
          fillColor: '#dc2626',
          fillOpacity: 0.2,
          weight: 2,
          dashArray: '8,6',
        }}
      />

      {/* Clickable archipelago center marker with sovereignty popup */}
      <Marker position={config.center} icon={archipelagoPinIcon}>
        <Popup
          maxWidth={maxPopupWidth}
          closeButton={true}
          closeOnClick={true}
          className="sovereignty-popup"
        >
          <div className="text-center p-1">
            <p className="font-bold text-red-700 text-base mb-1">{nameVi}</p>
            <p className="text-gray-600 text-sm mb-1">{nameEn}</p>
            <p className="font-semibold text-red-600 text-sm mb-1">{sovereigntyStatement}</p>
            <p className="text-xl" aria-label="Vietnamese flag">
              🇻🇳
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Persistent text label (visible at configured zoom range) */}
      {showLabel && (
        <Marker position={config.center} icon={labelIcon} interactive={false}>
          <Tooltip direction="center" permanent className="sovereignty-label-tooltip">
            <span className="font-bold text-red-700 text-sm">{label}</span>
          </Tooltip>
        </Marker>
      )}

      {/* Individual island markers (visible at configured min zoom) */}
      {showIslands &&
        config.islands.map((island) => (
          <Marker key={island.id} position={island.coordinates} icon={islandPinIcon}>
            <Tooltip direction="top" offset={[0, -20]}>
              <div className="text-center">
                <p className="font-semibold text-xs text-red-700">{island.nameVi}</p>
                {locale !== 'vi' && (
                  <p className="text-xs text-gray-600">{getLocalizedName(island, locale)}</p>
                )}
              </div>
            </Tooltip>
          </Marker>
        ))}
    </>
  );
}

// ─── Main Sovereignty Overlay Component ──────────────────────────────────────

export default function SovereigntyOverlay({ locale }: SovereigntyOverlayProps) {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(map.getZoom());

  // Track zoom level changes
  useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
    },
  });

  // Sync zoom on mount
  useEffect(() => {
    setZoom(map.getZoom());
  }, [map]);

  return (
    <>
      {/* Hoang Sa (Paracel Islands) */}
      <ArchipelagoBoundary
        config={HOANG_SA_CONFIG}
        locale={locale}
        currentZoom={zoom}
        label="Hoàng Sa"
        nameVi="Quần đảo Hoàng Sa"
        nameEn="Paracel Islands"
      />

      {/* Truong Sa (Spratly Islands) */}
      <ArchipelagoBoundary
        config={TRUONG_SA_CONFIG}
        locale={locale}
        currentZoom={zoom}
        label="Trường Sa"
        nameVi="Quần đảo Trường Sa"
        nameEn="Spratly Islands"
        maxPopupWidth={300}
      />
    </>
  );
}
