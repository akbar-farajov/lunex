"use client";

import { FC } from "react";
import { Volume2Icon, MicIcon } from "lucide-react";
import type { VoiceFlowStatus } from "@/hooks/use-auto-voice-flow";
import { AZ } from "@/lib/az-strings";

interface VoiceStatusBarProps {
  voiceStatus: VoiceFlowStatus;
}

export const VoiceStatusBar: FC<VoiceStatusBarProps> = ({ voiceStatus }) => {
  if (!voiceStatus) return null;

  const icon =
    voiceStatus === AZ.voiceStatus.listening ? (
      <MicIcon className="size-4 animate-pulse" aria-hidden="true" />
    ) : voiceStatus === AZ.voiceStatus.playingResponse ? (
      <Volume2Icon className="size-4 animate-pulse" aria-hidden="true" />
    ) : null;

  return (
    <div
      role="region"
      aria-label="Səs vəziyyəti"
      className="flex items-center gap-3 px-5 py-2 border-b bg-muted/10"
    >
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
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
