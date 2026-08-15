"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type AddProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddProjectModal({
  isOpen,
  onClose,
}: AddProjectModalProps) {
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [technology, setTechnology] = useState("");

  if (!isOpen) return null;

  const addTechnology = () => {
    const value = technology.trim();

    if (!value || technologies.includes(value)) return;

    setTechnologies((prev) => [...prev, value]);
    setTechnology("");
  };

  const removeTechnology = (tech: string) => {
    setTechnologies((prev) => prev.filter((item) => item !== tech));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Later:
    // await createProject(...)

    console.log({
      name: e.currentTarget.projectName.value,
      description: e.currentTarget.description.value,
      githubUrl: e.currentTarget.githubUrl.value,
      technologies,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto py-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[calc(100vh-4rem)] overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Create New Project
            </h2>

            <p className="mt-1 text-sm text-muted">
              Add a project to your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Project Name */}
          <div>
            <label
              htmlFor="projectName"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Project Name
            </label>

            <input
              id="projectName"
              name="projectName"
              required
              placeholder="e.g. Media Tracker"
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
              rows={3}
              placeholder="What are you building?"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
            />
          </div>

          {/* Technologies */}
          <div>
            <label
              htmlFor="technology"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Technologies
            </label>

            <div className="flex gap-2">
              <input
                id="technology"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
                placeholder="e.g. Next.js"
                className="h-10 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
              />

              <button
                type="button"
                onClick={addTechnology}
                className="flex h-10 items-center gap-1 rounded-xl border border-border bg-background px-3 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {/* Technology badges */}
            {technologies.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted"
                  >
                    {tech}

                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="text-muted transition hover:text-red-400 hover:cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* GitHub */}
          <div>
            <label
              htmlFor="githubUrl"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              GitHub Repository
              <span className="ml-2 text-xs font-normal text-muted">
                Optional
              </span>
            </label>

            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              placeholder="https://github.com/username/project"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 hover:cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
