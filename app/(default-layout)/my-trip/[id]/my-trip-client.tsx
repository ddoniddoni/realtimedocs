"use client";

import { useTransition, useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

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

type MyTripClientProps = {
  data: TripDetail;
};

export default function MyTripClient({ data }: MyTripClientProps) {
  const { trip, days, schedulesByDayId } = data;

  const [isPending, startTransition] = useTransition();

  // DateRange (여행 시작/종료일)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const from = trip.start_date ? new Date(trip.start_date) : undefined;
    const to = trip.end_date ? new Date(trip.end_date) : undefined;
    return { from, to };
  });

  // Day 탭 선택 상태
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

    startTransition(async () => {
      const res = await updateTripDateRangeAction({
        tripId: trip.id,
        startDate,
        endDate,
      });

      if (!res.ok) {
        alert(res.error ?? "날짜 저장 중 오류가 발생했습니다.");
        return;
      }

      // 서버 액션에서 revalidatePath 호출하므로
      // 여기서는 UI 피드백만 간단히
      console.log("여행 날짜/Day 재생성 완료");
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* 상단 Trip 정보 */}
      <section className="space-y-1">
        <h1 className="text-xl font-semibold">{trip.trip_name}</h1>
        <p className="text-sm text-muted-foreground">{trip.country}</p>
      </section>

      {/* 여행 날짜 선택 (DateRangePicker) */}
      <section className="space-y-2">
        <p className="text-sm font-medium">여행 날짜</p>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "m-w-[290px] justify-start text-left font-normal",
                  !dateRange?.from && !dateRange?.to && "text-muted-foreground"
                )}
                disabled={isPending}
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

          <Button size="sm" onClick={handleApplyDateRange} disabled={isPending}>
            {isPending ? "저장 중..." : "적용"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          날짜를 적용하면 해당 기간에 맞춰 Day1 ~ DayN이 자동 생성/갱신됩니다.
        </p>
      </section>

      <section className="mt-2">
        <h2 className="mb-3 text-base font-semibold">여행 일정</h2>

        {days.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            아직 Day가 없습니다. 여행 날짜를 먼저 설정해주세요.
          </p>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((day) => (
                <Button
                  key={day.id}
                  onClick={() => setSelectedDayId(day.id)}
                  className={cn(
                    "rounded-full px-4 py-1 text-sm border whitespace-nowrap",
                    selectedDayId === day.id
                      ? "bg-sky-500 text-white border-sky-500"
                      : "bg-white text-slate-700 border-slate-300"
                  )}
                >
                  Day {day.day_index}
                </Button>
              ))}
            </div>

            {selectedDayId && (
              <p className="mt-3 text-sm text-muted-foreground">
                {(() => {
                  const day = days.find((d) => d.id === selectedDayId);
                  return day
                    ? format(new Date(day.date), "yyyy.MM.dd (EEE)")
                    : null;
                })()}
              </p>
            )}

            {/* 일정 리스트 */}
            <div className="mt-4 space-y-3">
              {(!selectedDayId || selectedSchedules.length === 0) && (
                <p className="rounded-md border p-4 text-sm text-muted-foreground">
                  아직 일정이 없습니다. 다음 단계에서 “일정 추가” 기능을 붙여서
                  이 Day에 스케줄을 채울 예정입니다.
                </p>
              )}

              {selectedDayId &&
                selectedSchedules.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-4 shadow-sm bg-white"
                  >
                    <div className="flex justify-between gap-2">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.start_time && (
                        <span className="text-xs text-slate-500">
                          {item.start_time}
                          {item.end_time ? ` ~ ${item.end_time}` : ""}
                        </span>
                      )}
                    </div>

                    {item.location_name && (
                      <p className="mt-1 text-sm text-slate-600">
                        📍 {item.location_name}
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
