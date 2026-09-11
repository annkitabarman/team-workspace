"use client";

import {
  ArrowLeft,
  Bug,
  ListTodo,
  ExternalLink,
  FolderKanban,
  Pencil,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AddEditProjectModal from "../modal-popup/add-edit-project-popup";

type Project = {
  id: string;
  projectName: string;
  description: string;
  githubUrl: string | null;
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
  tasks: {
    id: string;
    taskName: string;
    type: "TASK" | "FEATURE" | "BUG";
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "TODO" | "IN_PROGRESS" | "COMPLETED";
    assignee: {
      fullName: string;
    };
  }[];
};

type Counts = {
  bugs: number;
  features: number;
  tasks: number;
};

type ProjectDetailsProps = {
  project: Project;
  counts: Counts;
};

export default function ProjectDetails({
  project,
  counts,
}: ProjectDetailsProps) {
  const [taskFilter, setTaskFilter] = useState<
    "ALL" | "TASK" | "BUG" | "FEATURE"
  >("ALL");

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks =
    taskFilter === "ALL"
      ? project.tasks
      : project.tasks.filter((task) => task.type === taskFilter);

  const getTaskIcon = (type: Project["tasks"][number]["type"]) => {
    if (type === "BUG") {
      return <Bug className="h-4 w-4 text-red-400" />;
    }

    if (type === "FEATURE") {
      return <Sparkles className="h-4 w-4 text-amber-400" />;
    }

    return <ListTodo className="h-4 w-4 text-violet-400" />;
  };

  const taskCounts = {
    all: project.tasks.length,
    tasks: project.tasks.filter((task) => task.type === "TASK").length,
    bugs: project.tasks.filter((task) => task.type === "BUG").length,
    features: project.tasks.filter((task) => task.type === "FEATURE").length,
  };

  return (
    <>
      <div className="px-8 py-8">
        {/* Back */}
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-violet-500/10 p-3">
                <FolderKanban className="h-6 w-6 text-violet-500" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {project.projectName}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  {project.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                  GitHub
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditingProject(project);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 hover:cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            </div>
          </div>

          {/* Technologies */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Bug className="h-4 w-4 text-red-400" />
              Bugs
            </div>

            <p className="mt-3 text-3xl font-bold text-foreground">
              {counts.bugs}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Features
            </div>

            <p className="mt-3 text-3xl font-bold text-foreground">
              {counts.features}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2 text-sm text-muted">
              <ListTodo className="h-4 w-4 text-emerald-400" />
              Tasks
            </div>

            <p className="mt-3 text-3xl font-bold text-foreground">
              {counts.tasks}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          {/* Tasks */}
          <div className="col-span-2 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Tasks</h2>

                <p className="mt-1 text-sm text-muted">
                  All tasks associated with this project.
                </p>
              </div>

              <button className="text-sm font-medium text-violet-400 transition hover:cursor-pointer hover:text-violet-300">
                View All
              </button>
            </div>

            {/* Filters */}
            <div className="mt-5 flex items-center gap-2">
              {[
                { label: "All", value: "ALL", count: taskCounts.all },
                { label: "Tasks", value: "TASK", count: taskCounts.tasks },
                { label: "Bugs", value: "BUG", count: taskCounts.bugs },
                {
                  label: "Features",
                  value: "FEATURE",
                  count: taskCounts.features,
                },
              ].map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setTaskFilter(filter.value as typeof taskFilter)
                  }
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:cursor-pointer ${
                    taskFilter === filter.value
                      ? "bg-violet-500/10 text-violet-400"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  {filter.label}

                  <span
                    className={
                      taskFilter === filter.value
                        ? "text-violet-400"
                        : "text-muted"
                    }
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Task list */}
            <div className="mt-5 space-y-2">
              {project.tasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition hover:bg-surface-hover"
                  >
                    {/* Left */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="shrink-0">{getTaskIcon(task.type)}</div>

                      <div className="min-w-0">
                        <Link
                          href={`/tasks/${task.id}`}
                          className="truncate text-sm font-medium text-foreground hover:text-violet-400"
                        >
                          {task.taskName}
                        </Link>

                        <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                          <span>{task.type}</span>
                          <span>•</span>
                          <span>{task.priority}</span>
                          <span>•</span>
                          <span>{task.assignee.fullName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`ml-4 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        task.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : task.status === "IN_PROGRESS"
                            ? "bg-violet-500/10 text-violet-400"
                            : "bg-surface-hover text-muted"
                      }`}
                    >
                      {task.status === "IN_PROGRESS"
                        ? "In Progress"
                        : task.status === "COMPLETED"
                          ? "Completed"
                          : "To Do"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border">
                  <div className="text-center">
                    <ListTodo className="mx-auto h-8 w-8 text-muted" />

                    <p className="mt-3 text-sm font-medium text-foreground">
                      No tasks yet
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Create a task to start tracking your project.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Info */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Project Info
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  Created
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {project.createdAt.toLocaleDateString("en-GB")}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  Last Updated
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {project.updatedAt.toLocaleDateString("en-GB")}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  Technologies
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {project.technologies.length} technologies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <AddEditProjectModal
        key={editingProject?.id ?? "edit"}
        mode="edit"
        isOpen={isModalOpen}
        project={editingProject ?? undefined}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
      />
    </>
  );
}
