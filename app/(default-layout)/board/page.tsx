"use client";

import { Plus } from "lucide-react";

import { useToggle } from "@ui/hooks";
import { FloatingButton } from "@ui/@atoms";
import { Button } from "@/components/ui/button";
import ModalPlusTrip from "@ui/@atoms/modal/plus-trip/modal-plusTrip";
import { Modal } from "@/app/core/components/@atoms/modal";

export default function BoardPage() {
  const togglePlusMyTravel = useToggle();

  const handleClickPlus = () => {
    togglePlusMyTravel.open();
  };

  const handleClose = () => {
    togglePlusMyTravel.close();
  };

  return (
    <main className="flex flex-1 flex-col pt-3">
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
