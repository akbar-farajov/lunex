"use client";
import { SquarePenIcon } from "lucide-react";
import Link from "next/link";
import { SidebarMenuButton } from "../ui/sidebar";

export const NewChatButton = () => {
  return (
    <SidebarMenuButton asChild>
      <Link href="/">
        <SquarePenIcon />
        <span>New Chat</span>
      </Link>
    </SidebarMenuButton>
  );
};
