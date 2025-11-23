import { Button } from "@/components/ui/button";
import { ModalContainerProps } from "../../../types";
import { Modal } from "../modal";
import { useForm } from "react-hook-form";

type ModalPlusTripProps = {} & ModalContainerProps;
type FormValues = {
  tripName: string;
  country: string;
};

export default function ModalPlusTrip(props: ModalPlusTripProps) {
  const { open = false, onClose, title = "", close, footer = null } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log("폼 데이터", data);

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
          <Button onClick={handleSubmit(onSubmit)}>
            <span>확인</span>
          </Button>
          <Button onClick={handleClose}>
            <span>취소</span>
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-1">
          <label className="font-medium">여행 이름</label>
          <input
            type="text"
            className="border rounded px-3 py-2"
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
          <label className="font-medium">국가</label>
          <input
            type="text"
            className="border rounded px-3 py-2"
            placeholder="예: 일본"
            {...register("country", {
              required: "국가를 입력하세요.",
            })}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
