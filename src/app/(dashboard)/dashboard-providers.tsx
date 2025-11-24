"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Provider as AiSdkProvider } from "@ai-sdk-tools/store";

export const DashboardProviders = ({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) => {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AiSdkProvider>{children}</AiSdkProvider>
    </SidebarProvider>
  );
};
