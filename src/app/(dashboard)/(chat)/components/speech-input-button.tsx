"use client";

import { FC, useCallback, useEffect } from "react";
import { MicIcon, MicOffIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useSpeechRecognition,
  type SpeechRecognitionStatus,
} from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";

interface SpeechInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

const STATUS_ANNOUNCEMENTS: Record<SpeechRecognitionStatus, string> = {
  idle: "",
  listening: "Listening… Speak now.",
  processing: "Processing speech…",
  error: "",
  unsupported: "Speech recognition is not supported in this browser.",
};

export const SpeechInputButton: FC<SpeechInputButtonProps> = ({
  onTranscript,
  disabled = false,
  className,
}) => {
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
    lang: "en-US",
    continuous: false,
    interimResults: true,
  });

  const handleTranscriptReady = useCallback(
    (text: string) => {
      if (text.trim()) {
        onTranscript(text.trim());
      }
    },
    [onTranscript]
  );

  useEffect(() => {
    if (status === "idle" && transcript) {
      handleTranscriptReady(transcript);
      reset();
    }
  }, [status, transcript, handleTranscriptReady, reset]);

  const handleClick = useCallback(() => {
    if (isListening || status === "processing") {
      stop();
    } else {
      start();
    }
  }, [isListening, status, stop, start]);

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  if (!isSupported) return null;

  const buttonLabel = isListening
    ? "Stop speaking"
    : status === "processing"
      ? "Processing speech…"
      : "Start speaking";

  const tooltipText = isListening
    ? "Click to stop listening"
    : "Click to start speaking";

  const showInterim = isListening && interimTranscript;
  const showError = status === "error" && errorMessage;

  const announcement =
    STATUS_ANNOUNCEMENTS[status] || (error ? errorMessage : "");

  return (
    <div className={cn("relative flex items-center gap-1", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleClick}
              disabled={disabled}
              aria-label={buttonLabel}
              aria-pressed={isListening}
              className={cn(
                "relative transition-all duration-200",
                isListening &&
                  "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive",
                status === "processing" && "text-muted-foreground"
              )}
            >
              {status === "processing" ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : isListening ? (
                <MicOffIcon className="size-4" />
              ) : (
                <MicIcon className="size-4" />
              )}
              {isListening && (
                <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-destructive animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isListening && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={handleCancel}
          aria-label="Cancel speech input"
          className="text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-4" />
        </Button>
      )}

      {showInterim && (
        <span
          className="max-w-48 truncate text-xs text-muted-foreground italic"
          aria-hidden="true"
        >
          {interimTranscript}
        </span>
      )}

      {showError && (
        <span className="text-xs text-destructive" role="alert">
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
};
