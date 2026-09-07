import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock3,
  MoreHorizontal,
  Pencil,
  Sparkles,
  User,
} from "lucide-react";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Later:
  // const task = await prisma.task.findUnique({
  //   where: { id },
  // });

  // Mock data for now
  const task = {
    id,
    title: "Implement project creation",
    description:
      "Add the create project modal and connect it to PostgreSQL. The form should allow users to enter the project name, description, technologies, and GitHub repository.",
    project: "Team Workspace",
    projectId: "team-workspace",
    type: "Feature",
    status: "In Progress",
    priority: "High",
    dueDate: "Today",
    createdAt: "Aug 15, 2026",
    updatedAt: "2 hours ago",
    subtasks: [
      {
        id: 1,
        title: "Create project modal UI",
        completed: true,
      },
      {
        id: 2,
        title: "Add form validation",
        completed: true,
      },
      {
        id: 3,
        title: "Create Prisma project model",
        completed: true,
      },
      {
        id: 4,
        title: "Connect server action",
        completed: false,
      },
      {
        id: 5,
        title: "Refresh project list after creation",
        completed: false,
      },
    ],
    activity: [
      {
        id: 1,
        text: "Task created",
        time: "Aug 15, 10:32 AM",
      },
      {
        id: 2,
        text: "Status changed from Todo to In Progress",
        time: "Aug 15, 2:14 PM",
      },
      {
        id: 3,
        text: "Priority changed from Medium to High",
        time: "Aug 15, 3:02 PM",
      },
    ],
  };

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
              {task.title}
            </h1>

            {/* Description */}
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              {task.description}
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
                href={`/projects/${task.projectId}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted transition hover:border-violet-500/40 hover:text-foreground"
              >
                {task.project}
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
          {/* Description */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Description
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted">
              {task.description}
            </p>
          </section>

          {/* Subtasks */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Subtasks
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Break this task into smaller pieces.
                </p>
              </div>

              <span className="text-xs text-muted">
                {task.subtasks.filter((subtask) => subtask.completed).length} /{" "}
                {task.subtasks.length}
              </span>
            </div>

            <div className="mt-5 divide-y divide-border">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-3 py-3">
                  <button
                    type="button"
                    className="shrink-0 text-muted transition hover:text-violet-400"
                  >
                    {subtask.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  <span
                    className={
                      subtask.completed
                        ? "text-sm text-muted line-through"
                        : "text-sm text-foreground"
                    }
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              + Add subtask
            </button>
          </section>

          {/* Activity */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">Activity</h2>

            <div className="mt-5 space-y-5">
              {task.activity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-violet-500" />

                  <div>
                    <p className="text-sm text-foreground">{activity.text}</p>

                    <p className="mt-1 text-xs text-muted">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
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

              {/* Project */}
              <div>
                <div className="text-xs uppercase tracking-wider text-muted">
                  Project
                </div>

                <Link
                  href={`/projects/${task.projectId}`}
                  className="mt-2 block text-sm font-medium text-violet-400 hover:text-violet-300"
                >
                  {task.project}
                </Link>
              </div>

              {/* Due Date */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {task.dueDate}
                </p>
              </div>

              {/* Created */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                  <User className="h-4 w-4" />
                  Created
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {task.createdAt}
                </p>
              </div>
            </div>
          </section>

          {/* Progress */}
          <section className="rounded-2xl border border-border bg-surface p-6">
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
          </section>
        </div>
      </div>
    </div>
  );
}
