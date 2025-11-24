"use client";

import { Plus } from "lucide-react";
import { useToggle } from "@ui/hooks";
import { FloatingButton } from "@ui/@atoms";
import ModalPlusTrip from "@ui/@atoms/modal/plus-trip/modal-plusTrip";
import type { Trip } from "./queries";
import TripCard from "@/app/core/components/@molecules/trip-card/tripCard";

type BoardClientProps = {
  trips: Trip[];
};

export default function BoardClient({ trips }: BoardClientProps) {
  const togglePlusMyTravel = useToggle();

  const handleClickPlus = () => {
    togglePlusMyTravel.open();
  };

  return (
    <main className="flex flex-1 flex-col pt-3">
      {trips.length === 0 ? (
        <>
          <section className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-lg font-semibold">아직 여행이 없어요.</p>
            <p className="text-sm text-muted-foreground">
              첫 여행을 추가해보세요 ✈️
            </p>
          </section>
        </>
      ) : (
        <>
          <section className="space-y-4">
            <header>
              <h1 className="text-xl font-semibold">나의 여행</h1>
              <p className="text-sm text-muted-foreground">
                총 {trips.length}개의 여행이 저장되어 있어요.
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  name={trip.trip_name}
                  country={trip.country}
                  created_at={trip.created_at}
                />
              ))}
            </div>
          </section>
        </>
      )}

      <FloatingButton size={"md"} onClick={handleClickPlus}>
        <Plus className="size-5" />
      </FloatingButton>

      {togglePlusMyTravel.isOn && (
        <ModalPlusTrip
          title={"여행 등록"}
          open={togglePlusMyTravel.isOn}
          onClose={togglePlusMyTravel.close}
          close={false}
        />
      )}
    </main>
  );
}
