"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";

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

const colors: Record<string, string> = {
  "Kinésithérapie": "#B88A5A",
  "Médecine générale": "#0B1220",
  "Ostéopathie": "#2B8A3E",
  "Psychologie": "#5B21B6",
  "Nutrition": "#DC2626",
  "Naturopathie": "#D97706",
  "Orthophonie": "#0891B2",
  "Psychomotricité": "#7C3AED",
  "Médecine du Sport": "#059669",
};

function createMarkerIcon(specialty: string, isActive: boolean) {
  const color = colors[specialty] || "#B88A5A";
  const size = isActive ? 44 : 32;
  const border = isActive ? "4px solid #FFD700" : "3px solid white";
  const shadow = isActive ? "0 0 20px rgba(255,215,0,0.5)" : "0 2px 8px rgba(0,0,0,0.3)";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: ${border};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: ${shadow};
      transition: all 0.3s ease;
    "><div style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(45deg);
      color: white;
      font-size: ${isActive ? 16 : 12}px;
      font-weight: bold;
    ">${isActive ? "●" : ""}</div></div>`,
    iconSize: [size, size * 1.3],
    iconAnchor: [size / 2, size * 1.3],
    popupAnchor: [0, -size * 1.3],
  });
}

function SpecialistMarker({
  specialist,
  isActive,
  onPinClick,
}: {
  specialist: SpecialistLocation;
  isActive: boolean;
  onPinClick: (slug: string) => void;
}) {
  const { t, locale } = useLocale();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    marker.setIcon(createMarkerIcon(specialist.specialty, isActive));
    if (isActive) {
      marker.openPopup();
    }
  }, [isActive, specialist.specialty]);

  return (
    <Marker
      ref={markerRef}
      position={[specialist.location.lat, specialist.location.lng]}
      icon={createMarkerIcon(specialist.specialty, false)}
      eventHandlers={{
        click: () => onPinClick(specialist.slug),
      }}
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
            href={h(locale, `/professional/${specialist.slug}`)}
            className="inline-block text-xs font-medium text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors"
          >
            {t("specialistes.list.viewProfile")} →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

function FitBoundsOnLoad({ specialists }: { specialists: SpecialistLocation[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || specialists.length === 0) return;
    fitted.current = true;
    const bounds = L.latLngBounds(
      specialists.map((s) => [s.location.lat, s.location.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map, specialists]);

  return null;
}

export default function MapViewInner({
  specialists,
  activeSpecialistSlug,
  onPinClick,
}: {
  specialists: SpecialistLocation[];
  activeSpecialistSlug: string | null;
  onPinClick: (slug: string) => void;
}) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-[#0B1220]/10">
      <MapContainer
        center={[33.5731, -7.5898]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsOnLoad specialists={specialists} />
        {specialists.map((specialist) => (
          <SpecialistMarker
            key={specialist.slug}
            specialist={specialist}
            isActive={activeSpecialistSlug === specialist.slug}
            onPinClick={onPinClick}
          />
        ))}
      </MapContainer>
    </div>
  );
}
