import { cookies } from "next/headers";
import { Chat } from "../components";

export default async function NewChatPage() {
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  return <Chat initialMessages={[]} initialModel={modelIdFromCookie?.value} />;
}
