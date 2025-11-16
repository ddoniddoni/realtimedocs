import { ReactNode } from "react";
import "../styles/globals.css";

export const metadata = {
  title: "Realtime Docs",
  description: "Realtime Docs With Team",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
