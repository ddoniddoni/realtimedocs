import { cookies } from "next/headers";
import React from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import RSidebarMenu from "@ui/@layout/sidebar-menu";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <div className="flex flex-col min-h-dvh bg-background/50">
      <SidebarProvider defaultOpen={defaultOpen}>
        <RSidebarMenu />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
