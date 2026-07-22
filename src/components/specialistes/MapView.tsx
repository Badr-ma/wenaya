"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function MapView({ specialists }: { specialists: SpecialistLocation[] }) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{ specialists: SpecialistLocation[] }> | null>(null);

  useEffect(() => {
    import("./MapViewInner").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="w-full h-[400px] bg-[#E8E2D9] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-[#2B2F36]/30 text-sm">Chargement de la carte...</div>
      </div>
    );
  }

  return <MapComponent specialists={specialists} />;
}
