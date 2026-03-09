"use client";

import { FC } from "react";
import { Volume2Icon, MicIcon } from "lucide-react";
import type { VoiceFlowStatus } from "@/hooks/use-auto-voice-flow";

interface VoiceStatusBarProps {
  voiceStatus: VoiceFlowStatus;
}

export const VoiceStatusBar: FC<VoiceStatusBarProps> = ({ voiceStatus }) => {
  if (!voiceStatus) return null;

  const icon =
    voiceStatus === "Listening..." ? (
      <MicIcon className="size-3 animate-pulse" aria-hidden="true" />
    ) : voiceStatus === "Playing response..." ? (
      <Volume2Icon className="size-3 animate-pulse" aria-hidden="true" />
    ) : null;

  return (
    <div
      role="region"
      aria-label="Voice status"
      className="flex items-center gap-2 px-4 py-1 border-b bg-muted/10"
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {voiceStatus}
      </span>

      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {voiceStatus}
      </div>
    </div>
  );
};
