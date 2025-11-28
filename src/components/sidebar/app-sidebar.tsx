"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { Profile } from "@/lib/types";
import { FC } from "react";
import { NewChatButton } from "./new-chat-button";
import { AppSidebarHeader } from "./sidebar-header";
import { NavChatsWrapper } from "./nav-chats-wrapper";
import { NavUserWrapper } from "./nav-user-wrapper";
import { Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppSidebarProps {
  currentTitle?: string;
  profilePromise: Promise<Profile | null>;
}

export const AppSidebar: FC<AppSidebarProps> = ({
  currentTitle,
  profilePromise,
}) => {
  const pathname = usePathname();
  const isRecentsActive = pathname === "/recents";

  return (
    <Sidebar collapsible="icon" variant="floating">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <NewChatButton />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Chats"
                isActive={isRecentsActive}
              >
                <Link href="/recents">
                  <MessageSquare />
                  <span>Chats</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <NavChatsWrapper currentTitle={currentTitle} />
      </SidebarContent>
      <SidebarFooter>
        <NavUserWrapper profilePromise={profilePromise} />
      </SidebarFooter>
    </Sidebar>
  );
};
