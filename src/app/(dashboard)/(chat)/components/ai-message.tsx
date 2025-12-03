"use client";

import { FC, memo, useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  PaperclipIcon,
  RefreshCcwIcon,
  Volume2Icon,
  SquareIcon,
} from "lucide-react";
import Image from "next/image";
import { Message } from "@/components/ai-elements/message";
import { MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Action } from "@/components/ai-elements/actions";
import { Actions } from "@/components/ai-elements/actions";
import { useChatActions } from "@ai-sdk-tools/store";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { ChatMessage } from "@/lib/types";
import { GetWeatherTool } from "./get-weather-tool";
import { Button } from "@/components/ui/button";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { cleanTextForSpeech } from "@/lib/text-utils";

interface PureAIMessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export const PureAIMessage: FC<PureAIMessageProps> = ({
  message,
  isStreaming = false,
}) => {
  const { regenerate } = useChatActions();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isSpeaking, speak, stop } = useSpeechSynthesis();

  const textContent = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("\n");

  const handleCopy = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      const cleanedText = cleanTextForSpeech(textContent);
      speak(cleanedText);
    }
  };

  const handleRegenerate = () => {
    regenerate({ messageId: message.id });
  };

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
        <Actions className="flex justify-start w-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Action
            label="Copy"
            tooltip="Copy"
            variant="ghost"
            onClick={() => handleCopy(textContent, message.id)}
          >
            {copiedId === message.id ? (
              <CheckIcon className="size-4" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Action>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSpeak}
            className="size-8 rounded-lg text-muted-foreground"
          >
            {isSpeaking ? (
              <SquareIcon className="size-4" />
            ) : (
              <Volume2Icon className="size-4" />
            )}
          </Button>
          <Action
            label="Regenerate"
            tooltip="Regenerate"
            variant="ghost"
            onClick={handleRegenerate}
          >
            <RefreshCcwIcon className="size-4" />
          </Action>
        </Actions>
      )}
    </Message>
  );
};

export const AIMessage = memo(PureAIMessage);
