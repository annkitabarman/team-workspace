"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "My Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-zinc-800 bg-zinc-950">
      <nav className="px-4 py-8">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-violet-600/15 text-violet-300"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
                  )}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <div className="rounded-xl border border-dashed border-zinc-700 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Workspace
          </p>

          <p className="mt-2 text-sm font-semibold text-white">
            Personal Workspace
          </p>

          <p className="mt-1 text-xs text-zinc-500">Build. Track. Ship.</p>
        </div>
      </div>
    </aside>
  );
}
