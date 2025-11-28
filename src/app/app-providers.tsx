"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Provider as AiSdkProvider } from "@ai-sdk-tools/store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AiSdkProvider>{children}</AiSdkProvider>
      <Toaster richColors />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );
}
