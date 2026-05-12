"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Fix Leaflet default marker icon issue in Next.js
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
  // Center on Vietnam by default
  const center: [number, number] = markers.length > 0
    ? [
        markers.reduce((sum, m) => sum + m.position[0], 0) / markers.length,
        markers.reduce((sum, m) => sum + m.position[1], 0) / markers.length,
      ]
    : [16.0, 108.0]; // Vietnam center

  const zoom = markers.some(m => m.position[0] > 30 || m.position[0] < 0) ? 3 : 6;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", minHeight: 500, width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map(marker => (
        <Marker key={marker.slug} position={marker.position} icon={markerIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-sm">{marker.name}</p>
              <p className="text-xs text-gray-500">{marker.country}</p>
              <Link
                href={`/destinations/${marker.slug}`}
                className="mt-1 inline-block rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Xem chi tiết
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
