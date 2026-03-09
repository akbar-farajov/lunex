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
import { FC, memo, useRef, useEffect } from "react";
import { ChatModelSelector } from "./chat-model-selector";

interface PureChatComposerProps {
  onSubmit: (data: PromptInputMessage) => void;
  setInput: (input: string) => void;
  input: string;
  isCreatingChat?: boolean;
  onModelChange?: (modelId: string) => void;
  selectedModel?: string;
  handleStop: () => void;
}

export const PureChatComposer: FC<PureChatComposerProps> = ({
  setInput,
  input,
  onSubmit,
  isCreatingChat = false,
  onModelChange,
  selectedModel,
  handleStop,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatStatus = useChatStatus();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <PromptInput
      onSubmit={onSubmit}
      multiple={true}
      className="w-full max-w-3xl mx-auto mb-4 shadow-xs bg-background rounded-lg border-none"
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
          {/* <ChatModelSelector
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          /> */}
        </PromptInputTools>
        <PromptInputSubmit
          disabled={!input.trim() && chatStatus !== "streaming"}
          status={isCreatingChat ? "submitted" : chatStatus}
          onStop={handleStop}
        />
      </PromptInputFooter>
    </PromptInput>
  );
};

export const ChatComposer = memo(PureChatComposer, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) {
    return false;
  }
  if (prevProps.selectedModel !== nextProps.selectedModel) {
    return false;
  }
  if (prevProps.isCreatingChat !== nextProps.isCreatingChat) {
    return false;
  }

  return true;
});
