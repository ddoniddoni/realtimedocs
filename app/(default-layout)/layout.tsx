import { cookies } from "next/headers";

import React from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import RSidebarMenu from "@ui/@layout/sidebar-menu";
import Menu from "../core/components/@layout/menu";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <SidebarProvider defaultOpen={defaultOpen} className="flex flex-col">
        <Menu />
        <div className="flex flex-1">
          <RSidebarMenu />
          <main className="flex-1 flex flex-col px-4">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
