"use client";

import { Plus } from "lucide-react";
import { useToggle } from "@ui/hooks";
import { FloatingButton } from "@ui/@atoms";
import ModalPlusTrip from "@ui/@atoms/modal/plus-trip/modal-plusTrip";
import type { Trip } from "./queries";

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
      <section className="flex flex-col gap-2 mb-16">
        {trips.length === 0 ? (
          <p className="text-sm text-muted-foreground px-3">
            아직 등록된 여행이 없어요. 오른쪽 아래 + 버튼으로 첫 여행을
            추가해보세요.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 px-3">
            {trips.map((trip) => (
              <li
                key={trip.id}
                className="border rounded-lg px-3 py-2 flex flex-col gap-1"
              >
                <span className="font-semibold">{trip.trip_name}</span>
                <span className="text-sm text-muted-foreground">
                  {trip.country}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

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
