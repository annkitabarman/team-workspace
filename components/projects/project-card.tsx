"use client";

import {
  FolderKanban,
  Bug,
  Sparkles,
  CheckCircle2,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Archive,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type ProjectCardProps = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  bugs: number;
  features: number;
  completed: number;
  updatedAt: string;
};

export default function ProjectCard({
  id,
  name,
  description,
  technologies,
  bugs,
  features,
  completed,
  updatedAt,
}: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      onClick={() => router.push(`/projects/${id}`)}
      ref={menuRef}
      className="group relative flex min-h-[340px] cursor-pointer flex-col rounded-2xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-surface-hover hover:shadow-xl hover:shadow-violet-500/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-500/10 p-2">
            <FolderKanban className="h-5 w-5 text-violet-500" />
          </div>

          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        </div>

        {/* More menu */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="rounded-lg p-1.5 text-muted opacity-0 transition hover:bg-background hover:text-foreground group-hover:opacity-100 hover:cursor-pointer"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-9 z-50 w-44 overflow-hidden rounded-xl border border-border bg-background py-1 shadow-xl"
            >
              {/* Open */}
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground"
                onClick={() => {
                  console.log("Open project:", id);
                  setMenuOpen(false);
                }}
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </button>

              {/* Edit */}
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground"
                onClick={() => {
                  console.log("Edit project:", id);
                  setMenuOpen(false);
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              {/* Archive */}
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground"
                onClick={() => {
                  console.log("Archive project:", id);
                  setMenuOpen(false);
                }}
              >
                <Archive className="h-4 w-4" />
                Archive
              </button>

              <div className="my-1 border-t border-border" />

              {/* Delete */}
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                onClick={() => {
                  console.log("Delete project:", id);
                  setMenuOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">
        {description}
      </p>

      {/* Tech Stack */}
      <div className="mt-5 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Push everything below to the bottom */}
      <div className="flex-1" />

      {/* Stats */}
      <div className="mt-6 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1 text-red-400">
          <Bug className="h-4 w-4" />
          {bugs}
        </div>

        <div className="flex items-center gap-1 text-amber-400">
          <Sparkles className="h-4 w-4" />
          {features}
        </div>

        <div className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {completed}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">Updated {updatedAt}</p>
      </div>
    </div>
  );
}
