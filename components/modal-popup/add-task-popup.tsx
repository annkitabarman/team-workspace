"use client";

import { Calendar, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { createTaskAction } from "@/app/actions/tasks";
import { CreateTaskData } from "@/lib/tasks";
import { useRouter } from "next/navigation";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projects: {
    id: string;
    projectName: string;
  }[];
};

export default function AddTaskModal({
  isOpen,
  onClose,
  projects,
}: AddTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskData>({
    defaultValues: {
      taskName: "",
      description: "",
      projectId: "",
      type: "TASK",
      priority: "MEDIUM",
      status: "TODO",
      dueDate: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: CreateTaskData) => {
    const payload = {
      taskName: data.taskName,
      description: data.description || undefined,
      projectId: data.projectId || undefined,
      type: data.type,
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
          <div>
            <label
              htmlFor="projectId"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Project
            </label>

            <select
              id="projectId"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-violet-500"
              {...register("projectId")}
            >
              <option value="">No project</option>

              {/* Replace these with your actual projects */}
              {projects.map((project) => (
                <option value={project.id} key={project.id}>
                  {project.projectName}
                </option>
              ))}
            </select>
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

              <select
                id="type"
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-violet-500"
                {...register("type")}
              >
                <option value="TASK">Task</option>
                <option value="FEATURE">Feature</option>
                <option value="BUG">Bug</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Priority
              </label>

              <select
                id="priority"
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-violet-500"
                {...register("priority")}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
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

              <select
                id="status"
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-violet-500"
                {...register("status")}
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
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
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

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
