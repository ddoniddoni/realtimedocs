import { ReactNode } from "react";

import "../app/assets/styles/globals.css";

import AuthProvider from "@lib/providers/auth-provider";

export const metadata = {
  title: "Realtime Docs",
  description: "Realtime Docs With Team",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="min-h-screen bg-gray-50 text-gray-900">
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
