"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "welcome-speech-played";

interface UseWelcomeSpeechOptions {
  text: string;
  lang?: string;
  autoPlay?: boolean;
}

interface UseWelcomeSpeechReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  hasPlayed: boolean;
  replay: () => void;
  stop: () => void;
}

export function useWelcomeSpeech({
  text,
  lang = "en-US",
  autoPlay = true,
}: UseWelcomeSpeechOptions): UseWelcomeSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const didAutoPlayRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsSupported("speechSynthesis" in window);
    setHasPlayed(sessionStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const speakText = useCallback(() => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const azVoice = voices.find((v) => v.lang.startsWith("az"));
    if (azVoice) utterance.voice = azVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);

    sessionStorage.setItem(STORAGE_KEY, "true");
    setHasPlayed(true);
  }, [text, lang, isSupported]);

  useEffect(() => {
    if (!autoPlay || !isSupported || didAutoPlayRef.current) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "true") return;

    didAutoPlayRef.current = true;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speakText();
    } else {
      const onVoicesChanged = () => {
        speakText();
        window.speechSynthesis.onvoiceschanged = null;
      };
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
    }
  }, [autoPlay, isSupported, speakText]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const replay = useCallback(() => {
    speakText();
  }, [speakText]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { isSpeaking, isSupported, hasPlayed, replay, stop };
}
