"use client";

import { ReactNode, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@lib/store/user";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser(data.user);
    }
    load();
  }, []);

  return <>{children}</>;
}
