import { createClient } from "@/utils/supabase/server";

export type Trip = {
  id: string;
  trip_name: string;
  country: string;
  created_at: string;
};

export async function getMyTrips() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { trips: [] as Trip[], error: "NOT_AUTH" as const };
  }

  const { data, error } = await supabase
    .from("trips")
    .select("id, trip_name, country, created_at")
    .order("created_at", { ascending: false });

  return {
    trips: (data ?? []) as Trip[],
    error: error ?? null,
  };
}
