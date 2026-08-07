import { LucideIcon } from "lucide-react";

type DashboardOverviewProps = {
  title: string;
  value: number;
  icon: LucideIcon;
};

export default function DashboardOverview({
  title,
  value,
  icon: Icon,
}: DashboardOverviewProps) {
  return (
    <div className="min-w-56 rounded-2xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-surface-hover hover:shadow-lg hover:shadow-violet-500/10">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{title}</p>

        <Icon className="h-5 w-5 text-violet-500" />
      </div>

      <p className="mt-5 text-4xl font-bold text-foreground">{value}</p>
    </div>
  );
}
