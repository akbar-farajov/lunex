import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "./(auth)/components/google-auth-button";

export default async function LandingPage() {
  const { data: user } = await getUser();

  if (user) {
    redirect("/new");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image src="/icons/logo.svg" alt="Lunex AI" width={24} height={24} />
          <span className="text-lg font-semibold">Lunex AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Chat with AI
            <br />
            <span className="text-primary">Powerful Conversations</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Experience the future of AI-powered conversations. Get instant
            answers, creative assistance, and intelligent insights.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button className="w-full sm:w-auto">Try Lunex</Button>
            </Link>
            <GoogleAuthButton />
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Lunex AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
