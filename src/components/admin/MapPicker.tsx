"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const DEFAULT_CENTER: [number, number] = [13.1, 100.92]; // ชลบุรี
const DEFAULT_ZOOM = 10;

type MapPickerProps = {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
};

function MapPickerInner({ lat, lng, onChange }: MapPickerProps) {
  const {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
  } = require("react-leaflet");
  const L = require("leaflet");

  const markerRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
    setReady(true);
  }, [L]);

  function ClickHandler() {
    useMapEvents({
      click(e: { latlng: { lat: number; lng: number } }) {
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  const center: [number, number] =
    lat != null && lng != null ? [lat, lng] : DEFAULT_CENTER;

  if (!ready) return null;

  return (
    <MapContainer
      center={center}
      zoom={lat != null ? 15 : DEFAULT_ZOOM}
      className="w-full h-full rounded-xl z-0"
      style={{ minHeight: 300 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler />
      {lat != null && lng != null && (
        <Marker position={[lat, lng]} ref={markerRef} />
      )}
    </MapContainer>
  );
}

const MapPickerDynamic = dynamic(
  () => Promise.resolve(MapPickerInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm" style={{ minHeight: 300 }}>
        กำลังโหลดแผนที่...
      </div>
    ),
  }
);

export default function MapPicker(props: MapPickerProps) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <MapPickerDynamic {...props} />
    </>
  );
}
