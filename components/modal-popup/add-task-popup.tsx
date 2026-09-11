"use client";

import { Calendar, Plus, X, ChevronDown, Search } from "lucide-react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { createTaskAction } from "@/app/actions/tasks";
import { CreateTaskData } from "@/lib/tasks";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projects: {
    id: string;
    projectName: string;
  }[];
  users: {
    id: string;
    fullName: string;
    email: string;
  }[];
};

export default function AddTaskModal({
  isOpen,
  onClose,
  projects,
  users,
}: AddTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskData>({
    defaultValues: {
      taskName: "",
      description: "",
      projectId: "",
      assigneeId: "",
      type: "TASK",
      priority: "MEDIUM",
      status: "TODO",
      dueDate: "",
    },
  });
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const search = userSearch.toLowerCase();

    return (
      user.fullName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  });

  const selectedAssigneeId = useWatch({
    control,
    name: "assigneeId",
  });

  const selectedProjectId = useWatch({
    control,
    name: "projectId",
  });

  const selectedType = useWatch({
    control,
    name: "type",
  });

  const selectedPriority = useWatch({
    control,
    name: "priority",
  });

  const selectedStatus = useWatch({
    control,
    name: "status",
  });

  const selectedAssignee = users.find((user) => user.id === selectedAssigneeId);

  const onSubmit = async (data: CreateTaskData) => {
    const payload = {
      taskName: data.taskName,
      description: data.description || undefined,
      projectId: data.projectId || undefined,
      type: data.type,
      assigneeId: data.assigneeId,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate || undefined,
    };
    try {
      const createdTask = await createTaskAction(payload);
      reset();
      onClose();
      router.push(`/tasks/${createdTask.id}`);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleClose = () => {
    reset();
    setOpenDropdown(null);
    setUserSearch("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto py-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[calc(100vh-4rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Create New Task
            </h2>

            <p className="mt-1 text-sm text-muted">
              Add a task to your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-muted transition hover:cursor-pointer hover:bg-surface-hover hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          {/* Task Title */}
          <div>
            <label
              htmlFor="taskName"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Task Title
            </label>

            <input
              id="taskName"
              placeholder="e.g. Implement authentication"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
              {...register("taskName", {
                required: "Task title is required",
                minLength: {
                  value: 2,
                  message: "Task title must be at least 2 characters",
                },
              })}
            />

            {errors.taskName && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.taskName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Description
            </label>

            <textarea
              id="description"
              rows={4}
              placeholder="Describe what needs to be done..."
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
              {...register("description")}
            />
          </div>

          {/* Project */}
          <div className="relative">
            <input type="hidden" {...register("projectId")} />

            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "project" ? null : "project")
              }
              className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 text-left text-sm outline-none transition hover:cursor-pointer focus:border-violet-500"
            >
              <span
                className={selectedProjectId ? "text-foreground" : "text-muted"}
              >
                {projects.find((p) => p.id === selectedProjectId)
                  ?.projectName ?? "No project"}
              </span>

              <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
            </button>

            {openDropdown === "project" && (
              <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setValue("projectId", "");
                    setOpenDropdown(null);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:cursor-pointer hover:bg-surface-hover hover:text-foreground"
                >
                  No project
                </button>

                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      setValue("projectId", project.id);
                      setOpenDropdown(null);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:cursor-pointer hover:bg-surface-hover"
                  >
                    {project.projectName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assign To */}
          {/* Assign To */}
          <div className="relative">
            <Controller
              name="assigneeId"
              control={control}
              rules={{
                required: "No one selected",
              }}
              render={({ field }) => (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "assignee" ? null : "assignee",
                      )
                    }
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 text-left text-sm outline-none transition hover:cursor-pointer focus:border-violet-500"
                  >
                    <span
                      className={
                        selectedAssignee ? "text-foreground" : "text-muted"
                      }
                    >
                      {selectedAssignee?.fullName ?? "Assign to"}
                    </span>

                    <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                  </button>

                  {openDropdown === "assignee" && (
                    <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-border bg-card p-2 shadow-xl">
                      {/* Search */}
                      <div className="relative mb-2">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder="Search people..."
                          autoFocus
                          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-violet-500"
                        />
                      </div>

                      {/* Results */}
                      <div className="max-h-48 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => {
                                field.onChange(user.id);
                                setUserSearch("");
                                setOpenDropdown(null);
                              }}
                              className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left hover:cursor-pointer hover:bg-surface-hover"
                            >
                              <span className="text-sm text-foreground">
                                {user.fullName}
                              </span>

                              <span className="text-xs text-muted">
                                {user.email}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="px-3 py-3 text-sm text-muted">
                            No people found
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            />

            {errors.assigneeId && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.assigneeId.message}
              </p>
            )}
          </div>

          {/* Type + Priority */}
          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Type
              </label>

              <div className="relative">
                <input type="hidden" {...register("type")} />

                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "type" ? null : "type")
                  }
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 text-left text-sm text-foreground outline-none transition hover:cursor-pointer focus:border-violet-500"
                >
                  <span>
                    {selectedType === "TASK"
                      ? "Task"
                      : selectedType === "FEATURE"
                        ? "Feature"
                        : "Bug"}
                  </span>

                  <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                </button>

                {openDropdown === "type" && (
                  <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                    {[
                      ["TASK", "Task"],
                      ["FEATURE", "Feature"],
                      ["BUG", "Bug"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setValue("type", value as CreateTaskData["type"]);
                          setOpenDropdown(null);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:cursor-pointer hover:bg-surface-hover"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Priority
              </label>

              <div className="relative">
                <input type="hidden" {...register("priority")} />

                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === "priority" ? null : "priority",
                    )
                  }
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 text-left text-sm text-foreground outline-none transition hover:cursor-pointer focus:border-violet-500"
                >
                  <span>
                    {selectedPriority === "LOW"
                      ? "Low"
                      : selectedPriority === "HIGH"
                        ? "High"
                        : "Medium"}
                  </span>

                  <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                </button>

                {openDropdown === "priority" && (
                  <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                    {[
                      ["LOW", "Low"],
                      ["MEDIUM", "Medium"],
                      ["HIGH", "High"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setValue(
                            "priority",
                            value as CreateTaskData["priority"],
                          );
                          setOpenDropdown(null);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:cursor-pointer hover:bg-surface-hover"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Status
              </label>

              <div className="relative">
                <input type="hidden" {...register("status")} />

                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "status" ? null : "status")
                  }
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 text-left text-sm text-foreground outline-none transition hover:cursor-pointer focus:border-violet-500"
                >
                  <span>
                    {selectedStatus === "TODO"
                      ? "Todo"
                      : selectedStatus === "IN_PROGRESS"
                        ? "In Progress"
                        : "Completed"}
                  </span>

                  <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                </button>

                {openDropdown === "status" && (
                  <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                    {[
                      ["TODO", "Todo"],
                      ["IN_PROGRESS", "In Progress"],
                      ["COMPLETED", "Completed"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setValue("status", value as CreateTaskData["status"]);
                          setOpenDropdown(null);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:cursor-pointer hover:bg-surface-hover"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Due Date
              </label>

              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted" />

                <input
                  id="dueDate"
                  type="date"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-violet-500"
                  {...register("dueDate")}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted transition hover:cursor-pointer hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />

              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
