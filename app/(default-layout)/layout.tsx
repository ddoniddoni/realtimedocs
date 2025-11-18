import React from "react";

import { Copyright } from "@ui/@layout";
import Menu from "@ui/@layout/menu";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh bg-background/50">
      <Menu />
      <div className="flex-1 flex flex-col">{children}</div>
      <Copyright />
    </div>
  );
}
