import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "../components";

const RecentsLoading = () => {
  return (
    <div className="flex flex-col h-full">
      <Header leftContent={<Skeleton className="h-4 w-20" />} />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle>
                        <Skeleton className="h-5 w-48" />
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <Skeleton className="h-4 w-32" />
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentsLoading;
