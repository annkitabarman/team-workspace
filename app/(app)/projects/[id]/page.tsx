import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bug,
  CheckCircle2,
  ExternalLink,
  FolderKanban,
  Pencil,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="px-8 py-8">
      {/* Back */}
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-violet-500/10 p-3">
              <FolderKanban className="h-6 w-6 text-violet-500" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {project.projectName}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                GitHub
              </a>
            )}

            <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 hover:cursor-pointer">
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Technologies */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Bug className="h-4 w-4 text-red-400" />
            Bugs
          </div>

          <p className="mt-3 text-3xl font-bold text-foreground">0</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Features
          </div>

          <p className="mt-3 text-3xl font-bold text-foreground">0</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-sm text-muted">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Completed
          </div>

          <p className="mt-3 text-3xl font-bold text-foreground">0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="col-span-2 rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Recent Tasks
              </h2>

              <p className="mt-1 text-sm text-muted">
                Keep track of what needs to be done.
              </p>
            </div>

            <button className="text-sm font-medium text-violet-400 transition hover:text-violet-300 hover:cursor-pointer">
              View All
            </button>
          </div>

          {/* Empty state for now */}
          <div className="mt-6 flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border">
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-muted" />

              <p className="mt-3 text-sm font-medium text-foreground">
                No tasks yet
              </p>

              <p className="mt-1 text-xs text-muted">
                Create a task to start tracking your progress.
              </p>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Project Info
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Created
              </p>

              <p className="mt-1 text-sm text-foreground">
                {project.createdAt.toLocaleDateString("en-GB")}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-foreground">
                {project.updatedAt.toLocaleDateString("en-GB")}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Technologies
              </p>

              <p className="mt-1 text-sm text-foreground">
                {project.technologies.length} technologies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
