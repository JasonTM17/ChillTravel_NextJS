'use client';

import L from 'leaflet';
import Link from 'next/link';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SovereigntyInfoPanel from '@/components/map/sovereignty-info-panel';
import SovereigntyLegend from '@/components/map/sovereignty-legend';
import SovereigntyOverlay from '@/components/map/sovereignty-overlay';
import type { Locale } from '@/lib/i18n/types';

// ─── Custom marker icons ─────────────────────────────────────────────────────
const destinationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ─── Types ───────────────────────────────────────────────────────────────────
interface MapMarker {
  slug: string;
  name: string;
  position: [number, number];
  country: string;
}

interface MapViewProps {
  markers: MapMarker[];
  locale?: Locale;
}

export default function MapView({ markers, locale = 'vi' }: MapViewProps) {
  const [infoPanelExpanded, setInfoPanelExpanded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(6);

  // Always center on Vietnam to show sovereignty
  const center: [number, number] = [14.5, 108.5];
  const zoom = 6;

  // Legend visible at zoom 4-10
  const legendVisible = currentZoom >= 4 && currentZoom <= 10;

  return (
    <div className="relative h-full w-full" style={{ minHeight: 550 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={true}
        style={{ height: '100%', minHeight: 550, width: '100%' }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        {/* CartoDB Voyager tiles — international labels, clean style */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Sovereignty overlay with full archipelago rendering */}
        <SovereigntyOverlay locale={locale} />

        {/* Zoom tracker for legend visibility */}
        <ZoomTracker onZoomChange={setCurrentZoom} />

        {/* ── Destination markers ──────────────────────────────────────────── */}
        {markers.map((marker) => (
          <Marker key={marker.slug} position={marker.position} icon={destinationIcon}>
            <Popup>
              <div className="text-center min-w-[140px]">
                <p className="font-bold text-sm">{marker.name}</p>
                <p className="text-xs text-gray-500">{marker.country}</p>
                <Link
                  href={`/destinations/${marker.slug}`}
                  className="mt-2 inline-block rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Xem chi tiết →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Sovereignty legend (positioned outside MapContainer for proper layering) */}
      <SovereigntyLegend locale={locale} visible={legendVisible} />

      {/* Sovereignty info panel */}
      <SovereigntyInfoPanel
        locale={locale}
        expanded={infoPanelExpanded}
        onToggle={() => setInfoPanelExpanded(!infoPanelExpanded)}
      />
    </div>
  );
}

/* ─── Zoom Tracker (internal helper) ──────────────────────────────────────── */

function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  useMapEvents({
    zoomend: (e) => {
      onZoomChange(e.target.getZoom());
    },
  });
  return null;
}
