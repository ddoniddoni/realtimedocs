import { createClient } from "@/utils/supabase/server";
import type { PostgrestError } from "@supabase/supabase-js";

export type Trip = {
  id: string;
  user_id: string;
  trip_name: string;
  country: string;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
};

export type TripDay = {
  id: string;
  trip_id: string;
  date: string; // date
  day_index: number; // int4
  title: string | null;
  created_at: string;
};

export type TripScheduleItem = {
  id: string;
  trip_day_id: string;
  title: string;
  description: string | null;
  start_time: string | null; // time -> string
  end_time: string | null; // time -> string
  sort_order: number | null;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  created_at: string;
};

export type TripChecklistItem = {
  id: string;
  trip_id: string;
  label: string;
  is_done: boolean;
  sort_order: number | null;
  created_at: string;
};

export type TripDetail = {
  trip: Trip;
  days: TripDay[];
  schedulesByDayId: Record<string, TripScheduleItem[]>;
  checklist: TripChecklistItem[];
};

export type GetTripDetailResult = {
  data: TripDetail | null;
  error: PostgrestError | "NOT_AUTH" | "NOT_FOUND" | null;
};

export async function getTripDetail(
  tripId: string
): Promise<GetTripDetailResult> {
  const supabase = await createClient();

  // 1) 유저 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "NOT_AUTH" };
  }

  // 2) trip 가져오기 + 소유자 체크
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .eq("user_id", user.id)
    .single();

  if (tripError || !trip) {
    const code = (tripError as PostgrestError | null)?.code;
    if (code === "PGRST116") {
      // no rows
      return { data: null, error: "NOT_FOUND" };
    }
    return { data: null, error: tripError ?? "NOT_FOUND" };
  }

  // 3) trip_days 가져오기 (day_index 기준 정렬)
  const { data: days, error: daysError } = await supabase
    .from("trip_days")
    .select("*")
    .eq("trip_id", tripId)
    .order("day_index", { ascending: true });

  if (daysError) {
    return { data: null, error: daysError };
  }

  const safeDays = days ?? [];
  const dayIds = safeDays.map((d: TripDay) => d.id);

  // 4) schedule items (해당 trip의 모든 day에 대한 일정)
  let schedulesByDayId: Record<string, TripScheduleItem[]> = {};

  if (dayIds.length > 0) {
    const { data: schedules, error: schedulesError } = await supabase
      .from("trip_schedule_items")
      .select("*")
      .in("trip_day_id", dayIds)
      .order("sort_order", { ascending: true });

    if (schedulesError) {
      return { data: null, error: schedulesError };
    }

    const safeSchedules = schedules ?? [];
    schedulesByDayId = safeSchedules.reduce<Record<string, TripScheduleItem[]>>(
      (acc: Record<string, TripScheduleItem[]>, item: TripScheduleItem) => {
        if (!acc[item.trip_day_id]) acc[item.trip_day_id] = [];
        acc[item.trip_day_id].push(item);
        return acc;
      },
      {}
    );
  }

  // 5) 체크리스트
  const { data: checklist, error: checklistError } = await supabase
    .from("trip_checklist_items")
    .select("*")
    .eq("trip_id", tripId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (checklistError) {
    return { data: null, error: checklistError };
  }

  return {
    data: {
      trip: trip as Trip,
      days: safeDays as TripDay[],
      schedulesByDayId,
      checklist: (checklist ?? []) as TripChecklistItem[],
    },
    error: null,
  };
}
