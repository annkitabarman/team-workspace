"use client";

import {
  CheckCircle2,
  Circle,
  Clock3,
  Filter,
  ListFilter,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
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

type User = {
  id: string;
  fullName: string;
  email: string;
};

type TaskClientProp = {
  tasks: Task[];
  projects: Project[];
  users: User[];
};
const statusFilters = [
  { value: "ALL", label: "All" },
  { value: "TODO", label: "Todo" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
] as const;

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
  isOpen,
  onToggle,
  onClose,
}: FilterSelectProps) {
  const selectedOption =
    options.find(([optionValue]) => optionValue === value)?.[1] ??
    options[0][1];

  return (
    <div className="mb-3 last:mb-0">
      <label className="mb-1.5 block text-xs font-medium text-muted">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className={clsx(
            "flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm transition hover:cursor-pointer",
            isOpen
              ? "border-violet-500 bg-surface-hover text-foreground"
              : "border-border bg-surface text-foreground hover:bg-surface-hover",
          )}
        >
          <span>{selectedOption}</span>

          <ChevronDown
            className={clsx(
              "h-4 w-4 text-muted transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-11 z-50 rounded-xl border border-border bg-background p-1.5 shadow-xl">
            {options.map(([optionValue, optionLabel]) => {
              const isSelected = value === optionValue;

              return (
                <button
                  key={optionValue}
                  type="button"
                  onClick={() => {
                    onChange(optionValue);
                    onClose();
                  }}
                  className={clsx(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:cursor-pointer",
                    isSelected
                      ? "bg-violet-500/10 text-violet-400"
                      : "text-foreground hover:bg-surface-hover",
                  )}
                >
                  <span>{optionLabel}</span>

                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllTasks({ tasks, projects, users }: TaskClientProp) {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    type: "ALL",
    priority: "ALL",
    dueDate: "ALL",
  });

  const filteredTasks = tasks.filter((task) => {
    // Search
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm) ||
      (task.project?.projectName.toLowerCase().includes(searchTerm) ?? false);

    // Type
    const matchesType = filters.type === "ALL" || task.type === filters.type;

    // Priority
    const matchesPriority =
      filters.priority === "ALL" || task.priority === filters.priority;

    // Due date
    let matchesDueDate = true;

    if (filters.dueDate !== "ALL") {
      if (filters.dueDate === "NONE") {
        matchesDueDate = task.dueDate === null;
      } else if (task.dueDate) {
        const today = new Date();
        const dueDate = new Date(task.dueDate);

        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        if (filters.dueDate === "OVERDUE") {
          matchesDueDate = dueDate < today && task.status !== "COMPLETED";
        }

        if (filters.dueDate === "TODAY") {
          matchesDueDate = dueDate.getTime() === today.getTime();
        }

        if (filters.dueDate === "UPCOMING") {
          matchesDueDate = dueDate > today && task.status !== "COMPLETED";
        }
      } else {
        matchesDueDate = false;
      }
    }

    return matchesSearch && matchesType && matchesPriority && matchesDueDate;
  });

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "ALL",
  ).length;

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
        setOpenFilter(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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

        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={clsx(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition hover:cursor-pointer",
              isFilterOpen
                ? "border-violet-500/40 bg-surface-hover text-foreground"
                : "border-border bg-surface text-muted hover:bg-surface-hover hover:text-foreground",
            )}
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[11px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-border bg-background p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Filter tasks
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      type: "ALL",
                      priority: "ALL",
                      dueDate: "ALL",
                    });

                    setOpenFilter(null);
                  }}
                  className="text-xs text-muted transition hover:text-foreground hover:cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <FilterSelect
                label="Type"
                value={filters.type}
                options={[
                  ["ALL", "All"],
                  ["TASK", "Task"],
                  ["FEATURE", "Feature"],
                  ["BUG", "Bug"],
                ]}
                isOpen={openFilter === "type"}
                onToggle={() =>
                  setOpenFilter((prev) => (prev === "type" ? null : "type"))
                }
                onClose={() => setOpenFilter(null)}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: value,
                  }))
                }
              />

              <FilterSelect
                label="Priority"
                value={filters.priority}
                options={[
                  ["ALL", "All"],
                  ["LOW", "Low"],
                  ["MEDIUM", "Medium"],
                  ["HIGH", "High"],
                ]}
                isOpen={openFilter === "priority"}
                onToggle={() =>
                  setOpenFilter((prev) =>
                    prev === "priority" ? null : "priority",
                  )
                }
                onClose={() => setOpenFilter(null)}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    priority: value,
                  }))
                }
              />

              <FilterSelect
                label="Due date"
                value={filters.dueDate}
                options={[
                  ["ALL", "Any"],
                  ["OVERDUE", "Overdue"],
                  ["TODAY", "Due today"],
                  ["UPCOMING", "Upcoming"],
                  ["NONE", "No due date"],
                ]}
                isOpen={openFilter === "dueDate"}
                onToggle={() =>
                  setOpenFilter((prev) =>
                    prev === "dueDate" ? null : "dueDate",
                  )
                }
                onClose={() => setOpenFilter(null)}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    dueDate: value,
                  }))
                }
              />
            </div>
          )}
        </div>
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
        users={users}
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
