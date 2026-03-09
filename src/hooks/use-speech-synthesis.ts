"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type SpeechPlaybackStatus =
  | "idle"
  | "speaking"
  | "blocked"
  | "unsupported";

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  status: SpeechPlaybackStatus;
  selectedVoice: SpeechSynthesisVoice | null;
  speak: (text: string) => void;
  stop: () => void;
}

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices();
}

function isSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [status, setStatus] = useState<SpeechPlaybackStatus>(
    isSupported() ? "idle" : "unsupported"
  );
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!isSupported()) return;

    const loadVoices = () => {
      const voices = getVoices();
      if (voices.length > 0 && !selectedVoice) {
        const english = voices.find((v) => v.lang.startsWith("en") && v.default);
        setSelectedVoice(english ?? voices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  useEffect(() => {
    return () => {
      if (isSupported()) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported()) return;

      window.speechSynthesis.cancel();
      utteranceRef.current = null;

      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) utterance.voice = selectedVoice;

      utteranceRef.current = utterance;

      utterance.onstart = () => setStatus("speaking");

      utterance.onend = () => {
        setStatus("idle");
        utteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        if (e.error === "interrupted" || e.error === "canceled") {
          setStatus("idle");
        } else {
          setStatus("blocked");
        }
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice]
  );

  const stop = useCallback(() => {
    if (!isSupported()) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
    utteranceRef.current = null;
  }, []);

  return {
    isSpeaking: status === "speaking",
    status,
    selectedVoice,
    speak,
    stop,
  };
}
