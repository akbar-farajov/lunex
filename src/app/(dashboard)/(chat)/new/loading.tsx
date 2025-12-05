import { Header } from "../../components";
import { Skeleton } from "@/components/ui/skeleton";

function HomeLoading() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="w-full flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full">
          <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center h-full overflow-hidden">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-64 mx-auto rounded-md text-lg" />
              <Skeleton className="h-4 w-80 mx-auto rounded-md text-sm" />
            </div>
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
  );
}

export default HomeLoading;
