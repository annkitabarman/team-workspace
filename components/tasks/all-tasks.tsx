"use client";

import {
  CheckCircle2,
  Circle,
  Clock3,
  Filter,
  ListFilter,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import AddTaskModal from "../modal-popup/add-task-popup";
import type { Prisma } from "@prisma/client";
import TaskRow from "./task-row";

export type Task = Prisma.TaskGetPayload<{
  include: {
    project: true;
  };
}>;

type Project = {
  id: string;
  projectName: string;
};

type TaskClientProp = {
  tasks: Task[];
  projects: Project[];
};
const statusFilters = [
  { value: "ALL", label: "All" },
  { value: "TODO", label: "Todo" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
] as const;

export default function AllTasks({ tasks, projects }: TaskClientProp) {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      selectedStatus === "ALL" || task.status === selectedStatus;

    const searchTerm = search.toLowerCase();

    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm) ||
      (task.project?.projectName.toLowerCase().includes(searchTerm) ?? false);

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

        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 hover:cursor-pointer"
        >
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
          value={tasks.filter((t) => t.status === "TODO").length}
          icon={<Circle className="h-4 w-4" />}
        />

        <TaskSummary
          label="In Progress"
          value={tasks.filter((t) => t.status === "IN_PROGRESS").length}
          icon={<Clock3 className="h-4 w-4" />}
        />

        <TaskSummary
          label="Completed"
          value={tasks.filter((t) => t.status === "COMPLETED").length}
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
            key={status.value}
            onClick={() => setSelectedStatus(status.value)}
            className={clsx(
              "border-b-2 px-4 py-3 text-sm font-medium transition hover:cursor-pointer",
              selectedStatus === status.value
                ? "border-violet-500 text-violet-500"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="mt-6 rounded-2xl border border-border bg-surface">
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
      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projects={projects}
      />
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
