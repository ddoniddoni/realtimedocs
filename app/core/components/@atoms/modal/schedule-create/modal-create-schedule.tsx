// schedule-create-modal.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapSelectedPlace } from "@/app/(default-layout)/my-trip/[id]/trip-map";
import { createTripScheduleItemAction } from "@/app/(default-layout)/my-trip/[id]/actions";
import { Textarea } from "@/components/ui/textarea";

type ScheduleCreateModalProps = {
  open: boolean;
  onClose: () => void;
  dayId: string;
  place: MapSelectedPlace;
};

type FormValues = {
  title: string;
  startTime: string;
  endTime: string;
  memo: string;
};

export function ScheduleCreateModal({
  open,
  onClose,
  dayId,
  place,
}: ScheduleCreateModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: place.name || "",
      startTime: "",
      endTime: "",
      memo: "",
    },
  });

  if (!open) return null;

  const onSubmit = (values: FormValues) => {
    if (!values.startTime) {
      alert("시작 시간을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const res = await createTripScheduleItemAction({
        tripDayId: dayId,
        title: values.title || place.name || "일정",
        startTime: values.startTime,
        endTime: values.endTime || null,
        locationName: place.name || "",
        lat: place.lat,
        lng: place.lng,
        address: place.address ?? null,
        memo: values.memo || null,
      });

      if (!res.ok) {
        alert(res.error ?? "일정 추가 중 오류가 발생했습니다.");
        return;
      }

      onClose();
      router.refresh();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="
          w-full max-w-md rounded-lg border border-border
          bg-background text-foreground
          p-4 shadow-lg
        "
      >
        <h2 className="text-lg font-semibold mb-1">일정 추가</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Day에 추가할 일정 정보를 입력해주세요.
        </p>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-xs font-medium">장소</label>
            <p className="text-sm font-semibold">{place.name}</p>
            {place.address && (
              <p className="text-xs text-muted-foreground">{place.address}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">일정 제목</label>
            <Input
              {...register("title")}
              placeholder="예: 경복궁 관람"
              disabled={isPending}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium">시작 시간</label>
              <Input
                type="time"
                step={60}
                {...register("startTime", { required: true })}
                disabled={isPending}
              />
              {errors.startTime && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  시작 시간을 입력해주세요.
                </p>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium">종료 시간 (선택)</label>
              <Input
                type="time"
                step={60}
                {...register("endTime")}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">메모 (선택)</label>
            <Textarea
              rows={3}
              {...register("memo")}
              placeholder="간단한 메모를 남겨보세요."
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "추가 중..." : "일정 추가"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
