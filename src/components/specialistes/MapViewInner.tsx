"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

type SpecialistLocation = {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    address: string;
  };
};

const createSpecialistIcon = (specialty: string) => {
  const colors: Record<string, string> = {
    "Kinésithérapie": "#B88A5A",
    "Médecine générale": "#0B1220",
    "Ostéopathie": "#2B8A3E",
    "Psychologie": "#5B21B6",
    "Nutrition": "#DC2626",
  };
  const color = colors[specialty] || "#B88A5A";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 32px;
      height: 32px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "><div style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(45deg);
      color: white;
      font-size: 12px;
      font-weight: bold;
    "></div></div>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

export default function MapViewInner({ specialists }: { specialists: SpecialistLocation[] }) {
  const center: [number, number] = [33.5731, -7.5898];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-[#0B1220]/10">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {specialists.map((specialist) => (
          <Marker
            key={specialist.slug}
            position={[specialist.location.lat, specialist.location.lng]}
            icon={createSpecialistIcon(specialist.specialty)}
          >
            <Popup>
              <div className="p-1 min-w-[180px]">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-[#0B1220]">{specialist.name}</h3>
                    <p className="text-xs text-[#2B2F36]/60">{specialist.role}</p>
                  </div>
                </div>
                <p className="text-xs text-[#2B2F36]/50 mb-2">{specialist.location.address}</p>
                <Link
                  href={`/specialistes/${specialist.slug}`}
                  className="inline-block text-xs font-medium text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors"
                >
                  Voir le profil →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
