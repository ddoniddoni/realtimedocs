"use client";

import { Plus } from "lucide-react";
import { useToggle } from "@ui/hooks";
import { FloatingButton } from "@ui/@atoms";
import ModalPlusTrip from "@ui/@atoms/modal/plus-trip/modal-plusTrip";
import TripCard from "@ui/@molecules/trip-card/tripCard";

import type { Trip } from "./queries";

type BoardClientProps = {
  trips: Trip[];
};

export default function BoardClient({ trips }: BoardClientProps) {
  const togglePlusMyTravel = useToggle();
  const hasTrips = trips.length > 0;

  const handleClickPlus = () => {
    togglePlusMyTravel.open();
  };

  return (
    <>
      <section
        className="flex flex-1 flex-col pt-3"
        aria-labelledby="my-trips-heading"
      >
        {hasTrips ? (
          <>
            <header className="mb-4">
              <h1 id="my-trips-heading" className="text-xl font-semibold">
                나의 여행
              </h1>
              <p className="text-sm text-muted-foreground">
                총 {trips.length}개의 여행이 저장되어 있어요.
              </p>
            </header>

            <section aria-label="여행 카드 목록">
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {trips.map((trip) => (
                  <li key={trip.id}>
                    <TripCard
                      id={trip.id}
                      name={trip.trip_name}
                      country={trip.country}
                      created_at={trip.created_at}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <section className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
            <h1 id="my-trips-heading" className="text-lg font-semibold">
              아직 여행이 없어요.
            </h1>
            <p className="text-sm text-muted-foreground">
              첫 여행을 추가해보세요 ✈️
            </p>
          </section>
        )}
      </section>

      <FloatingButton
        size="md"
        onClick={handleClickPlus}
        aria-label="여행 추가"
      >
        <Plus className="size-5" aria-hidden="true" />
      </FloatingButton>

      {togglePlusMyTravel.isOn && (
        <ModalPlusTrip
          title="여행 등록"
          open={togglePlusMyTravel.isOn}
          onClose={togglePlusMyTravel.close}
          close={false}
        />
      )}
    </>
  );
}
