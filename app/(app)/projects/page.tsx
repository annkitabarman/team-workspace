import AllProjects from "@/components/projects/all-projects";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [projects, taskCounts] = await Promise.all([
    prisma.project.findMany({
      where: { clerkUserId: userId },
      orderBy: { projectName: "asc" },
    }),

    prisma.task.groupBy({
      by: ["projectId", "type"],
      where: {
        clerkUserId: userId,
        projectId: { not: null },
        status: {
          not: "COMPLETED",
        },
      },
      _count: true,
    }),
  ]);

  const projectsWithCounts = projects.map((project) => {
    const projectTasks = taskCounts.filter(
      (count) => count.projectId === project.id,
    );

    return {
      ...project,
      taskCounts: {
        bugs: projectTasks.find((count) => count.type === "BUG")?._count ?? 0,

        features:
          projectTasks.find((count) => count.type === "FEATURE")?._count ?? 0,

        tasks: projectTasks.find((count) => count.type === "TASK")?._count ?? 0,
      },
    };
  });

  return <AllProjects projects={projectsWithCounts} />;
}
