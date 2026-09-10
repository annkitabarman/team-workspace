"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock3,
  MoreHorizontal,
  Sparkles,
  User,
  UserRound,
  Check,
  Pencil,
  X,
} from "lucide-react";
import { useState } from "react";
import { updateReproStepsAction } from "@/app/actions/tasks";

// type Task = {
//   id: string;
//   taskName: string;
//   description: string | null;
//   projectName: string;
//   projectId: string;
//   type: "Task" | "Feature" | "Bug";
//   status: "Todo" | "In Progress" | "Completed";
//   priority: "Low" | "Medium" | "High";
//   dueDate: string;
//   createdAt: string;
//   updatedAt: string;

//   activity?: {
//     id: number;
//     text: string;
//     time: string;
//   }[];
// };

type Task = {
  id: string;
  taskName: string;
  description: string | null;
  reproSteps: string | null;

  type: "TASK" | "FEATURE" | "BUG";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";

  dueDate: Date | null;
  createdAt: Date | null;

  project: {
    id: string;
    projectName: string;
  } | null;

  assignee: {
    id: string;
    fullName: string;
    email: string;
  };
};

type TaskDetailsProps = {
  task: Task;
  canEdit: boolean;
};

export default function TaskDetails({ task, canEdit }: TaskDetailsProps) {
  const [isEditingReproSteps, setIsEditingReproSteps] = useState(false);
  const [reproSteps, setReproSteps] = useState(task.reproSteps ?? "");
  return (
    <div className="px-8 py-8">
      {/* Back */}
      <Link
        href="/tasks"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </Link>

      {/* Header */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            {/* Type */}
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {task.type}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold text-foreground">
              {task.taskName}
            </h1>

            {/* Description */}
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              {task.description || "No description added"}
            </p>

            {/* Tags */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                {task.priority}
              </span>

              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                {task.status}
              </span>

              <Link
                href={`/projects/${task.project?.id}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted transition hover:border-violet-500/40 hover:text-foreground"
              >
                {task.project?.projectName}
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              className="rounded-xl border border-border bg-background p-2 text-muted transition hover:bg-surface-hover hover:text-foreground"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        {/* Left */}
        <div className="col-span-2 space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Repro Steps
              </h2>

              {canEdit && !isEditingReproSteps && (
                <button
                  type="button"
                  onClick={() => setIsEditingReproSteps(true)}
                  className="rounded-lg p-2 text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>

            {isEditingReproSteps && canEdit ? (
              <div className="mt-4">
                <textarea
                  value={reproSteps}
                  onChange={(e) => setReproSteps(e.target.value)}
                  autoFocus
                  className="min-h-40 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-7 text-foreground outline-none placeholder:text-muted focus:border-violet-500"
                />

                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReproSteps(task.reproSteps ?? "");
                      setIsEditingReproSteps(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await updateReproStepsAction(task.id, reproSteps);
                      setIsEditingReproSteps(false);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-violet-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-600 hover:cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingReproSteps(true)}
                className="mt-4 block w-full rounded-xl border border-transparent p-4 text-left transition hover:border-border hover:bg-background/50"
              >
                {task.reproSteps ? (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-muted">
                    {task.reproSteps}
                  </p>
                ) : (
                  <p className="text-sm text-muted">
                    {canEdit ? "Click to add repro steps..." : ""}
                  </p>
                )}
              </button>
            )}
          </section>

          {/* Activity */}
          {/* <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">Activity</h2>

            <div className="mt-5 space-y-5">
              {task.activity?.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-violet-500" />

                  <div>
                    <p className="text-sm text-foreground">{activity.text}</p>

                    <p className="mt-1 text-xs text-muted">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section> */}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Task Details */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Task Details
            </h2>

            <div className="mt-5 space-y-5">
              {/* Status */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                  <Clock3 className="h-4 w-4" />
                  Status
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {task.status}
                </p>
              </div>

              {/* Priority */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                  <Sparkles className="h-4 w-4" />
                  Priority
                </div>

                <p className="mt-2 text-sm font-medium text-red-400">
                  {task.priority}
                </p>
              </div>

              {/* Assigned To */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                  <UserRound className="h-4 w-4" />
                  Assigned To
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {task.assignee.fullName}
                </p>
              </div>

              {/* Project */}
              <div>
                <div className="text-xs uppercase tracking-wider text-muted">
                  Project
                </div>

                <Link
                  href={`/projects/${task.project?.id}`}
                  className="mt-2 block text-sm font-medium text-violet-400 hover:text-violet-300"
                >
                  {task.project?.projectName}
                </Link>
              </div>

              {/* Due Date */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {formatDate(task.dueDate)}
                </p>
              </div>

              {/* Created */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                  <User className="h-4 w-4" />
                  Created
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {formatDate(task.createdAt)}
                </p>
              </div>
            </div>
          </section>

          {/* Progress */}
          {/* <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Progress
              </h2>

              <span className="text-sm font-medium text-violet-400">
                {Math.round(
                  (task.subtasks.filter((subtask) => subtask.completed).length /
                    task.subtasks.length) *
                    100,
                )}
                %
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{
                  width: `${
                    (task.subtasks.filter((subtask) => subtask.completed)
                      .length /
                      task.subtasks.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs text-muted">
              {task.subtasks.filter((subtask) => subtask.completed).length} of{" "}
              {task.subtasks.length} subtasks completed
            </p>
          </section> */}
        </div>
      </div>
    </div>
  );
}

function formatDate(date: Date | null) {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
