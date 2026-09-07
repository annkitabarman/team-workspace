"use client";

import { Calendar, Plus, X } from "lucide-react";
import { useState } from "react";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const [type, setType] = useState("Task");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto py-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
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
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition hover:cursor-pointer hover:bg-surface-hover hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-5 p-6">
          {/* Task Title */}
          <div>
            <label
              htmlFor="taskTitle"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Task Title
            </label>

            <input
              id="taskTitle"
              name="taskTitle"
              required
              placeholder="e.g. Implement authentication"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
            />
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
              name="description"
              rows={4}
              placeholder="Describe what needs to be done..."
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
            />
          </div>

          {/* Project */}
          <div>
            <label
              htmlFor="project"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Project
            </label>

            <select
              id="project"
              name="project"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-violet-500"
            >
              <option value="">No project</option>
              <option value="team-workspace">Team Workspace</option>
              <option value="media-tracker">Media Tracker</option>
              <option value="portfolio">Portfolio</option>
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
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-violet-500"
              >
                <option value="Task">Task</option>
                <option value="Feature">Feature</option>
                <option value="Bug">Bug</option>
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
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-violet-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-violet-500"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
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
                  name="dueDate"
                  type="date"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted transition hover:cursor-pointer hover:bg-surface-hover hover:text-foreground"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-violet-500"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
