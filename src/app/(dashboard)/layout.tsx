import { redirect } from "next/navigation";
import { getProfile } from "@/actions/profile";
import { SidebarInset } from "@/components/ui/sidebar";
import { getUser } from "@/actions/auth";
import { DashboardLayoutClient } from "./components";
import { DashboardProviders } from "./dashboard-providers";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profilePromise = getProfile().then((res) => res.data);

  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarState?.value === "true";

  return (
    <DashboardProviders defaultOpen={defaultOpen}>
      <DashboardLayoutClient profilePromise={profilePromise} />
      <SidebarInset className="flex flex-col h-[100dvh] max-h-[100dvh]">
        {children}
      </SidebarInset>
    </DashboardProviders>
  );
}
