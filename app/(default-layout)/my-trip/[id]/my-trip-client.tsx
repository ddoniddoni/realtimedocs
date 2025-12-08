"use client";

import { useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import type { TripDetail } from "./queries";
import { updateTripDateRangeAction } from "./actions";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { InviteFriendButton } from "@/app/core/components";
import { TripDays } from "./tripDays";
import { TripMap } from "./trip-map";

type MyTripClientProps = {
  data: TripDetail;
};

export default function MyTripClient({ data }: MyTripClientProps) {
  const { trip, days, schedulesByDayId, isOwner } = data;

  const router = useRouter();

  const [isSavingDateRange, startDateRangeTransition] = useTransition();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const from = trip.start_date ? new Date(trip.start_date) : undefined;
    const to = trip.end_date ? new Date(trip.end_date) : undefined;
    return { from, to };
  });

  const [selectedDayId, setSelectedDayId] = useState<string | null>(() => {
    return days[0]?.id ?? null;
  });

  const selectedSchedules =
    selectedDayId && schedulesByDayId[selectedDayId]
      ? schedulesByDayId[selectedDayId]
      : [];

  const handleApplyDateRange = () => {
    if (!dateRange?.from || !dateRange.to) {
      alert("여행 시작일과 종료일을 모두 선택해주세요.");
      return;
    }

    const startDate = format(dateRange.from, "yyyy-MM-dd");
    const endDate = format(dateRange.to, "yyyy-MM-dd");

    startDateRangeTransition(async () => {
      console.log("[DEBUG] handleApplyDateRange 호출됨");

      const res = await updateTripDateRangeAction({
        tripId: trip.id,
        startDate,
        endDate,
      });

      if (!res.ok) {
        alert(res.error ?? "날짜 저장 중 오류가 발생했습니다.");
        return;
      }

      console.log("여행 날짜/Day 재생성 완료");
      router.refresh();
    });
  };

  const handlePlaceSelected = (place: {
    lat: number;
    lng: number;
    name: string;
    address?: string;
    placeId?: string;
  }) => {
    if (!selectedDayId) {
      alert("먼저 Day를 선택해주세요.");
      return;
    }

    console.log("[DEBUG] handlePlaceSelected 호출됨", {
      selectedDayId,
      place,
    });
  };

  return (
    <div className="flex flex-col gap-6 pt-2.5 pb-2.5">
      <section className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{trip.trip_name}</h1>
          <p className="text-sm text-muted-foreground">{trip.country}</p>
        </div>

        {isOwner && <InviteFriendButton tripId={trip.id} />}
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium">여행 날짜</p>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "m-w-[290px] justify-start text-left font-normal",
                  !dateRange?.from && !dateRange?.to && "text-muted-foreground"
                )}
                disabled={isSavingDateRange}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "yyyy-MM-dd")} ~{" "}
                      {format(dateRange.to, "yyyy-MM-dd")}
                    </>
                  ) : (
                    format(dateRange.from, "yyyy-MM-dd")
                  )
                ) : (
                  <span>여행 시작일과 종료일을 선택하세요</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={ko}
              />
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApplyDateRange}
            disabled={isSavingDateRange}
          >
            {isSavingDateRange ? "저장 중..." : "적용"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          날짜를 적용하면 해당 기간에 맞춰 Day1 ~ DayN이 자동 생성/갱신됩니다.
        </p>
      </section>

      <section className="flex gap-4 min-h-[480px]">
        <div className="w-[320px] shrink-0">
          <TripDays
            days={days}
            schedulesByDayId={schedulesByDayId}
            selectedDayId={selectedDayId}
            onSelectDay={setSelectedDayId}
          />
        </div>

        <div className="flex-1 min-h-[480px]">
          <TripMap
            trip={trip}
            selectedDayId={selectedDayId}
            schedules={selectedSchedules}
            onPlaceSelected={handlePlaceSelected}
          />
        </div>
      </section>
    </div>
  );
}
