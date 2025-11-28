import { NextRequest, NextResponse } from "next/server";
import { getChats } from "@/actions/chat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const chats = await getChats(limit, offset);
    return NextResponse.json(chats || []);
  } catch (error) {
    console.error("Error fetching paginated chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
