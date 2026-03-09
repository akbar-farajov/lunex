"use client";
import { FC, useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk-tools/store";
import { Messages } from "@/app/(dashboard)/(chat)/components/messages";
import { ChatComposer } from "@/app/(dashboard)/(chat)/components/chat-composer";
import { DefaultChatTransport } from "ai";
import type { Profile } from "@/lib/types";
import { createChat } from "@/actions/chat";
import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { ChatMessage } from "@/lib/types";
import { generateUUID } from "@/lib/utils";
import { toast } from "sonner";
import { mutate } from "swr";
import { getChatHistoryKey } from "@/hooks/use-chats";
import { Header } from "@/app/(dashboard)/components";
import { usePathname } from "next/navigation";
import { useChatStoreApi } from "@ai-sdk-tools/store";

interface ChatProps {
  chatId?: string;
  initialMessages?: ChatMessage[];
  profile?: Profile;
  chatTitle?: string;
  initialModel?: string;
}

export const Chat: FC<ChatProps> = ({
  chatId: initialChatId,
  initialMessages = [],
  profile,
  chatTitle,
  initialModel = "gemini-2.5-flash-lite",
}) => {
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(
    initialChatId
  );
  const [input, setInput] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [title, setTitle] = useState(chatTitle);
  const [currentModelId, setCurrentModelId] = useState(initialModel);
  const currentModelIdRef = useRef(currentModelId);
  const pendingMessageRef = useRef<PromptInputMessage | null>(null);
  const pathname = usePathname();
  const storeApi = useChatStoreApi();

  useEffect(() => {
    if (pathname === "/new" || pathname === "/new/") {
      const state = storeApi.getState();
      state.reset();
      state.setId(undefined);
      state.setMessages([]);
      setCurrentChatId(undefined);
      pendingMessageRef.current = null;
      setInput("");
      setTitle(undefined);
    } else if (initialChatId && currentChatId !== initialChatId) {
      const state = storeApi.getState();
      state.setId(initialChatId);
      state.setMessages(initialMessages);
      setCurrentChatId(initialChatId);
      setTitle(chatTitle);
      pendingMessageRef.current = null;
      setInput("");
    }
  }, [pathname, initialChatId, initialMessages, chatTitle, storeApi]);

  useEffect(() => {
    currentModelIdRef.current = currentModelId;
  }, [currentModelId]);

  const { sendMessage, stop } = useChat<ChatMessage>({
    id: currentChatId,
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
      // if (event.type === "data-usage") {
      //   console.log((event.data as any).outputTokens);
      // }
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
    if (currentChatId && pendingMessageRef.current) {
      const message = pendingMessageRef.current;
      pendingMessageRef.current = null;
      window.history.replaceState({}, "", `/chat/${currentChatId}`);
      sendMessage({ text: message.text || "", files: message.files || [] });
      setInput("");
    }
  }, [currentChatId, sendMessage]);

  const handleSubmit = async (data: PromptInputMessage) => {
    const hasText = Boolean(data.text?.trim());
    const hasFiles = (data.files?.length ?? 0) > 0;

    if (!hasText && !hasFiles) {
      return;
    }

    if (!currentChatId) {
      setIsCreatingChat(true);
      pendingMessageRef.current = data;
      const chatId = generateUUID();
      const result = await createChat({ chatId });
      if (result.data?.id) {
        setCurrentChatId(result.data.id);
        mutate(getChatHistoryKey());
      }
      setIsCreatingChat(false);
      return;
    }

    sendMessage({ text: data.text || "", files: data.files || [] });
    setInput("");
  };

  const handleStop = () => {
    stop();
  };

  return (
    <main className="flex flex-col h-full" aria-label="Chat">
      <Header
        leftContent={
          currentChatId ? (
            <span className="text-sm font-medium line-clamp-1">{title}</span>
          ) : undefined
        }
      />
      <Messages profile={profile} chatId={initialChatId} />
      <div className="px-2">
        <ChatComposer
          onSubmit={handleSubmit}
          setInput={setInput}
          input={input}
          isCreatingChat={isCreatingChat}
          selectedModel={currentModelId}
          onModelChange={setCurrentModelId}
          handleStop={handleStop}
        />
      </div>
    </main>
  );
};
