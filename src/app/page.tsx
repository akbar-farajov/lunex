import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";
import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, Fraunces } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoogleAuthButton } from "./(auth)/components/google-auth-button";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
});

export default async function LandingPage() {
  const { data: user } = await getUser();

  if (user) {
    redirect("/new");
  }

  return (
    <div
      className={`${spaceGrotesk.className} relative min-h-screen overflow-hidden bg-background text-foreground`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute left-1/2 top-[-18rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--primary),transparent_65%)] opacity-25 blur-3xl" />
        <div className="absolute right-[-8rem] top-[12%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,var(--chart-2),transparent_65%)] opacity-20 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,var(--chart-4),transparent_70%)] opacity-20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--foreground)_1px,transparent_0)] [background-size:26px_26px]" />
      </div>

      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background/80 shadow-sm ring-1 ring-border/60">
            <Image src="/icons/logo.svg" alt="Lunex AI" width={26} height={26} />
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold">Lunex AI</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
              Studio
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link
            href="#features"
            className="transition hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="#workflow"
            className="transition hover:text-primary"
          >
            Workflow
          </Link>
          <Link
            href="#security"
            className="transition hover:text-primary"
          >
            Security
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto grid gap-12 px-4 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <Badge className="w-fit rounded-full border border-primary/30 bg-background/70 px-4 py-1 text-xs uppercase tracking-[0.2em] text-primary">
              Work smarter, sound sharper
            </Badge>
            <div className="space-y-5">
              <h1
                className={`${fraunces.className} text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl`}
              >
                Your AI studio for the moments that matter.
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Lunex AI blends research, writing, and memory into a calm workspace
                that keeps every conversation precise, grounded, and ready to
                share.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                  Start free in minutes
                </Button>
              </Link>
              <GoogleAuthButton />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Private workspaces
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-2" />
                Source-aware replies
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-3" />
                24/7 availability
              </span>
            </div>
          </div>

          <div className="relative animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150">
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.6)] backdrop-blur">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Live session
                </span>
                <span>New brief ready</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-foreground p-4 text-sm text-background shadow-sm">
                  Summarize the Q2 launch report and highlight risks.
                </div>
                <div className="rounded-2xl border border-border/70 bg-background p-4 text-sm text-muted-foreground shadow-sm">
                  Here is a crisp summary with the top three risks. The largest
                  exposure is tied to supplier timelines; mitigation starts with
                  a revised milestone plan and weekly vendor check-ins.
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-primary">
                    <span className="rounded-full bg-primary/10 px-2 py-1">
                      Summary view
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-1">
                      Risk tracker
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                <div className="rounded-xl border border-border/70 bg-muted px-3 py-2">
                  12 sources linked
                </div>
                <div className="rounded-xl border border-border/70 bg-muted px-3 py-2">
                  98% clarity score
                </div>
                <div className="rounded-xl border border-border/70 bg-muted px-3 py-2">
                  4 mins saved
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 hidden w-48 rounded-2xl border border-border bg-background/80 p-4 text-xs text-muted-foreground shadow-lg backdrop-blur lg:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                Memory cue
              </p>
              <p className="mt-2">
                Follow up with the vendor summary in tomorrow's standup.
              </p>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="container mx-auto px-4 pb-16 pt-6"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-primary">
                Designed for focus
              </p>
              <h2
                className={`${fraunces.className} text-3xl font-semibold text-foreground sm:text-4xl`}
              >
                Everything you need to move from idea to answer.
              </h2>
              <p className="text-muted-foreground">
                Keep context, sources, and next steps in one place. Lunex AI
                adapts to your tone so updates are ready to ship the moment they
                land.
              </p>
            </div>
            <Link href="/signup">
              <Button>Explore features</Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                Memory
              </p>
              <h3 className="mt-3 text-lg font-semibold">
                Context that keeps up.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Capture key decisions, preferred tone, and project details so
                every reply starts aligned.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100">
              <p className="text-xs uppercase tracking-[0.2em] text-chart-2">
                Clarity
              </p>
              <h3 className="mt-3 text-lg font-semibold">
                Answers built for humans.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Summaries, action plans, and edits that feel sharp, structured,
                and ready to share.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
              <p className="text-xs uppercase tracking-[0.2em] text-chart-3">
                Trust
              </p>
              <h3 className="mt-3 text-lg font-semibold">
                Sources you can point to.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Keep evidence visible with citations, links, and quick exports
                for teams.
              </p>
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="container mx-auto grid gap-8 px-4 pb-16 lg:grid-cols-[1fr_0.8fr]"
        >
          <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              Flow
            </p>
            <h2
              className={`${fraunces.className} mt-3 text-3xl font-semibold sm:text-4xl`}
            >
              Bring your docs, leave with decisions.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Drop in notes, briefs, and dashboards. Lunex AI organizes the
              signal, highlights what matters, and keeps the next step visible.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-muted p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Step 1
                </p>
                <p className="mt-2 font-semibold">Drop in context</p>
                <p className="mt-1 text-muted-foreground">
                  Upload docs or paste links in seconds.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Step 2
                </p>
                <p className="mt-2 font-semibold">Ask in plain language</p>
                <p className="mt-1 text-muted-foreground">
                  Get structured responses you can share.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Step 3
                </p>
                <p className="mt-2 font-semibold">Track the follow-ups</p>
                <p className="mt-1 text-muted-foreground">
                  Memory cues keep action items clear.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Step 4
                </p>
                <p className="mt-2 font-semibold">Share with confidence</p>
                <p className="mt-1 text-muted-foreground">
                  Export answers with citations intact.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150" id="security">
            <div className="rounded-3xl border border-border bg-foreground p-8 text-background shadow-lg">
              <p className="text-xs uppercase tracking-[0.35em] text-primary">
                Security
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                Calm, private, and team-ready.
              </h3>
              <p className="mt-3 text-sm text-background/70">
                Built for real work with secure sessions, isolated workspaces,
                and clean export trails you can trust.
              </p>
              <div className="mt-6 space-y-3 text-sm text-background/80">
                <p>Workspace-based access controls</p>
                <p>Session timeouts and safe defaults</p>
                <p>Auditable links and export history</p>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card/80 p-6 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                Use cases
              </p>
              <p className="mt-3 font-semibold text-foreground">
                Ready for every team that ships.
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-border/70 bg-muted px-3 py-2">
                  Product briefs and launch notes
                </div>
                <div className="rounded-xl border border-border/70 bg-muted px-3 py-2">
                  Customer updates and escalations
                </div>
                <div className="rounded-xl border border-border/70 bg-muted px-3 py-2">
                  Weekly status summaries
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-3xl border border-primary/20 bg-primary/10 px-6 py-10 sm:px-10 sm:py-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-primary">
                  Ready to begin
                </p>
                <h2
                  className={`${fraunces.className} text-3xl font-semibold sm:text-4xl`}
                >
                  Launch your next conversation in minutes.
                </h2>
                <p className="text-muted-foreground">
                  Bring your context, invite your team, and let Lunex handle the
                  heavy lifting.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                    Get started free
                  </Button>
                </Link>
                <GoogleAuthButton />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Lunex AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
