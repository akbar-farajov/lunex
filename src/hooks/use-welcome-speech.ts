"use client";

import { useCallback } from "react";
import {
  useSpeechSynthesis,
  type SpeechPlaybackStatus,
} from "@/hooks/use-speech-synthesis";

export type InstructionStatus =
  | "ready"
  | "playing"
  | "stopped"
  | "failed"
  | "unsupported";

interface UseWelcomeSpeechOptions {
  text: string;
}

interface UseWelcomeSpeechReturn {
  status: InstructionStatus;
  isSpeaking: boolean;
  isSupported: boolean;
  play: () => void;
  stop: () => void;
}

function toInstructionStatus(s: SpeechPlaybackStatus): InstructionStatus {
  switch (s) {
    case "speaking":
      return "playing";
    case "blocked":
      return "failed";
    case "unsupported":
      return "unsupported";
    default:
      return "ready";
  }
}

export function useWelcomeSpeech({
  text,
}: UseWelcomeSpeechOptions): UseWelcomeSpeechReturn {
  const {
    status: playbackStatus,
    speak,
    stop: stopSpeech,
  } = useSpeechSynthesis();

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const status = toInstructionStatus(playbackStatus);

  const play = useCallback(() => {
    speak(text);
  }, [text, speak]);

  const stop = useCallback(() => {
    stopSpeech();
  }, [stopSpeech]);

  return {
    status,
    isSpeaking: status === "playing",
    isSupported,
    play,
    stop,
  };
}
