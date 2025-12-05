import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const { data: user } = await getUser();

  // If user is signed in, redirect to new chat page
  if (user) {
    redirect("/new");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
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
            <Button>Try for Free</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
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
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Lunex AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
