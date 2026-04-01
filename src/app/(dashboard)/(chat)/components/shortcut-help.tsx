"use client";

import { FC } from "react";
import { KeyboardIcon } from "lucide-react";
import { SHORTCUTS } from "@/hooks/use-keyboard-shortcuts";
import { AZ } from "@/lib/az-strings";

export const ShortcutHelp: FC = () => (
  <div
    role="region"
    aria-label="Klaviatura qısayolları"
    className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-5 py-2.5 border-b bg-muted/10 text-sm text-muted-foreground"
  >
    <span className="flex items-center gap-2 font-medium shrink-0">
      <KeyboardIcon className="size-4" aria-hidden="true" />
      {AZ.shortcuts.label}
    </span>
    {SHORTCUTS.map(({ key, label }) => (
      <span key={key} className="shrink-0">
        <kbd className="inline-block px-1.5 py-1 rounded bg-muted text-xs font-mono leading-none">
          Alt+{key}
        </kbd>{" "}
        {label}
      </span>
    ))}
  </div>
);
