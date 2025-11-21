"use client";
import { SquarePenIcon } from "lucide-react";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { useRouter } from "next/navigation";

export const NewChatButton = () => {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  return (
    <SidebarMenuButton
      onClick={() => {
        setOpenMobile(false);
        router.push("/");
        router.refresh();
      }}
      type="button"
    >
      <SquarePenIcon />
      <span>New Chat</span>
    </SidebarMenuButton>
  );
};
