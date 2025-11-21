"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FC } from "react";

interface ChatBreadcrumbProps {
  chatTitle?: string;
}

export const ChatBreadcrumb: FC<ChatBreadcrumbProps> = ({ chatTitle }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {chatTitle ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Chat</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{chatTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>Chat</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
