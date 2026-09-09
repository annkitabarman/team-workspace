import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectDetails from "@/components/projects/project-details";

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, pendingCounts] = await Promise.all([
    prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        tasks: {
          select: {
            id: true,
            taskName: true,
            type: true,
            priority: true,
            status: true,
            assignee: {
              select: {
                fullName: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    }),

    prisma.task.groupBy({
      by: ["type"],
      where: {
        projectId: id,
        status: {
          not: "COMPLETED",
        },
      },
      _count: true,
    }),
  ]);

  if (!project) {
    notFound();
  }

  const counts = {
    bugs: pendingCounts.find((item) => item.type === "BUG")?._count ?? 0,
    features:
      pendingCounts.find((item) => item.type === "FEATURE")?._count ?? 0,
    tasks: pendingCounts.find((item) => item.type === "TASK")?._count ?? 0,
  };
  return <ProjectDetails project={project} counts={counts} />;
}
