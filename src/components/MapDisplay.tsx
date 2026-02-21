"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type MapDisplayProps = {
  lat: number;
  lng: number;
  name?: string;
};

function MapDisplayInner({ lat, lng, name }: MapDisplayProps) {
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  const L = require("leaflet");
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

  if (!ready) return null;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="w-full h-full rounded-2xl z-0"
      style={{ minHeight: 280 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        {name && <Popup>{name}</Popup>}
      </Marker>
    </MapContainer>
  );
}

const MapDisplayDynamic = dynamic(() => Promise.resolve(MapDisplayInner), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm" style={{ minHeight: 280 }}>
      กำลังโหลดแผนที่...
    </div>
  ),
});

export default function MapDisplay(props: MapDisplayProps) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <MapDisplayDynamic {...props} />
    </>
  );
}
