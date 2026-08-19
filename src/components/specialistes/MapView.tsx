"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";

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

export default function MapView({
  specialists,
  activeSpecialistSlug,
  onPinClick,
}: {
  specialists: SpecialistLocation[];
  activeSpecialistSlug: string | null;
  onPinClick: (slug: string) => void;
}) {
  const { t } = useLocale();
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    specialists: SpecialistLocation[];
    activeSpecialistSlug: string | null;
    onPinClick: (slug: string) => void;
  }> | null>(null);

  useEffect(() => {
    import("./MapViewInner").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="w-full h-full bg-[#E8E2D9] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-[#2B2F36]/30 text-sm">{t("specialistes.list.mapLoading")}</div>
      </div>
    );
  }

  return <MapComponent specialists={specialists} activeSpecialistSlug={activeSpecialistSlug} onPinClick={onPinClick} />;
}
