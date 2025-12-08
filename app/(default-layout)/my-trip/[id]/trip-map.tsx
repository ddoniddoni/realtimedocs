"use client";

import { useCallback, useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import type { TripDetail } from "./queries";

type MapSelectedPlace = {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  placeId?: string;
};

type TripMapProps = {
  trip: TripDetail["trip"];
  selectedDayId: string | null;
  schedules: any[];
  onPlaceSelected: (place: MapSelectedPlace) => void;
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export function TripMap({
  trip,
  selectedDayId,
  schedules,
  onPlaceSelected,
}: TripMapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const center = useMemo(
    () => ({
      lat: 37.5665,
      lng: 126.978,
    }),
    [trip]
  );

  const handleClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      onPlaceSelected({
        lat,
        lng,
        name: "선택한 위치",
      });
    },
    [onPlaceSelected]
  );

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center text-sm">
        지도 로딩 중...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onClick={handleClick}
    >
      {schedules.map((schedule: any) => (
        <Marker
          key={schedule.id}
          position={{
            lat: schedule.latitude,
            lng: schedule.longitude,
          }}
        />
      ))}
    </GoogleMap>
  );
}
