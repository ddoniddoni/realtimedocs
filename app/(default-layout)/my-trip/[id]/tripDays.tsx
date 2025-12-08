"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import type { TripDetail } from "./queries";

type Props = {
  days: TripDetail["days"];
  schedulesByDayId: TripDetail["schedulesByDayId"];
  selectedDayId: string | null;
  onSelectDay: (dayId: string) => void;
};

export function TripDays({
  days,
  schedulesByDayId,
  selectedDayId,
  onSelectDay,
}: Props) {
  const selectedSchedules =
    selectedDayId && schedulesByDayId[selectedDayId]
      ? schedulesByDayId[selectedDayId]
      : [];

  return (
    <section className="mt-2">
      <h2 className="mb-3 text-base font-semibold">여행 일정</h2>

      {days.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          아직 Day가 없습니다. 여행 날짜를 먼저 설정해주세요.
        </p>
      ) : (
        <>
          {/* Day 탭 */}
          <div className="flex flex-wrap gap-2 pb-2">
            {days.map((day) => (
              <Button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
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

          {/* 선택된 Day 날짜 */}
          {selectedDayId && (
            <p className="mt-3 text-sm text-muted-foreground">
              {(() => {
                const day = days.find((d) => d.id === selectedDayId);
                return day
                  ? format(new Date(day.date), "yyyy.MM.dd (EEE)", {
                      locale: ko,
                    })
                  : null;
              })()}
            </p>
          )}

          {/* 일정 리스트 */}
          <div className="mt-4 space-y-3">
            {(!selectedDayId || selectedSchedules.length === 0) && (
              <p className="rounded-md border p-4 text-sm text-muted-foreground">
                아직 일정이 없습니다. 지도를 클릭해서 이 Day에 스케줄을
                추가해보세요.
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
  );
}
