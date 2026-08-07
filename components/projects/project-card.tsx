import {
  FolderKanban,
  Bug,
  Sparkles,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";

type ProjectCardProps = {
  name: string;
  description: string;
  technologies: string[];
  bugs: number;
  features: number;
  completed: number;
  updatedAt: string;
};

export default function ProjectCard({
  name,
  description,
  technologies,
  bugs,
  features,
  completed,
  updatedAt,
}: ProjectCardProps) {
  return (
    <div className="group flex min-h-[340px] cursor-pointer flex-col rounded-2xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-surface-hover hover:shadow-xl hover:shadow-violet-500/10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-500/10 p-2">
            <FolderKanban className="h-5 w-5 text-violet-500" />
          </div>

          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        </div>

        <button className="opacity-0 transition group-hover:opacity-100">
          <MoreHorizontal className="h-5 w-5 text-muted" />
        </button>
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
