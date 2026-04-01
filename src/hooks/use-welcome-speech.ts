"use client";

import { useCallback } from "react";
import { useVoicePlayback, type VoicePlaybackStatus } from "@/hooks/use-voice-playback";

export type InstructionStatus =
  | "ready"
  | "loading"
  | "playing"
  | "stopped"
  | "failed";

interface UseWelcomeSpeechOptions {
  text: string;
}

interface UseWelcomeSpeechReturn {
  status: InstructionStatus;
  isSpeaking: boolean;
  isLoading: boolean;
  play: () => void;
  stop: () => void;
}

function toInstructionStatus(s: VoicePlaybackStatus): InstructionStatus {
  switch (s) {
    case "loading":
      return "loading";
    case "playing":
      return "playing";
    case "error":
      return "failed";
    default:
      return "ready";
  }
}

export function useWelcomeSpeech({
  text,
}: UseWelcomeSpeechOptions): UseWelcomeSpeechReturn {
  const { status: playbackStatus, play: playAudio, stop: stopAudio } =
    useVoicePlayback();

  const status = toInstructionStatus(playbackStatus);

  const play = useCallback(() => {
    playAudio(text);
  }, [text, playAudio]);

  const stop = useCallback(() => {
    stopAudio();
  }, [stopAudio]);

  return {
    status,
    isSpeaking: status === "playing",
    isLoading: status === "loading",
    play,
    stop,
  };
}
