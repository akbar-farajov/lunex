"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Provider as AiSdkProvider } from "@ai-sdk-tools/store";

export function Providers({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <AiSdkProvider>{children}</AiSdkProvider>
      </SidebarProvider>
      <Toaster />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );
}
