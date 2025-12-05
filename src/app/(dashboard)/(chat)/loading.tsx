import { Header } from "../components";
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

function HomeLoading() {
  return (
    <div className="flex flex-col h-full">
      <Header leftContent={<Skeleton className="h-4 w-24" />} />
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
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default HomeLoading;
