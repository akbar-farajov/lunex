"use client";

import { FC, memo, useState, useCallback } from "react";
import {
  CheckIcon,
  CopyIcon,
  RefreshCcwIcon,
  Volume2Icon,
  SquareIcon,
  Loader2Icon,
} from "lucide-react";
import { Action } from "@/components/ai-elements/actions";
import { Actions } from "@/components/ai-elements/actions";
import { useChatActions } from "@ai-sdk-tools/store";
import { useVoicePlayback } from "@/hooks/use-voice-playback";
import { AZ } from "@/lib/az-strings";

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
  const { isPlaying, isLoading, play, stop } = useVoicePlayback();

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
    if (isPlaying || isLoading) {
      stop();
    } else {
      play(textContent);
    }
  }, [isPlaying, isLoading, textContent, play, stop]);

  const handleRegenerate = useCallback(() => {
    regenerate({ messageId });
  }, [regenerate, messageId]);

  const onCopyClick = useCallback(() => {
    handleCopy(textContent, messageId);
  }, [handleCopy, textContent, messageId]);

  const isActive = isPlaying || isLoading;
  const speakLabel = isActive ? AZ.actions.stopListening : AZ.actions.listen;

  return (
    <Actions
      className="flex justify-start w-full opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
      role="toolbar"
      aria-label="Mesaj əməliyyatları"
    >
      <Action label={AZ.actions.copy} tooltip={AZ.actions.copy} variant="ghost" onClick={onCopyClick}>
        {copiedId === messageId ? (
          <CheckIcon className="size-5" />
        ) : (
          <CopyIcon className="size-5" />
        )}
      </Action>
      <Action
        label={speakLabel}
        tooltip={speakLabel}
        variant="ghost"
        onClick={handleSpeak}
      >
        {isLoading ? (
          <Loader2Icon className="size-5 animate-spin" />
        ) : isPlaying ? (
          <SquareIcon className="size-5" />
        ) : (
          <Volume2Icon className="size-5" />
        )}
      </Action>
      <Action
        label={AZ.actions.regenerate}
        tooltip={AZ.actions.regenerate}
        variant="ghost"
        onClick={handleRegenerate}
      >
        <RefreshCcwIcon className="size-5" />
      </Action>
    </Actions>
  );
};

export const AIMessageActions = memo(PureAIMessageActions);
