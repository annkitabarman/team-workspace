import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-xl italic tracking-tight">Team</span>
          <span className="font-mono text-xl font-medium text-violet-400">
            /Workspace
          </span>
        </div>
 
        <div className="flex items-center gap-6">
          <Link
            href="/auth?mode=login"
            className="font-mono text-sm text-[#9296A6] transition hover:text-[#F3F1E8]"
          >
            Sign in
          </Link>
 
         <Link
            href="/auth?mode=signup"
            className="rounded-md bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-2.5 font-mono text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-600/30 active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
            Start Free
            </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-8 pt-12 text-center">
        <div className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
          Team collaboration
        </div>

        <h1 className="mt-8 max-w-5xl text-6xl font-bold leading-tight">
          One Workspace.
          <br />
          Everything your team needs.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
          Manage projects, collaborate with your team, organize notes,
          track tasks, and chat with AI—all in one modern workspace.
        </p>

        <div className="mt-12 flex gap-5">
          <Link
            href="/auth?mode=signup"
            className="flex items-center gap-2 rounded-md bg-violet-600 px-7 py-3 font-mono transition hover:bg-violet-500"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

    </main>
  );
}

