import React from "react";

import { Menu, Copyright } from "@ui/@layout";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Menu />
      <div className="flex-1 flex flex-col">{children}</div>
      <Copyright />
    </div>
  );
}
