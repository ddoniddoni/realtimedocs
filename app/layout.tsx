import { ReactNode } from "react";

import "../app/assets/styles/globals.css";

import AuthProvider from "@lib/providers/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Realtime Docs",
  description: "Realtime Docs With Team",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body className="min-h-screen bg-gray-50 text-gray-900">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
