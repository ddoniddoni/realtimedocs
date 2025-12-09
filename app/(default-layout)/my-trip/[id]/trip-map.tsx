"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";

import type { TripDetail, TripScheduleItem } from "./queries";

export type MapSelectedPlace = {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  placeId?: string;
};

type TripMapProps = {
  trip: TripDetail["trip"];
  selectedDayId: string | null;
  schedules: TripScheduleItem[];
  onPlaceSelected: (place: MapSelectedPlace) => void;
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries: "places"[] = ["places"];

export default function TripMap({
  trip,
  selectedDayId,
  schedules,
  onPlaceSelected,
}: TripMapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const autocompleteContainerRef = useRef<HTMLDivElement | null>(null);
  const placeAutocompleteRef =
    useRef<google.maps.places.PlaceAutocompleteElement | null>(null);

  const daySchedules = useMemo(() => {
    if (!selectedDayId) return [];

    const filtered = schedules.filter(
      (s) => s.trip_day_id === selectedDayId && s.lat !== null && s.lng !== null
    );

    return filtered.sort((a, b) => {
      if (a.start_time && b.start_time) {
        const diff = a.start_time.localeCompare(b.start_time);
        if (diff !== 0) return diff;
      } else if (a.start_time && !b.start_time) {
        return -1;
      } else if (!a.start_time && b.start_time) {
        return 1;
      }

      // 2) sort_order 기준
      if (a.sort_order !== null && b.sort_order !== null) {
        const diff = a.sort_order - b.sort_order;
        if (diff !== 0) return diff;
      } else if (a.sort_order !== null && b.sort_order === null) {
        return -1;
      } else if (a.sort_order === null && b.sort_order !== null) {
        return 1;
      }

      return a.created_at.localeCompare(b.created_at);
    });
  }, [selectedDayId, schedules]);

  const center = useMemo(() => {
    if (daySchedules.length > 0) {
      return {
        lat: daySchedules[0].lat as number,
        lng: daySchedules[0].lng as number,
      };
    }
    return { lat: 37.5665, lng: 126.978 };
  }, [daySchedules]);

  const onLoadMap = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!autocompleteContainerRef.current) return;
    if (placeAutocompleteRef.current) return;

    (async () => {
      await google.maps.importLibrary("places");

      const pac = new google.maps.places.PlaceAutocompleteElement({});

      // @ts-ignore
      pac.placeholder = "장소 검색...";

      // @ts-ignore
      pac.requestedLanguage = "ko";
      // @ts-ignore
      pac.requestedRegion = "KR";

      autocompleteContainerRef.current!.appendChild(pac);
      placeAutocompleteRef.current = pac;

      // @ts-ignore
      pac.addEventListener("gmp-select", async (event: any) => {
        const placePrediction = event.placePrediction;
        if (!placePrediction) return;

        const place = placePrediction.toPlace();
        await place.fetchFields({
          fields: ["displayName", "formattedAddress", "location", "id"],
        });

        const location = place.location;
        if (!location) return;

        const lat = location.lat();
        const lng = location.lng();

        // 지도 이동
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(14);
        }

        onPlaceSelected({
          lat,
          lng,
          name: place.displayName || "",
          address: place.formattedAddress || undefined,
          placeId: place.id ?? undefined,
        });
      });
    })();
  }, [isLoaded, onPlaceSelected]);

  const path = useMemo(
    () =>
      daySchedules.map((s) => ({
        lat: s.lat as number,
        lng: s.lng as number,
      })),
    [daySchedules]
  );

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    onPlaceSelected({
      lat,
      lng,
      name: "선택된 위치",
    });
  };

  if (!isLoaded) return <p>지도 로딩중...</p>;

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[80%]">
        <div ref={autocompleteContainerRef} />
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoadMap}
        onClick={handleMapClick}
      >
        {daySchedules.map((s, idx) => (
          <Marker
            key={s.id}
            position={{ lat: s.lat as number, lng: s.lng as number }}
            label={`${idx + 1}`}
            title={s.title}
          />
        ))}

        {path.length >= 2 && (
          <Polyline
            path={path}
            options={{
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
