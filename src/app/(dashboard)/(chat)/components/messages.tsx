import { FC, memo, useRef, useEffect, useState } from "react";
import { Conversation } from "@/components/ai-elements/conversation";
import { ConversationContent } from "@/components/ai-elements/conversation";
import { ConversationEmptyState } from "@/components/ai-elements/conversation";
import { MessageSquareIcon } from "lucide-react";
import { ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Profile } from "@/lib/types";
import { ChatMessage } from "@/lib/types";
import { AIMessage } from "./ai-message";
import { UserMessage } from "./user-message";
import { useChatMessages, useChatStatus, useChatId } from "@ai-sdk-tools/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";
import { AZ } from "@/lib/az-strings";

interface PureMessagesProps {
  profile?: Profile;
  isLoading?: boolean;
  chatId?: string;
}

const MessageSkeleton = ({ isUser = false }: { isUser?: boolean }) => {
  return (
    <Message from={isUser ? "user" : "assistant"}>
      {isUser ? (
        <MessageContent variant="flat">
          <div className="space-y-3">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
        </MessageContent>
      ) : (
        <MessageContent variant="flat">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </MessageContent>
      )}
    </Message>
  );
};

export const PureMessages: FC<PureMessagesProps> = ({
  profile,
  isLoading,
  chatId,
}) => {
  const chatStatus = useChatStatus();
  const messages = useChatMessages<ChatMessage>();
  const prevMessageCount = useRef(messages.length);
  const [statusAnnouncement, setStatusAnnouncement] = useState("");

  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        setStatusAnnouncement(AZ.messageStatus.aiReceived);
      } else if (lastMessage?.role === "user") {
        setStatusAnnouncement(AZ.messageStatus.messageSent);
      }
      const timer = setTimeout(() => setStatusAnnouncement(""), 3000);
      return () => clearTimeout(timer);
    }
    prevMessageCount.current = messages.length;
  }, [messages.length, messages]);

  useEffect(() => {
    if (chatStatus === "submitted") {
      setStatusAnnouncement(AZ.messageStatus.generating);
    } else if (chatStatus === "streaming") {
      setStatusAnnouncement(AZ.messageStatus.streaming);
    }
  }, [chatStatus]);

  const isLastMessageStreaming = (index: number) => {
    return (
      index === messages.length - 1 &&
      (chatStatus === "streaming" || chatStatus === "submitted")
    );
  };

  const showSkeleton = isLoading || (messages.length === 0 && chatId);

  const isEmpty = !showSkeleton && messages.length === 0;

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusAnnouncement}
      </div>
      <Conversation className="w-full flex-1 scroll-smooth" aria-label="Söhbət mesajları">
        <ConversationContent
          className={cn(
            "max-w-3xl mx-auto",
            isEmpty && "min-h-full flex items-center justify-center"
          )}
        >
          {showSkeleton ? (
            <div className="space-y-6 py-6">
              <MessageSkeleton isUser={true} />
              <MessageSkeleton isUser={false} />
              <MessageSkeleton isUser={true} />
            </div>
          ) : messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquareIcon className="size-7" />}
              title={AZ.emptyState.title(profile?.full_name ?? "İstifadəçi")}
              description={AZ.emptyState.description}
            />
          ) : (
            <div aria-live="polite" aria-relevant="additions">
              {messages.map((message, index) => {
                const key = `${message.role}-${message.id || index}-${index}`;
                if (message.role === "user") {
                  return <UserMessage key={key} message={message} />;
                }
                return (
                  <AIMessage
                    key={key}
                    message={message}
                    isStreaming={isLastMessageStreaming(index)}
                  />
                );
              })}
            </div>
          )}
          {chatStatus === "submitted" && (
            <Shimmer duration={1}>Cavab yaradılır...</Shimmer>
          )}
          {chatStatus === "streaming" && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </>
  );
};

export const Messages = memo(PureMessages);
