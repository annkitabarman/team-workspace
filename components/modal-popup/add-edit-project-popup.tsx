"use client";

import { useState } from "react";
import { Plus, X, Pencil } from "lucide-react";
import {
  createProjectAction,
  updateProjectAction,
} from "@/app/actions/project";
import { useRouter } from "next/navigation";

type AddProjectModalProps = {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  project?: {
    id: string;
    projectName: string;
    description: string | null;
    githubUrl: string | null;
    technologies: string[];
  };
};

export default function AddProjectModal({
  isOpen,
  onClose,
  mode,
  project,
}: AddProjectModalProps) {
  const [technologies, setTechnologies] = useState<string[]>(
    project?.technologies ?? [],
  );
  const [technology, setTechnology] = useState("");

  const router = useRouter();

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      projectName: e.currentTarget.projectName.value,
      description: e.currentTarget.description.value || undefined,
      githubUrl: e.currentTarget.githubUrl.value || undefined,
      technologies,
    };

    try {
      if (mode === "create") {
        const createdProject = await createProjectAction(payload);

        onClose();

        router.push(`/projects/${createdProject.id}`);
      } else {
        if (!project) return;

        await updateProjectAction(project.id, payload);

        onClose();

        router.refresh();
      }
    } catch (error) {
      console.error(
        mode === "create"
          ? "Failed to create project:"
          : "Failed to update project:",
        error,
      );
    }
  };

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
              {mode === "create" ? "Create New Project" : "Edit Project"}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {mode === "create"
                ? "Add a project to your workspace."
                : "Update your project details."}
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
              defaultValue={project?.projectName ?? ""}
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
              defaultValue={project?.description ?? ""}
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
                className="flex h-10 items-center gap-1 rounded-xl border border-border bg-background px-3 text-sm text-muted transition hover:cursor-pointer hover:bg-surface-hover hover:text-foreground"
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
                      className="text-muted transition hover:cursor-pointer hover:text-red-400"
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
              defaultValue={project?.githubUrl ?? ""}
              placeholder="https://github.com/username/project"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
            />
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
              {mode === "create" ? (
                <Plus className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}

              {mode === "create" ? "Create Project" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
