import { redirect } from "next/navigation";
import { getProfile } from "@/actions/profile";
import { SidebarInset } from "@/components/ui/sidebar";
import { getUser } from "@/actions/auth";
import { DashboardLayoutClient } from "./components";

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

  return (
    <>
      <DashboardLayoutClient profilePromise={profilePromise} />
      <SidebarInset className="flex flex-col h-[100dvh] max-h-[100dvh]">
        {children}
      </SidebarInset>
    </>
  );
}
