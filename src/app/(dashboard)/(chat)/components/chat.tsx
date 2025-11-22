"use client";
import { FC, useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk-tools/store";
import { Messages } from "@/app/(dashboard)/(chat)/components/messages";
import { ChatComposer } from "@/app/(dashboard)/(chat)/components/chat-composer";
import { DefaultChatTransport, LanguageModelUsage } from "ai";
import type { Profile } from "@/lib/types";
import { createChat } from "@/actions/chat";
import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { ChatMessage } from "@/lib/types";
import { generateUUID } from "@/lib/utils";
import { toast } from "sonner";
import { mutate } from "swr";
import { getChatHistoryKey } from "@/hooks/use-chats";
import { Header } from "@/app/(dashboard)/components";
import { ChatBreadcrumb } from "./chat-breadcrumb";
import { useRouter } from "next/navigation";

interface ChatProps {
  chatId?: string;
  initialMessages?: ChatMessage[];
  profile?: Profile;
  usage?: LanguageModelUsage;
  chatTitle?: string;
  initialModel?: string;
}

export const Chat: FC<ChatProps> = ({
  chatId: initialChatId,
  initialMessages = [],
  profile,
  usage,
  chatTitle,
  initialModel = "gemini-2.5-flash-lite",
}) => {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [title, setTitle] = useState(chatTitle);
  const [currentModelId, setCurrentModelId] = useState(initialModel);
  const currentModelIdRef = useRef(currentModelId);
  const pendingMessageKey = "pending-chat-message";

  useEffect(() => {
    currentModelIdRef.current = currentModelId;
  }, [currentModelId]);

  const { sendMessage } = useChat<ChatMessage>({
    id: initialChatId,
    messages: initialMessages,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest(request) {
        const { id, messages, body, trigger, messageId } = request as any;

        switch (trigger) {
          case "submit-message": {
            return {
              body: {
                id,
                trigger,
                message: messages.at(-1),
                modelId: currentModelIdRef.current,
                ...body,
              },
            };
          }
          case "regenerate-message": {
            return {
              body: {
                id,
                trigger,
                messageId,
                modelId: currentModelIdRef.current,
                ...body,
              },
            };
          }
          default: {
            return {
              body: {
                id,
                trigger,
                modelId: currentModelIdRef.current,
                ...body,
              },
            };
          }
        }
      },
    }),

    onData(event) {
      if (event.type === "data-usage") {
        console.log((event.data as LanguageModelUsage).outputTokens);
      }
      if (event.type === "data-title") {
        setTitle(event.data as string);
        mutate(getChatHistoryKey());
      }
    },
    onError(error) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while processing your message");
      }
    },
  });

  useEffect(() => {
    if (initialChatId) {
      const pending = sessionStorage.getItem(pendingMessageKey);
      if (pending) {
        sessionStorage.removeItem(pendingMessageKey);
        const message = JSON.parse(pending) as PromptInputMessage;
        sendMessage({ text: message.text || "", files: message.files || [] });
      }
    }
  }, [initialChatId, sendMessage]);

  const handleSubmit = async (data: PromptInputMessage) => {
    const hasText = Boolean(data.text?.trim());
    const hasFiles = (data.files?.length ?? 0) > 0;

    if (!hasText && !hasFiles) {
      return;
    }

    if (!initialChatId) {
      setIsCreatingChat(true);

      sessionStorage.setItem(pendingMessageKey, JSON.stringify(data));

      const chatId = generateUUID();
      const result = await createChat({ chatId });

      if (result.data?.id) {
        mutate(getChatHistoryKey());

        router.replace(`/chat/${result.data.id}`);
      }

      setIsCreatingChat(false);
      return;
    }

    sendMessage({ text: data.text || "", files: data.files || [] });
    setInput("");
  };

  return (
    <>
      <Header leftContent={<ChatBreadcrumb chatTitle={title} />} />
      <Messages profile={profile} />
      <ChatComposer
        onSubmit={handleSubmit}
        setInput={setInput}
        input={input}
        usage={usage as LanguageModelUsage}
        isCreatingChat={isCreatingChat}
        selectedModel={currentModelId}
        onModelChange={setCurrentModelId}
      />
    </>
  );
};
