"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Volume2Icon, SquareIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWelcomeSpeech } from "@/hooks/use-welcome-speech";

const INSTRUCTION_TEXT =
  "Welcome. This platform is an accessible AI assistant designed to support visually impaired users. Press Alt plus I to hear these instructions again. Press Alt plus R to start or stop recording a voice message. Press Alt plus P to hear the latest assistant response. Press Alt plus X to stop speech playback. Press Alt plus S to move to the message input. You can also use the visible buttons on the page for each action.";

const STATUS_LABELS: Record<string, string> = {
  ready: "Instructions ready.",
  playing: "Playing instructions...",
  stopped: "Instructions stopped.",
  failed: "Instruction playback failed.",
  unsupported: "Speech synthesis is not supported in this browser.",
};

export interface WelcomeInstructionsHandle {
  play: () => void;
  stop: () => void;
}

export const WelcomeInstructions = forwardRef<WelcomeInstructionsHandle>(
  function WelcomeInstructions(_, ref) {
    const { status, isSpeaking, isSupported, play, stop } = useWelcomeSpeech({
      text: INSTRUCTION_TEXT,
    });

    useImperativeHandle(ref, () => ({ play, stop }), [play, stop]);

    if (!isSupported) return null;

    return (
      <div
        role="region"
        aria-label="Onboarding instructions"
        className="flex items-center gap-3 px-4 py-2 border-b bg-muted/30"
      >
        <InfoIcon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />

        <span className="text-xs text-muted-foreground hidden sm:inline">
          Listen to a quick guide before using the assistant.
        </span>

        {isSpeaking ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={stop}
              aria-label="Stop instructions"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <SquareIcon className="size-4" />
              <span className="text-xs">Stop instructions</span>
            </Button>

            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Volume2Icon
                className="size-3.5 animate-pulse"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Playing...</span>
            </span>
          </>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={play}
            aria-label="Listen to instructions (Alt+I)"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Volume2Icon className="size-4" />
            <span className="text-xs">Listen to instructions</span>
          </Button>
        )}

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {STATUS_LABELS[status] ?? ""}
        </div>
      </div>
    );
  }
);
