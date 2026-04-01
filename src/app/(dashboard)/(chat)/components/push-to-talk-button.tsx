"use client";

import { useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { MicIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePushToTalk,
  type PushToTalkEvent,
} from "@/hooks/use-push-to-talk";
import { AZ } from "@/lib/az-strings";

interface PushToTalkButtonProps {
  onSubmit: (text: string) => void;
  onStatusChange?: (event: PushToTalkEvent, error?: string | null) => void;
  disabled?: boolean;
}

export interface PushToTalkButtonHandle {
  toggle: () => void;
}

export const PushToTalkButton = forwardRef<
  PushToTalkButtonHandle,
  PushToTalkButtonProps
>(function PushToTalkButton(
  { onSubmit, onStatusChange, disabled = false },
  ref
) {
  const {
    isSupported,
    isListening,
    isProcessing,
    interimTranscript,
    error,
    errorMessage,
    startListening,
    stopListening,
  } = usePushToTalk({ onSubmit, onStatusChange });

  useImperativeHandle(
    ref,
    () => ({
      toggle: () => {
        if (isListening) stopListening();
        else startListening();
      },
    }),
    [isListening, startListening, stopListening]
  );

  const isHeldRef = useRef(false);

  const handlePointerDown = useCallback(() => {
    if (disabled) return;
    isHeldRef.current = true;
    startListening();
  }, [disabled, startListening]);

  const handleRelease = useCallback(() => {
    if (!isHeldRef.current) return;
    isHeldRef.current = false;
    stopListening();
  }, [stopListening]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== " " || e.repeat || disabled) return;
      e.preventDefault();
      isHeldRef.current = true;
      startListening();
    },
    [disabled, startListening]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== " ") return;
      e.preventDefault();
      if (!isHeldRef.current) return;
      isHeldRef.current = false;
      stopListening();
    },
    [stopListening]
  );

  if (!isSupported) return null;

  const showInterim = isListening && interimTranscript;

  const announcement = isListening
    ? AZ.pushToTalk.announcement.listening
    : isProcessing
      ? AZ.pushToTalk.announcement.processing
      : "";

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onPointerUp={handleRelease}
        onPointerCancel={handleRelease}
        onPointerLeave={handleRelease}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        aria-label={AZ.pushToTalk.ariaLabel}
        className={cn(
          "relative inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all select-none touch-none min-h-11",
          "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring",
          isListening
            ? "bg-destructive/10 text-destructive scale-[1.03]"
            : "bg-muted text-muted-foreground hover:bg-muted/80",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <MicIcon className={cn("size-5", isListening && "animate-pulse")} />
        {isListening
          ? AZ.pushToTalk.listening
          : isProcessing
            ? AZ.pushToTalk.processing
            : AZ.pushToTalk.holdToSpeak}
        {isListening && (
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-destructive animate-pulse" />
        )}
      </button>

      {showInterim && (
        <span
          className="max-w-48 truncate text-sm text-muted-foreground italic"
          aria-hidden="true"
        >
          {interimTranscript}
        </span>
      )}

      {error && errorMessage && (
        <span className="text-sm text-destructive" role="alert">
          {errorMessage}
        </span>
      )}

      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </div>
  );
});
