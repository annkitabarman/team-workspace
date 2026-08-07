"use client";

import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 h-20 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-10">
          <h1 className="font-mono text-lg font-bold tracking-wide text-white">
            Team <span className="text-violet-400">Workspace</span>
          </h1>

          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              placeholder="Search..."
              className="h-10 w-80 rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-500"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-violet-500 hover:bg-zinc-800 hover:cursor-pointer">
            <Bell size={18} className="text-zinc-300" />
          </button>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
