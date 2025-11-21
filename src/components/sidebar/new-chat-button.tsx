"use client";
import { SquarePenIcon } from "lucide-react";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { useChatActions } from "@ai-sdk-tools/store";

export const NewChatButton = () => {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  const { reset, setId, setMessages } = useChatActions();

  const handleNewChat = () => {
    setOpenMobile(false);

    setId(undefined);
    setMessages([]);
    reset();

    router.push("/");
  };
  return (
    <SidebarMenuButton onClick={handleNewChat} type="button">
      <SquarePenIcon />
      <span>New Chat</span>
    </SidebarMenuButton>
  );
};
