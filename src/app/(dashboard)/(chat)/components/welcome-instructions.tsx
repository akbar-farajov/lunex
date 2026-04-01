"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Volume2Icon, SquareIcon, InfoIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWelcomeSpeech } from "@/hooks/use-welcome-speech";
import { AZ } from "@/lib/az-strings";

export interface WelcomeInstructionsHandle {
  play: () => void;
  stop: () => void;
}

export const WelcomeInstructions = forwardRef<WelcomeInstructionsHandle>(
  function WelcomeInstructions(_, ref) {
    const { status, isSpeaking, isLoading, play, stop } = useWelcomeSpeech({
      text: AZ.instructions,
    });

    useImperativeHandle(ref, () => ({ play, stop }), [play, stop]);

    const isActive = isSpeaking || isLoading;

    return (
      <div
        role="region"
        aria-label="Təlimatlar"
        className="flex items-center gap-4 px-5 py-3 border-b bg-muted/30"
      >
        <InfoIcon
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />

        <span className="text-sm text-muted-foreground hidden sm:inline leading-relaxed">
          {AZ.instructionBanner}
        </span>

        {isActive ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={stop}
              aria-label={AZ.stopInstructions}
              className="gap-2 text-sm text-muted-foreground hover:text-foreground min-h-10 px-4"
            >
              <SquareIcon className="size-5" />
              <span>{AZ.stopInstructions}</span>
            </Button>

            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              {isLoading ? (
                <Loader2Icon
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Volume2Icon
                  className="size-4 animate-pulse"
                  aria-hidden="true"
                />
              )}
              <span className="hidden sm:inline">{AZ.playing}</span>
            </span>
          </>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={play}
            aria-label={`${AZ.listenInstructions} (Alt+I)`}
            className="gap-2 text-sm text-muted-foreground hover:text-foreground min-h-10 px-4"
          >
            <Volume2Icon className="size-5" />
            <span>{AZ.listenInstructions}</span>
          </Button>
        )}

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {AZ.statusLabels[status] ?? ""}
        </div>
      </div>
    );
  }
);
