import { cookies } from "next/headers";
import { Chat } from "./components";

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  return <Chat initialMessages={[]} initialModel={modelIdFromCookie?.value} />;
}
