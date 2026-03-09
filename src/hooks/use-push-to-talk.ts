"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export type PushToTalkEvent =
  | "listening"
  | "stopped"
  | "submitting"
  | "idle"
  | "error";

interface UsePushToTalkOptions {
  onSubmit: (text: string) => void;
  onStatusChange?: (event: PushToTalkEvent, error?: string | null) => void;
  lang?: string;
}

interface UsePushToTalkReturn {
  isSupported: boolean;
  isListening: boolean;
  isProcessing: boolean;
  interimTranscript: string;
  error: string | null;
  errorMessage: string | null;
  startListening: () => void;
  stopListening: () => void;
}

export function usePushToTalk({
  onSubmit,
  onStatusChange,
  lang = "en-US",
}: UsePushToTalkOptions): UsePushToTalkReturn {
  const {
    isSupported,
    status,
    isListening,
    transcript,
    interimTranscript,
    error,
    errorMessage,
    start,
    stop,
    reset,
  } = useSpeechRecognition({
    lang,
    continuous: true,
    interimResults: true,
  });

  const pendingSubmitRef = useRef(false);
  const onSubmitRef = useRef(onSubmit);
  const onStatusChangeRef = useRef(onStatusChange);
  onSubmitRef.current = onSubmit;
  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    switch (status) {
      case "listening":
        onStatusChangeRef.current?.("listening");
        break;
      case "processing":
        onStatusChangeRef.current?.("stopped");
        break;
      case "error":
        onStatusChangeRef.current?.("error", error);
        break;
    }
  }, [status, error]);

  useEffect(() => {
    if (status !== "idle" || !transcript || pendingSubmitRef.current) return;

    const trimmed = transcript.trim();
    if (!trimmed) return;

    pendingSubmitRef.current = true;
    onStatusChangeRef.current?.("submitting");
    onSubmitRef.current(trimmed);
    reset();

    setTimeout(() => {
      pendingSubmitRef.current = false;
    }, 500);
  }, [status, transcript, reset]);

  const startListening = useCallback(() => {
    if (pendingSubmitRef.current) return;
    start();
  }, [start]);

  const stopListening = useCallback(() => {
    if (isListening) stop();
  }, [isListening, stop]);

  return {
    isSupported,
    isListening,
    isProcessing: status === "processing",
    interimTranscript,
    error,
    errorMessage,
    startListening,
    stopListening,
  };
}
