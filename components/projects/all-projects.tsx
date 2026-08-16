"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import ProjectCard from "./project-card";
import AddProjectModal from "../modal-popup/add-edit-project-popup";

type Project = {
  id: string;
  projectName: string;
  description: string | null;
  githubUrl: string | null;
  technologies: string[];
  clerkUserId: string;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectsClientProps = {
  projects: Project[];
};

export default function AllProjects({ projects }: ProjectsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>

          <p className="mt-2 text-sm text-muted">
            Manage all your personal and team projects.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-violet-500"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-8 w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

        <input
          placeholder="Search projects..."
          className="h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
        />
      </div>

      {/* Projects */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted">No projects yet.</p>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.projectName}
              description={project.description ?? ""}
              technologies={project.technologies}
              bugs={0}
              features={0}
              completed={0}
              updatedAt={project.updatedAt.toLocaleDateString("en-GB")}
              onEdit={() => {
                setEditingProject(project);
                setIsModalOpen(true);
              }}
            />
          ))
        )}
      </div>

      <AddProjectModal
        key={editingProject?.id ?? "create"}
        mode={editingProject ? "edit" : "create"}
        isOpen={isModalOpen}
        project={editingProject ?? undefined}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
      />
    </div>
  );
}
