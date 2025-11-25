"use client";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ModalContainerProps } from "../../../types";
import { Modal } from "../modal";
import { createTripAction } from "@/app/(default-layout)/board/actions";
import { CountryCombobox } from "../../country-combobox.tsx";
import { useRouter } from "next/navigation";

type ModalPlusTripProps = {} & ModalContainerProps;
type FormValues = {
  tripName: string;
  country: string;
};

export default function ModalPlusTrip(props: ModalPlusTripProps) {
  const router = useRouter();
  const { open = false, onClose, title = "", close, footer = null } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const res = await createTripAction({
      tripName: data.tripName,
      country: data.country,
    });

    if (!res.ok) {
      alert(res.message ?? "에러가 발생했습니다.");
      return;
    }
    router.refresh();
    handleClose();
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal
      title={title}
      open={open}
      onClose={handleClose}
      close={close}
      footer={
        <>
          <Button className="bg-sky-500" onClick={handleSubmit(onSubmit)}>
            <span>확인</span>
          </Button>
          <Button className="bg-sky-500" onClick={handleClose}>
            <span>취소</span>
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-1">
          <label className="text-sky-300">여행 이름</label>
          <input
            type="text"
            className="border text-sm text-sky-300 rounded px-3 py-2"
            placeholder="예: 일본 여행"
            {...register("tripName", {
              required: "여행 이름을 입력하세요.",
              maxLength: {
                value: 20,
                message: "20자 이내로 입력해주세요",
              },
            })}
          />
          {errors.tripName && (
            <p className="text-red-500 text-sm">{errors.tripName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sky-300">국가</label>
          <Controller
            control={control}
            name="country"
            rules={{ required: true }}
            render={({ field }) => (
              <CountryCombobox
                value={field.value}
                onChange={field.onChange}
                placeholder="여행할 국가를 선택하세요"
              />
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
