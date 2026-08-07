import { Notebook } from "lucide-react";

type NoteCardProps = {
  title: string;
  description: string;
  updatedAt: string;
};

export default function NoteCard({
  title,
  description,
  updatedAt,
}: NoteCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-surface-hover hover:shadow-lg hover:shadow-violet-500/10">
      <div className="flex items-start justify-between">
        <h3 className="line-clamp-1 text-base font-semibold text-foreground">
          {title}
        </h3>

        <Notebook className="h-5 w-5 text-violet-500" />
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
        {description}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{updatedAt}</span>

        <button className="text-xs font-medium text-violet-500 transition hover:text-violet-400 hover:cursor-pointer">
          Open →
        </button>
      </div>
    </div>
  );
}
