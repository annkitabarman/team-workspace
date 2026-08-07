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
  Notebook,
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
    name: "Notes",
    href: "/notes",
    icon: Notebook,
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
    <aside className="flex h-full w-64 flex-col justify-between border-r border-border bg-background">
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
                    "flex items-center gap-3 rounded-xl px-6 py-2 text-sm font-medium transition",
                    active
                      ? "bg-violet-600/15 text-violet-500"
                      : "text-muted hover:bg-card hover:text-foreground",
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

      <div className="border-t border-border p-4">
        <div className="rounded-xl border border-dashed border-border p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Workspace
          </p>

          <p className="mt-2 text-sm font-semibold text-foreground">
            Personal Workspace
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Build. Track. Ship.
          </p>
        </div>
      </div>
    </aside>
  );
}
