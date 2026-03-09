"use client";

import { FC, memo, useState, useCallback } from "react";
import { CopyIcon, CheckIcon, PencilIcon } from "lucide-react";
import { Action } from "@/components/ai-elements/actions";
import { Actions } from "@/components/ai-elements/actions";

interface UserMessageActionsProps {
  messageId: string;
  textContent: string;
}

const PureUserMessageActions: FC<UserMessageActionsProps> = ({
  messageId,
  textContent,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }, []);

  const handleEdit = useCallback(() => {
    console.log("Edit functionality not yet implemented");
  }, []);

  const onCopyClick = useCallback(() => {
    handleCopy(textContent, messageId);
  }, [handleCopy, textContent, messageId]);

  return (
    <Actions
      className="flex justify-end w-full opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
      role="toolbar"
      aria-label="Message actions"
    >
      <Action label="Copy" tooltip="Copy" variant="ghost" onClick={onCopyClick}>
        {copiedId === messageId ? (
          <CheckIcon className="size-4" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </Action>
      <Action
        label="Edit"
        tooltip="Edit"
        variant="ghost"
        onClick={handleEdit}
        disabled
      >
        <PencilIcon className="size-4" />
      </Action>
    </Actions>
  );
};

export const UserMessageActions = memo(PureUserMessageActions);
