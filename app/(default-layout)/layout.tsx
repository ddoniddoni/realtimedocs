import React from "react";
import { Copyright } from "@ui/@layout";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <div className="flex-1 flex flex-col">{children}</div>
      <Copyright />
    </div>
  );
}
