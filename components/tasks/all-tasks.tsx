"use client";

import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock3,
  Filter,
  ListFilter,
  Plus,
  Search,
  Sparkles,
  Bug,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

type TaskStatus = "Todo" | "In Progress" | "Completed";
type TaskType = "Feature" | "Bug" | "Task";

type Task = {
  id: number;
  title: string;
  description: string;
  project: string;
  type: TaskType;
  status: TaskStatus;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
};

const tasks: Task[] = [
  {
    id: 1,
    title: "Implement project creation",
    description: "Add the create project modal and connect it to PostgreSQL.",
    project: "Team Workspace",
    type: "Feature",
    status: "In Progress",
    priority: "High",
    dueDate: "Today",
  },
  {
    id: 2,
    title: "Fix authentication redirect",
    description: "Handle the redirect correctly when an existing user logs in.",
    project: "Team Workspace",
    type: "Bug",
    status: "Todo",
    priority: "High",
    dueDate: "Tomorrow",
  },
  {
    id: 3,
    title: "Build project details page",
    description: "Create the overview page for individual projects.",
    project: "Team Workspace",
    type: "Feature",
    status: "Todo",
    priority: "Medium",
    dueDate: "Aug 15",
  },
  {
    id: 4,
    title: "Add draggable notes",
    description: "Allow notes to be moved around the project canvas.",
    project: "Team Workspace",
    type: "Feature",
    status: "Todo",
    priority: "Medium",
    dueDate: "Aug 17",
  },
  {
    id: 5,
    title: "Fix infinite scrolling",
    description: "Investigate duplicate requests when reaching the bottom.",
    project: "Media Tracker",
    type: "Bug",
    status: "In Progress",
    priority: "High",
    dueDate: "Aug 14",
  },
  {
    id: 6,
    title: "Add ratings",
    description: "Allow users to rate movies and TV shows.",
    project: "Media Tracker",
    type: "Feature",
    status: "Completed",
    priority: "Medium",
    dueDate: "Completed",
  },
];

const statusFilters = ["All", "Todo", "In Progress", "Completed"];

export default function AllTasks() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      selectedStatus === "All" || task.status === selectedStatus;

    const searchTerm = search.toLowerCase();

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) ||
      task.project.toLowerCase().includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>

          <p className="mt-2 text-sm text-muted">
            Keep track of everything you need to get done.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 hover:cursor-pointer">
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      {/* Summary */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <TaskSummary
          label="All Tasks"
          value={tasks.length}
          icon={<ListFilter className="h-4 w-4" />}
        />

        <TaskSummary
          label="To Do"
          value={tasks.filter((t) => t.status === "Todo").length}
          icon={<Circle className="h-4 w-4" />}
        />

        <TaskSummary
          label="In Progress"
          value={tasks.filter((t) => t.status === "In Progress").length}
          icon={<Clock3 className="h-4 w-4" />}
        />

        <TaskSummary
          label="Completed"
          value={tasks.filter((t) => t.status === "Completed").length}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="h-10 w-80 rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
          />
        </div>

        <button className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Status filters */}
      <div className="mt-6 flex items-center gap-2 border-b border-border">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={clsx(
              "border-b-2 px-4 py-3 text-sm font-medium transition",
              selectedStatus === status
                ? "border-violet-500 text-violet-500"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_180px_140px_120px_40px] items-center gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted">
          <span>Task</span>
          <span>Project</span>
          <span>Priority</span>
          <span>Due Date</span>
          <span />
        </div>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <TaskRow key={task.id} task={task} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-10 w-10 text-muted" />

            <p className="mt-4 font-medium text-foreground">No tasks found</p>

            <p className="mt-1 text-sm text-muted">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskSummary({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="group grid grid-cols-[1fr_180px_140px_120px_40px] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 transition hover:bg-surface-hover">
      {/* Task */}
      <div className="flex min-w-0 items-start gap-3">
        <button className="mt-0.5 text-muted transition hover:text-violet-500">
          {task.status === "Completed" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {task.type === "Bug" ? (
              <Bug className="h-4 w-4 shrink-0 text-red-400" />
            ) : (
              <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
            )}

            <p
              className={clsx(
                "truncate text-sm font-medium",
                task.status === "Completed"
                  ? "text-muted line-through"
                  : "text-foreground",
              )}
            >
              {task.title}
            </p>
          </div>

          <p className="mt-1 truncate text-xs text-muted">{task.description}</p>
        </div>
      </div>

      {/* Project */}
      <span className="truncate text-sm text-muted">{task.project}</span>

      {/* Priority */}
      <span
        className={clsx(
          "w-fit rounded-full border px-3 py-1 text-xs font-medium",
          task.priority === "High" &&
            "border-red-500/30 bg-red-500/10 text-red-400",
          task.priority === "Medium" &&
            "border-amber-500/30 bg-amber-500/10 text-amber-400",
          task.priority === "Low" &&
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        )}
      >
        {task.priority}
      </span>

      {/* Due date */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <Calendar className="h-4 w-4" />
        {task.dueDate}
      </div>

      {/* More */}
      <button className="opacity-0 transition group-hover:opacity-100">
        <MoreHorizontal className="h-5 w-5 text-muted hover:text-foreground" />
      </button>
    </div>
  );
}
