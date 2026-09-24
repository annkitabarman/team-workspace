"use client";

import { useUser } from "@clerk/nextjs";
import { FolderKanban, CheckSquare, Bug } from "lucide-react";
import DashboardOverview from "./dashboard-overview";
import DashboardNotes from "./dashboard-notes";
import { getProjectsAction } from "@/app/actions/project";
import { useEffect, useState } from "react";
import { getManyTasksAction } from "@/app/actions/tasks";

const initialOverviewItems = [
  {
    title: "Projects",
    value: 0,
    icon: FolderKanban,
  },
  {
    title: "Pending Tasks",
    value: 0,
    icon: CheckSquare,
  },
  {
    title: "Open Bugs",
    value: 0,
    icon: Bug,
  },
];

export default function Dashboard() {
  const { user } = useUser();
  const userName = user?.fullName;
  const [overviewItems, setOverviewItems] = useState(initialOverviewItems);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await getProjectsAction();
        const tasks = await getManyTasksAction();
        setOverviewItems((items) =>
          items.map((item) => {
            switch (item.title) {
              case "Projects":
                return {
                  ...item,
                  value: projects.length,
                };

              case "Pending Tasks":
                return {
                  ...item,
                  value: tasks.filter((task) => task.status === "TODO").length,
                };

              case "Open Bugs":
                return {
                  ...item,
                  value: tasks.filter((task) => task.type === "BUG").length,
                };

              default:
                return item;
            }
          }),
        );
      } catch (err) {
        console.error(err);
      }
    };

    loadProjects();
  }, []);

  const notes = [
    {
      id: 1,
      title: "Authentication Flow",
      description: "Move user creation to Clerk webhooks...",
      updatedAt: "2 hours ago",
    },
    {
      id: 2,
      title: "Dashboard Ideas",
      description: "Add recent activity and progress cards...",
      updatedAt: "Yesterday",
    },
    {
      id: 3,
      title: "Media Tracker",
      description: "Implement ratings and infinite scrolling...",
      updatedAt: "3 days ago",
    },
  ];

  return (
    <div className="py-20 px-20">
      {/* <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:text-red-400 hover:cursor-pointer"
      >
        <LogOut size={16} />
        Logout
      </button> */}
      <div className="font-mono">
        <p>Welcome, {userName}</p>
      </div>

      <div className="my-10 flex gap-6">
        {overviewItems.map((item) => (
          <DashboardOverview
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      <DashboardNotes notes={notes} />
    </div>
  );
}
