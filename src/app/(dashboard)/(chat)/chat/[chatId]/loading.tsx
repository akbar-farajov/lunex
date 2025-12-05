import { Header } from "@/app/(dashboard)/components";
import { Skeleton } from "@/components/ui/skeleton";

const MessageSkeleton = ({ isUser = false }: { isUser?: boolean }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-3xl ${isUser ? "flex justify-end" : ""}`}>
        {isUser ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatLoading() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header leftContent={<Skeleton className="h-4 w-24 rounded-md" />} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="w-full flex-1 overflow-hidden">
          <div className="max-w-3xl mx-auto h-full">
            <div className="space-y-6 py-6 px-4 h-full overflow-hidden">
              <MessageSkeleton isUser={true} />
              <MessageSkeleton isUser={false} />
              <MessageSkeleton isUser={true} />
            </div>
          </div>
        </div>
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
    </div>
  );
}
