"use server";

import { createClient } from "@/utils/supabase/server";

type CreateTripInput = {
  tripName: string;
  country: string;
};

export async function createTripAction(data: CreateTripInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  const { error } = await supabase.from("trips").insert({
    user_id: user.id,
    trip_name: data.tripName,
    country: data.country,
  });

  if (error) {
    console.error("createTripAction error:", error);
    return { ok: false, message: "여행 생성 실패" };
  }

  return { ok: true };
}
