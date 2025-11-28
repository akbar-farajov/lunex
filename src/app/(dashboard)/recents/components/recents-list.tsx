"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Chat } from "@/lib/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface RecentsListProps {
  initialChats: Chat[];
}

const ITEMS_PER_PAGE = 5;

export function RecentsList({ initialChats }: RecentsListProps) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialChats.length === ITEMS_PER_PAGE
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/chats/paginated?limit=${ITEMS_PER_PAGE}&offset=${chats.length}`
      );
      if (!response.ok) {
        throw new Error("Failed to load more chats");
      }
      const newChats: Chat[] = await response.json();

      if (newChats.length === 0 || newChats.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setChats((prev) => [...prev, ...newChats]);
    } catch (error) {
      console.error("Error loading more chats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [chats.length, isLoading, hasMore]);

  if (chats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Chats Yet</CardTitle>
          <CardDescription>
            Start a new conversation to see your chats here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {chat.title || "New Chat"}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {formatDate(chat.updated_at)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
