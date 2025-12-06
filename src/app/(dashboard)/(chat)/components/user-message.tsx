"use client";

import { FC, memo } from "react";
import { Message } from "@/components/ai-elements/message";
import { MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { ChatMessage } from "@/lib/types";
import Image from "next/image";
import { UserMessageActions } from "./user-message-actions";

interface PureUserMessageProps {
  message: ChatMessage;
}

export const PureUserMessage: FC<PureUserMessageProps> = ({ message }) => {
  const textContent = message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("\n");

  return (
    <Message from={message.role} className="group flex flex-col gap-2">
      {message.parts.map((part, partIndex) => {
        switch (part.type) {
          case "text":
            return (
              <MessageContent
                variant="flat"
                key={`${message.id}-${partIndex}-text`}
              >
                <Response>{part.text}</Response>
              </MessageContent>
            );
          case "file":
            if (part.mediaType.startsWith("image/")) {
              return (
                <MessageContent
                  variant="flat"
                  key={`${message.id}-${partIndex}-image`}
                >
                  <Image
                    key={`${message.id}-${partIndex}-image`}
                    src={part.url}
                    alt={part.filename || "File"}
                    width={100}
                    height={100}
                  />
                </MessageContent>
              );
            }
            return (
              <div key={`${message.id}-${partIndex}-file`}>{part.filename}</div>
            );
        }
      })}
      <UserMessageActions messageId={message.id} textContent={textContent} />
    </Message>
  );
};

export const UserMessage = memo(PureUserMessage);
