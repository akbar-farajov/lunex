"use client";
import { useChatStatus } from "@ai-sdk-tools/store";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputActionAddAttachments,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { memo, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  PushToTalkButton,
  type PushToTalkButtonHandle,
} from "./push-to-talk-button";
import type { PushToTalkEvent } from "@/hooks/use-push-to-talk";

interface ChatComposerProps {
  onSubmit: (data: PromptInputMessage) => void;
  onVoiceSubmit: (text: string) => void;
  onVoiceStatusChange?: (event: PushToTalkEvent, error?: string | null) => void;
  setInput: (input: string) => void;
  input: string;
  isCreatingChat?: boolean;
  onModelChange?: (modelId: string) => void;
  selectedModel?: string;
  handleStop: () => void;
}

export interface ChatComposerHandle {
  focusInput: () => void;
  toggleRecording: () => void;
}

const ChatComposerInner = forwardRef<ChatComposerHandle, ChatComposerProps>(
  function ChatComposerInner(
    {
      setInput,
      input,
      onSubmit,
      onVoiceSubmit,
      onVoiceStatusChange,
      isCreatingChat = false,
      handleStop,
    },
    ref
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const pushToTalkRef = useRef<PushToTalkButtonHandle>(null);
    const chatStatus = useChatStatus();

    useImperativeHandle(ref, () => ({
      focusInput: () => textareaRef.current?.focus(),
      toggleRecording: () => pushToTalkRef.current?.toggle(),
    }));

    useEffect(() => {
      textareaRef.current?.focus();
    }, []);

    const isActive =
      chatStatus === "streaming" ||
      chatStatus === "submitted" ||
      isCreatingChat;

    return (
      <PromptInput
        onSubmit={onSubmit}
        multiple={true}
        className="w-full max-w-3xl mx-auto mb-4 shadow-xs bg-background rounded-lg border-none text-base"
      >
        <PromptInputBody className="w-full flex flex-row items-center justify-between">
          <div className="flex w-full flex-col items-start justify-start">
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setInput(e.currentTarget.value)}
              value={input}
              ref={textareaRef}
            />
          </div>
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PushToTalkButton
              ref={pushToTalkRef}
              onSubmit={onVoiceSubmit}
              onStatusChange={onVoiceStatusChange}
              disabled={isActive}
            />
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!input.trim() && chatStatus !== "streaming"}
            status={isCreatingChat ? "submitted" : chatStatus}
            onStop={handleStop}
          />
        </PromptInputFooter>
      </PromptInput>
    );
  }
);

export const ChatComposer = memo(
  ChatComposerInner,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.selectedModel !== nextProps.selectedModel) return false;
    if (prevProps.isCreatingChat !== nextProps.isCreatingChat) return false;
    return true;
  }
);
