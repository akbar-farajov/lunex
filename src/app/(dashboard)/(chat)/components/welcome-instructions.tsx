"use client";

import { FC } from "react";
import { Volume2Icon, SquareIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWelcomeSpeech } from "@/hooks/use-welcome-speech";

const WELCOME_TEXT =
  "Welcome. This platform is an accessible AI assistant designed to support visually impaired users. Use the text field to type your message. You can listen to responses using the voice button. In the next phase, speaking directly to the assistant will also be supported. Press the instruction button if you want to hear this guidance again.";

export const WelcomeInstructions: FC = () => {
  const { isSpeaking, isSupported, replay, stop } = useWelcomeSpeech({
    text: WELCOME_TEXT,
    lang: "az-AZ",
    autoPlay: true,
  });

  if (!isSupported) return null;

  return (
    <div
      role="region"
      aria-label="Welcome instructions"
      className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30"
    >
      <span className="sr-only">
        {isSpeaking
          ? "Instructions are being spoken"
          : "Press the instruction button to listen to the instructions"}
      </span>

      {isSpeaking ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={stop}
          aria-label="Stop instructions "
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <SquareIcon className="size-4" />
          <span className="text-xs hidden sm:inline">Stop instructions</span>
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={replay}
          aria-label="Listen to instructions again"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcwIcon className="size-4" />
          <span className="text-xs hidden sm:inline">Listen to instructions again</span>
        </Button>
      )}

      {isSpeaking && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Volume2Icon className="size-3.5 animate-pulse" aria-hidden="true" />
          <span className="hidden sm:inline">Speaking…</span>
        </span>
      )}

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isSpeaking ? "Instructions are being spoken" : ""}
      </div>
    </div>
  );
};
