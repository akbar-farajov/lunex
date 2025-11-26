import { FC, memo } from "react";
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
          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </MessageContent>
      ) : (
        <MessageContent variant="flat">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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

  const isLastMessageStreaming = (index: number) => {
    return (
      index === messages.length - 1 &&
      (chatStatus === "streaming" || chatStatus === "submitted")
    );
  };

  const showSkeleton = isLoading || (messages.length === 0 && chatId);

  return (
    <Conversation className="w-full flex-1 scroll-smooth">
      <ConversationContent className="max-w-3xl mx-auto">
        {showSkeleton ? (
          <div className="space-y-6 py-6">
            <MessageSkeleton isUser={true} />
            <MessageSkeleton isUser={false} />
            <MessageSkeleton isUser={true} />
          </div>
        ) : messages.length === 0 ? (
          <ConversationEmptyState
            icon={<MessageSquareIcon className="size-6" />}
            title={`How can I help, ${profile?.full_name ?? "User"}?`}
            description={`Ask me anything about the documents you upload.`}
          />
        ) : (
          messages.map((message, index) => {
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
          })
        )}
        {chatStatus === "submitted" && (
          <Shimmer duration={1}>Generating your response...</Shimmer>
        )}
        {chatStatus === "streaming" && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};

export const Messages = memo(PureMessages);
