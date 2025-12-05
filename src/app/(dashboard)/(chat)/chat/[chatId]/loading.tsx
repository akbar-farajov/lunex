import { Header } from "@/app/(dashboard)/components";
import { Conversation } from "@/components/ai-elements/conversation";
import { ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Skeleton } from "@/components/ui/skeleton";

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
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
        </MessageContent>
      )}
    </Message>
  );
};

export default function ChatLoading() {
  return (
    <div className="flex flex-col h-full">
      <Header leftContent={<Skeleton className="h-4 w-24 rounded-md" />} />
      <Conversation className="w-full flex-1 scroll-smooth">
        <ConversationContent className="max-w-3xl mx-auto">
          <div className="space-y-6 py-6">
            <MessageSkeleton isUser={true} />
            <MessageSkeleton isUser={false} />
            <MessageSkeleton isUser={true} />
          </div>
        </ConversationContent>
      </Conversation>
      <div className="px-2">
        <div className="w-full max-w-3xl mx-auto mb-4 shadow-xs bg-muted/20 rounded-lg border-none">
          <div className="w-full min-h-16 px-3 py-3 flex items-center"></div>
          <div className="flex items-center justify-between gap-1 px-3 pb-3">
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-32 rounded-md" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
