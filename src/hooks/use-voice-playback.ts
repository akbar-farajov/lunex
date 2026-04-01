"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cleanTextForSpeech } from "@/lib/text-utils";

export type VoicePlaybackStatus =
  | "idle"
  | "loading"
  | "playing"
  | "error";

interface UseVoicePlaybackReturn {
  status: VoicePlaybackStatus;
  isPlaying: boolean;
  isLoading: boolean;
  play: (text: string) => void;
  stop: () => void;
}

async function fetchElevenLabsAudio(
  text: string
): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

function browserSpeechFallback(
  text: string,
  onEnd: () => void,
  onError: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onError();
    return null;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = onEnd;
  utterance.onerror = (e) => {
    if (e.error !== "interrupted" && e.error !== "canceled") {
      onError();
    } else {
      onEnd();
    }
  };
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function useVoicePlayback(): UseVoicePlaybackReturn {
  const [status, setStatus] = useState<VoicePlaybackStatus>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    cleanup();
    setStatus("idle");
  }, [cleanup]);

  const play = useCallback(
    (rawText: string) => {
      stop();

      const text = cleanTextForSpeech(rawText);
      if (!text) return;

      const controller = new AbortController();
      abortRef.current = controller;

      setStatus("loading");

      fetchElevenLabsAudio(text).then((buffer) => {
        if (controller.signal.aborted) return;

        if (buffer) {
          const blob = new Blob([buffer], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          objectUrlRef.current = url;

          const audio = new Audio(url);
          audioRef.current = audio;

          audio.onplay = () => {
            if (!controller.signal.aborted) setStatus("playing");
          };
          audio.onended = () => {
            if (!controller.signal.aborted) setStatus("idle");
            cleanup();
          };
          audio.onerror = () => {
            if (!controller.signal.aborted) setStatus("error");
            cleanup();
          };

          audio.play().catch(() => {
            if (!controller.signal.aborted) {
              browserSpeechFallback(
                text,
                () => !controller.signal.aborted && setStatus("idle"),
                () => !controller.signal.aborted && setStatus("error")
              );
              setStatus("playing");
            }
          });
        } else {
          browserSpeechFallback(
            text,
            () => !controller.signal.aborted && setStatus("idle"),
            () => !controller.signal.aborted && setStatus("error")
          );
          if (!controller.signal.aborted) setStatus("playing");
        }
      });
    },
    [stop, cleanup]
  );

  return {
    status,
    isPlaying: status === "playing",
    isLoading: status === "loading",
    play,
    stop,
  };
}
