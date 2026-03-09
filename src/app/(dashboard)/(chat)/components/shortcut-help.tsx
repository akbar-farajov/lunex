"use client";

import { FC } from "react";
import { KeyboardIcon } from "lucide-react";
import { SHORTCUTS } from "@/hooks/use-keyboard-shortcuts";

export const ShortcutHelp: FC = () => (
  <div
    role="region"
    aria-label="Keyboard shortcuts"
    className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 border-b bg-muted/10 text-xs text-muted-foreground"
  >
    <span className="flex items-center gap-1.5 font-medium shrink-0">
      <KeyboardIcon className="size-3" aria-hidden="true" />
      Shortcuts
    </span>
    {SHORTCUTS.map(({ key, label }) => (
      <span key={key} className="shrink-0">
        <kbd className="inline-block px-1 py-0.5 rounded bg-muted text-[10px] font-mono leading-none">
          Alt+{key}
        </kbd>{" "}
        {label}
      </span>
    ))}
  </div>
);
