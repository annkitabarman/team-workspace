"use client";

import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 h-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-10">
          <h1 className="font-mono text-lg font-bold tracking-wide text-foreground">
            Team <span className="text-violet-500">Workspace</span>
          </h1>

          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              placeholder="Search..."
              className="h-10 w-80 rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition hover:border-violet-500 hover:bg-card-hover hover:cursor-pointer">
            <Bell className="h-[18px] w-[18px] text-muted-foreground" />
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
