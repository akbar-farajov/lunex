"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type SpeechRecognitionStatus =
  | "idle"
  | "listening"
  | "processing"
  | "error"
  | "unsupported";

export type SpeechRecognitionError =
  | "not-allowed"
  | "no-speech"
  | "network"
  | "aborted"
  | "unsupported"
  | "unknown";

const ERROR_MESSAGES: Record<SpeechRecognitionError, string> = {
  "not-allowed": "Microphone permission is required.",
  "no-speech": "No speech was detected. Please try again.",
  network: "A network error occurred during speech recognition.",
  aborted: "Speech recognition was cancelled.",
  unsupported: "Speech recognition is not supported in this browser.",
  unknown: "An unexpected error occurred.",
};

interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript?: (transcript: string) => void;
  onFinalTranscript?: (transcript: string) => void;
}

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  status: SpeechRecognitionStatus;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: SpeechRecognitionError | null;
  errorMessage: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
  onend: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
  onaudiostart: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
  onspeechend: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: BrowserSpeechRecognition, ev: BrowserSpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: BrowserSpeechRecognition, ev: BrowserSpeechRecognitionErrorEvent) => void)
    | null;
}

interface BrowserSpeechRecognitionEvent extends Event {
  results: {
    readonly length: number;
    [index: number]: {
      readonly length: number;
      [index: number]: { transcript: string; confidence: number };
      isFinal: boolean;
    };
  };
  resultIndex: number;
}

interface BrowserSpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

function getSpeechRecognitionConstructor(): (new () => BrowserSpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition ??
    (window as any).webkitSpeechRecognition ??
    null
  );
}

function mapBrowserError(error: string): SpeechRecognitionError {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "not-allowed";
    case "no-speech":
      return "no-speech";
    case "network":
      return "network";
    case "aborted":
      return "aborted";
    default:
      return "unknown";
  }
}

export function useSpeechRecognition({
  lang = "en-US",
  continuous = false,
  interimResults = true,
  onTranscript,
  onFinalTranscript,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [status, setStatus] = useState<SpeechRecognitionStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<SpeechRecognitionError | null>(null);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const isStoppingRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  const onFinalTranscriptRef = useRef(onFinalTranscript);

  onTranscriptRef.current = onTranscript;
  onFinalTranscriptRef.current = onFinalTranscript;

  useEffect(() => {
    const Ctor = getSpeechRecognitionConstructor();
    setIsSupported(!!Ctor);
    if (!Ctor) {
      setStatus("unsupported");
    }
  }, []);

  const createRecognition = useCallback(() => {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) return null;

    const instance = new Ctor();
    instance.lang = lang;
    instance.continuous = continuous;
    instance.interimResults = interimResults;

    instance.onstart = () => {
      setStatus("listening");
      setError(null);
    };

    instance.onspeechend = () => {
      if (!continuous) {
        setStatus("processing");
      }
    };

    instance.onresult = (event: BrowserSpeechRecognitionEvent) => {
      let final = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript((prev) => {
          const next = prev + (prev ? " " : "") + final;
          onTranscriptRef.current?.(next);
          onFinalTranscriptRef.current?.(final);
          return next;
        });
        setInterimTranscript("");
      } else {
        setInterimTranscript(interim);
      }
    };

    instance.onerror = (event: BrowserSpeechRecognitionErrorEvent) => {
      const mapped = mapBrowserError(event.error);
      if (mapped === "aborted" && isStoppingRef.current) return;
      setError(mapped);
      setStatus("error");
    };

    instance.onend = () => {
      if (isStoppingRef.current) {
        isStoppingRef.current = false;
      }
      setStatus((prev) => (prev === "error" ? prev : "idle"));
      setInterimTranscript("");
    };

    return instance;
  }, [lang, continuous, interimResults]);

  const start = useCallback(() => {
    if (!isSupported) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // noop
      }
    }

    setTranscript("");
    setInterimTranscript("");
    setError(null);

    const instance = createRecognition();
    if (!instance) return;

    recognitionRef.current = instance;

    try {
      instance.start();
    } catch (e) {
      setError("unknown");
      setStatus("error");
    }
  }, [isSupported, createRecognition]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    isStoppingRef.current = true;
    try {
      recognitionRef.current.stop();
    } catch {
      // noop
    }
  }, []);

  const reset = useCallback(() => {
    if (recognitionRef.current) {
      isStoppingRef.current = true;
      try {
        recognitionRef.current.abort();
      } catch {
        // noop
      }
      recognitionRef.current = null;
    }
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    setStatus(isSupported ? "idle" : "unsupported");
  }, [isSupported]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // noop
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isSupported,
    status,
    isListening: status === "listening",
    transcript,
    interimTranscript,
    error,
    errorMessage: error ? ERROR_MESSAGES[error] : null,
    start,
    stop,
    reset,
  };
}
