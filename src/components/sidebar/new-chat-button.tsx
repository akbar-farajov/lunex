"use client";
import { SquarePenIcon } from "lucide-react";
import Link from "next/link";
import { SidebarMenuButton } from "../ui/sidebar";

export const NewChatButton = () => {
  return (
    <SidebarMenuButton asChild tooltip="New Chat">
      <Link href="/">
        <SquarePenIcon />
        <span>New Chat</span>
      </Link>
    </SidebarMenuButton>
  );
};
