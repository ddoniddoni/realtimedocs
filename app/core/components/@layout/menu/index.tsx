"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navigation from "./navigation";
import { useUserStore } from "@lib/store/user";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Menu() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between gap-5 px-5 py-2.5 min-h-[68px] w-screen border-b border-border overflow-hidden transition-colors bg-background/90 before:content-[''] before:absolute before:inset-0 before:block before:z-[-1] before:opacity-0 before:transition-opacity">
      <Link
        href="/"
        className="text-xl font-bold tracking-tight pl-5 text-foreground"
      >
        RSD
      </Link>

      <Navigation />

      {user ? (
        <Button className="cursor-pointer" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <Button>Login</Button>
      )}
      <ModeToggle />
    </header>
  );
}
