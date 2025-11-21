"use client";
import { SquarePenIcon } from "lucide-react";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";

export const NewChatButton = () => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuButton
      onClick={() => {
        setOpenMobile(false);
        window.location.href = "/";
      }}
      type="button"
    >
      <SquarePenIcon />
      <span>New Chat</span>
    </SidebarMenuButton>
  );
};
