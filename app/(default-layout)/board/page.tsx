"use client";

import { Plus } from "lucide-react";

import { useToggle } from "@ui/hooks";
import { FloatingButton } from "@ui/@atoms";
import { Modal } from "@ui/@atoms/modal";
import { Button } from "@/components/ui/button";

export default function BoardPage() {
  const togglePlusMyTravel = useToggle();

  const handleClickPlus = () => {
    togglePlusMyTravel.open();
    console.log(togglePlusMyTravel);
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
        <Modal
          open={togglePlusMyTravel.isOn}
          onClose={togglePlusMyTravel.close}
          close={false}
          footer={
            <>
              <Button>
                <span>확인</span>
              </Button>
              <Button onClick={handleClose}>
                <span>취소</span>
              </Button>
            </>
          }
        />
      )}
    </main>
  );
}
