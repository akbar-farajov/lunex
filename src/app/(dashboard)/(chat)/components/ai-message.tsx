"use client";

import { FC, memo } from "react";
import { GlobeIcon, PaperclipIcon } from "lucide-react";
import Image from "next/image";
import { Message } from "@/components/ai-elements/message";
import { MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { ChatMessage } from "@/lib/types";
import { GetWeatherTool } from "./get-weather-tool";
import { AIMessageActions } from "./ai-message-actions";

interface PureAIMessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export const PureAIMessage: FC<PureAIMessageProps> = ({
  message,
  isStreaming = false,
}) => {
  const textContent = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("\n");

  return (
    <Message
      from={message.role}
      className="group flex flex-col gap-2 items-start"
    >
      <MessageContent variant="flat">
        {message.parts.map((part, partIndex) => {
          switch (part.type) {
            case "text":
              return (
                <Response key={`${message.id}-${partIndex}-text`}>
                  {part.text}
                </Response>
              );
            case "tool-getWeather":
              return (
                <Tool key={`${message.id}-${partIndex}-tool-getWeather`}>
                  <ToolHeader type={part.type} state={part.state} />
                  <ToolContent>
                    <ToolInput input={part.input} />
                    {part.state === "output-available" && (
                      <ToolOutput
                        errorText={part.errorText}
                        output={<GetWeatherTool data={part.output} />}
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            case "tool-google_search":
              return (
                <div
                  key={`${message.id}-${partIndex}-tool-google_search`}
                  className="flex items-center gap-2 text-sm text-muted-foreground py-1.5"
                  role="status"
                >
                  <GlobeIcon className="size-4" aria-hidden="true" />
                  {part.state === "output-available"
                    ? "Searched the web"
                    : "Searching the web\u2026"}
                </div>
              );
            case "tool-imageGeneration":
              return (
                <>
                  {part.state === "output-available" && part.output && (
                    <div className="flex justify-center w-full mt-4">
                      <Image
                        src={`data:image/png;base64,${part.output}`}
                        alt="Generated Image"
                        width={512}
                        height={512}
                        className="rounded-lg shadow-lg max-w-full h-auto"
                      />
                    </div>
                  )}
                </>
              );

            case "file":
              if (part.mediaType.startsWith("image/")) {
                return (
                  <Image
                    key={`${message.id}-${partIndex}-image`}
                    src={part.url}
                    alt={part.filename || "File"}
                    width={100}
                    height={100}
                  />
                );
              }
              return (
                <div
                  key={`${message.id}-${partIndex}-file`}
                  className="flex items-center gap-2"
                >
                  <PaperclipIcon className="size-4" />
                  {part.filename || "File"}
                </div>
              );
          }
        })}
      </MessageContent>
      {!isStreaming && (
        <AIMessageActions messageId={message.id} textContent={textContent} />
      )}
    </Message>
  );
};

export const AIMessage = memo(PureAIMessage);
