"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// ─── Custom marker icons ─────────────────────────────────────────────────────
const destinationIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Red marker for sovereignty markers (Hoang Sa, Truong Sa)
const sovereigntyIcon = new L.DivIcon({
  html: `<div style="background:#dc2626;width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  className: "",
});

// ─── Vietnam sovereignty markers ─────────────────────────────────────────────
// Quần đảo Hoàng Sa (Paracel Islands) — thuộc chủ quyền Việt Nam
const HOANG_SA: [number, number] = [16.5, 112.0];
// Quần đảo Trường Sa (Spratly Islands) — thuộc chủ quyền Việt Nam
const TRUONG_SA: [number, number] = [8.65, 111.92];

// ─── Types ───────────────────────────────────────────────────────────────────
interface MapMarker {
  slug: string;
  name: string;
  position: [number, number];
  country: string;
}

interface MapViewProps {
  markers: MapMarker[];
}

export default function MapView({ markers }: MapViewProps) {
  // Always center on Vietnam to show sovereignty
  const center: [number, number] = [14.5, 108.5];
  const zoom = 6;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={true}
      style={{ height: "100%", minHeight: 550, width: "100%" }}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      dragging={true}
    >
      {/* CartoDB Voyager tiles — international labels, clean style */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* ── Quần đảo Hoàng Sa (Paracel Islands) ─────────────────────────── */}
      <Circle
        center={HOANG_SA}
        radius={80000}
        pathOptions={{
          color: "#dc2626",
          fillColor: "#fecaca",
          fillOpacity: 0.2,
          weight: 2,
          dashArray: "5,5",
        }}
      />
      <Marker position={HOANG_SA} icon={sovereigntyIcon}>
        <Popup>
          <div className="text-center">
            <p className="font-bold text-sm text-red-700">Quần đảo Hoàng Sa</p>
            <p className="text-xs text-gray-600">Paracel Islands</p>
            <p className="text-xs text-red-600 font-semibold mt-1">
              🇻🇳 Chủ quyền Việt Nam
            </p>
          </div>
        </Popup>
      </Marker>

      {/* ── Quần đảo Trường Sa (Spratly Islands) ────────────────────────── */}
      <Circle
        center={TRUONG_SA}
        radius={120000}
        pathOptions={{
          color: "#dc2626",
          fillColor: "#fecaca",
          fillOpacity: 0.2,
          weight: 2,
          dashArray: "5,5",
        }}
      />
      <Marker position={TRUONG_SA} icon={sovereigntyIcon}>
        <Popup>
          <div className="text-center">
            <p className="font-bold text-sm text-red-700">Quần đảo Trường Sa</p>
            <p className="text-xs text-gray-600">Spratly Islands</p>
            <p className="text-xs text-red-600 font-semibold mt-1">
              🇻🇳 Chủ quyền Việt Nam
            </p>
          </div>
        </Popup>
      </Marker>

      {/* ── Destination markers ──────────────────────────────────────────── */}
      {markers.map(marker => (
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
  );
}
