"use client";

import { Plus, Search } from "lucide-react";
import ProjectCard from "./project-card";
import { useState } from "react";
import AddProjectModal from "../modal-popup/add-project-modal-popup";

export default function AllProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projects = [
    {
      id: 1,
      name: "Team Workspace",
      description:
        "A collaborative workspace for managing projects, tasks, notes, and team communication.",
      technologies: ["Next.js", "Prisma", "PostgreSQL", "Clerk"],
      bugs: 2,
      features: 8,
      completed: 14,
      updatedAt: "2 hours ago",
    },
    {
      id: 2,
      name: "Media Tracker",
      description:
        "Track movies, TV shows, anime, and games with ratings, watchlists, and recommendations.",
      technologies: ["Angular", "Node.js", "TMDB API"],
      bugs: 1,
      features: 5,
      completed: 21,
      updatedAt: "Yesterday",
    },
    {
      id: 3,
      name: "Portfolio",
      description:
        "Personal portfolio showcasing projects, skills, and experience with a modern UI.",
      technologies: ["Next.js", "Tailwind", "Framer Motion"],
      bugs: 0,
      features: 4,
      completed: 9,
      updatedAt: "3 days ago",
    },
    {
      id: 4,
      name: "Expense Tracker",
      description:
        "Track daily expenses, budgets, and monthly spending with interactive charts.",
      technologies: ["React", "Express", "MongoDB"],
      bugs: 3,
      features: 6,
      completed: 18,
      updatedAt: "1 week ago",
    },
    {
      id: 5,
      name: "AI Chat",
      description:
        "Chat interface powered by AI with conversation history and prompt templates.",
      technologies: ["Next.js", "OpenAI", "Prisma"],
      bugs: 2,
      features: 10,
      completed: 13,
      updatedAt: "5 days ago",
    },
    {
      id: 6,
      name: "Weather App",
      description:
        "Real-time weather forecasts with location search and interactive charts.",
      technologies: ["React", "TypeScript", "OpenWeather"],
      bugs: 0,
      features: 3,
      completed: 11,
      updatedAt: "2 weeks ago",
    },
  ];

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>

          <p className="mt-2 text-sm text-muted">
            Manage all your personal and team projects.
          </p>
        </div>

        <button
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-violet-500"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-8 w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

        <input
          placeholder="Search projects..."
          className="h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
        />
      </div>

      {/* Projects */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
