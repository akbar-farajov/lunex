"use client";

import { useState, useEffect, useRef } from "react";

export type VoiceFlowStatus =
  | ""
  | "Listening..."
  | "Recording stopped."
  | "Submitting message..."
  | "Assistant is responding..."
  | "Response ready."
  | "Playing response..."
  | "Response playback stopped."
  | "Speech recognition failed."
  | "Microphone permission is required.";

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
      setVoiceStatus("Assistant is responding...");
    }

    if (wasStreaming && isNowReady) {
      setVoiceStatus("Response ready.");
    }

    prevChatStatusRef.current = chatStatus;
  }, [chatStatus]);

  return { voiceStatus, setVoiceStatus };
}
