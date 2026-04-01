"use client";

import { useState, useEffect, useRef } from "react";
import { AZ } from "@/lib/az-strings";

export type VoiceFlowStatus =
  | ""
  | typeof AZ.voiceStatus.listening
  | typeof AZ.voiceStatus.recordingStopped
  | typeof AZ.voiceStatus.submitting
  | typeof AZ.voiceStatus.responding
  | typeof AZ.voiceStatus.responseReady
  | typeof AZ.voiceStatus.playingResponse
  | typeof AZ.voiceStatus.playbackStopped
  | typeof AZ.voiceStatus.recognitionFailed
  | typeof AZ.voiceStatus.micPermission;

interface UseVoiceFlowOptions {
  chatStatus: string;
}

interface UseVoiceFlowReturn {
  voiceStatus: VoiceFlowStatus;
  setVoiceStatus: React.Dispatch<React.SetStateAction<VoiceFlowStatus>>;
}

export function useVoiceFlow({
  chatStatus,
}: UseVoiceFlowOptions): UseVoiceFlowReturn {
  const [voiceStatus, setVoiceStatus] = useState<VoiceFlowStatus>("");
  const prevChatStatusRef = useRef(chatStatus);

  useEffect(() => {
    const prev = prevChatStatusRef.current;
    const wasStreaming = prev === "streaming" || prev === "submitted";
    const isNowReady = chatStatus === "ready" || chatStatus === "idle";

    if (chatStatus === "submitted") {
      setVoiceStatus(AZ.voiceStatus.responding);
    }

    if (wasStreaming && isNowReady) {
      setVoiceStatus(AZ.voiceStatus.responseReady);
    }

    prevChatStatusRef.current = chatStatus;
  }, [chatStatus]);

  return { voiceStatus, setVoiceStatus };
}
