"use client";

import { FC, memo, useState, useCallback } from "react";
import {
  CheckIcon,
  CopyIcon,
  RefreshCcwIcon,
  Volume2Icon,
  SquareIcon,
} from "lucide-react";
import { Action } from "@/components/ai-elements/actions";
import { Actions } from "@/components/ai-elements/actions";
import { useChatActions } from "@ai-sdk-tools/store";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { cleanTextForSpeech } from "@/lib/text-utils";

interface AIMessageActionsProps {
  messageId: string;
  textContent: string;
}

const PureAIMessageActions: FC<AIMessageActionsProps> = ({
  messageId,
  textContent,
}) => {
  const { regenerate } = useChatActions();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isSpeaking, speak, stop } = useSpeechSynthesis();

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }, []);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      stop();
    } else {
      const cleanedText = cleanTextForSpeech(textContent);
      speak(cleanedText);
    }
  }, [isSpeaking, textContent, speak, stop]);

  const handleRegenerate = useCallback(() => {
    regenerate({ messageId });
  }, [regenerate, messageId]);

  const onCopyClick = useCallback(() => {
    handleCopy(textContent, messageId);
  }, [handleCopy, textContent, messageId]);

  const speakLabel = isSpeaking ? "Stop response" : "Listen to response";

  return (
    <Actions
      className="flex justify-start w-full opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
      role="toolbar"
      aria-label="Message actions"
    >
      <Action label="Copy" tooltip="Copy" variant="ghost" onClick={onCopyClick}>
        {copiedId === messageId ? (
          <CheckIcon className="size-4" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </Action>
      <Action
        label={speakLabel}
        tooltip={speakLabel}
        variant="ghost"
        onClick={handleSpeak}
      >
        {isSpeaking ? (
          <SquareIcon className="size-4" />
        ) : (
          <Volume2Icon className="size-4" />
        )}
      </Action>
      <Action
        label="Regenerate"
        tooltip="Regenerate"
        variant="ghost"
        onClick={handleRegenerate}
      >
        <RefreshCcwIcon className="size-4" />
      </Action>
    </Actions>
  );
};

export const AIMessageActions = memo(PureAIMessageActions);
