"use client";

import { useEffect, useRef } from "react";
import { AZ } from "@/lib/az-strings";

export interface ShortcutEntry {
  key: string;
  label: string;
}

export const SHORTCUTS: ShortcutEntry[] = [
  { key: "I", label: AZ.shortcuts.instructions },
  { key: "R", label: AZ.shortcuts.record },
  { key: "P", label: AZ.shortcuts.playResponse },
  { key: "X", label: AZ.shortcuts.stopSpeech },
  { key: "S", label: AZ.shortcuts.focusInput },
];

type ShortcutHandlerMap = Record<string, () => void>;

function isEditableTarget(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlerMap) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (isEditableTarget(e.target)) return;

      const key = e.key.toLowerCase();
      const handler = handlersRef.current[key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
