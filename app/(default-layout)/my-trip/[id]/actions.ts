"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type UpdateTripDateRangeInput = {
  tripId: string;
  startDate: string; // "2025-11-26"
  endDate: string; // "2025-11-28"
};

export async function updateTripDateRangeAction(
  input: UpdateTripDateRangeInput
) {
  const { tripId, startDate, endDate } = input;
  const supabase = await createClient();

  // 1) 유저 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("updateTripDateRangeAction: getUser error", userError);
    return { ok: false, error: "NOT_AUTH" };
  }

  // 2) trip 소유자 확인
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id")
    .eq("id", tripId)
    .eq("user_id", user.id)
    .single();

  if (tripError || !trip) {
    console.error("updateTripDateRangeAction: tripError", tripError);
    return { ok: false, error: "NOT_FOUND" };
  }

  // 3) trips에 start_date, end_date 업데이트
  const { error: updateTripError } = await supabase
    .from("trips")
    .update({
      start_date: startDate,
      end_date: endDate,
    })
    .eq("id", tripId)
    .eq("user_id", user.id);
  console.log(updateTripError);
  if (updateTripError) {
    console.error(
      "updateTripDateRangeAction: updateTripError",
      updateTripError
    );
    return { ok: false, error: "여행 날짜 저장 중 오류가 발생했습니다." };
  }

  // 4) 기존 day/schedule 삭제
  const { data: oldDays, error: oldDaysError } = await supabase
    .from("trip_days")
    .select("id")
    .eq("trip_id", tripId);

  if (oldDaysError) {
    console.error("updateTripDateRangeAction: oldDaysError", oldDaysError);
    return { ok: false, error: "기존 Day 조회 중 오류가 발생했습니다." };
  }

  const oldDayIds = (oldDays ?? []).map((d) => d.id as string);

  if (oldDayIds.length > 0) {
    const { error: delSchedulesError } = await supabase
      .from("trip_schedule_items")
      .delete()
      .in("trip_day_id", oldDayIds);

    if (delSchedulesError) {
      console.error(
        "updateTripDateRangeAction: delSchedulesError",
        delSchedulesError
      );
      return { ok: false, error: "기존 일정 삭제 중 오류가 발생했습니다." };
    }

    const { error: delDaysError } = await supabase
      .from("trip_days")
      .delete()
      .eq("trip_id", tripId);

    if (delDaysError) {
      console.error("updateTripDateRangeAction: delDaysError", delDaysError);
      return { ok: false, error: "기존 Day 삭제 중 오류가 발생했습니다." };
    }
  }

  // 5) 새 trip_days 생성
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return { ok: false, error: "유효한 날짜 범위가 아닙니다." };
  }

  const daysToInsert: {
    trip_id: string;
    date: string;
    day_index: number;
  }[] = [];

  let index = 1;
  for (
    let d = new Date(start);
    d.getTime() <= end.getTime();
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    daysToInsert.push({
      trip_id: tripId,
      date: dateStr,
      day_index: index++,
    });
  }

  if (daysToInsert.length > 0) {
    const { error: insertDaysError } = await supabase
      .from("trip_days")
      .insert(daysToInsert);

    if (insertDaysError) {
      console.error(
        "updateTripDateRangeAction: insertDaysError",
        insertDaysError
      );
      return { ok: false, error: "Day 생성 중 오류가 발생했습니다." };
    }
  }

  revalidatePath(`/my-trip/${tripId}`);
  return { ok: true };
}

export async function inviteFriendAction(input: {
  tripId: string;
  email: string;
}) {
  const { tripId, email } = input;
  if (!email) {
    return { ok: false, error: "이메일을 확인해주세요." as const };
  }
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "NOT_AUTH" as const };
  }

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, user_id")
    .eq("id", tripId)
    .single();

  if (tripError || !trip) {
    console.error("trip load error:", tripError);
    return { ok: false, error: "여행 정보를 찾을 수 없습니다." as const };
  }

  if (trip.user_id !== user.id) {
    return { ok: false, error: "NOT_OWNER" as const };
  }

  const { data: invitedUser, error: invitedError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (invitedError || !invitedUser) {
    return {
      ok: false,
      error: "해당 이메일로 가입된 사용자가 없습니다." as const,
    };
  }

  if (invitedUser.id === user.id) {
    return {
      ok: false,
      error: "자기 자신은 초대할 수 없습니다." as const,
    };
  }

  const { data: existing, error: existingError } = await supabase
    .from("trip_members")
    .select("id")
    .eq("trip_id", tripId)
    .eq("user_id", invitedUser.id)
    .maybeSingle();

  if (existingError) {
    console.error("trip_members check error:", existingError);
  }

  if (existing) {
    return {
      ok: false,
      error: "이미 이 여행에 참여 중인 사용자입니다." as const,
    };
  }

  const { error: insertError } = await supabase.from("trip_members").insert({
    trip_id: tripId,
    user_id: invitedUser.id,
    role: "member",
  });

  if (insertError) {
    console.error("trip_members insert error:", insertError);
    return {
      ok: false,
      error: "초대 저장 중 오류가 발생했습니다." as const,
    };
  }

  revalidatePath(`/my-trip/${tripId}`);

  return { ok: true as const };
}
