import AllProjects from "@/components/projects/all-projects";
import { prisma } from "@/lib/prisma";
import { getProjects } from "@/lib/project";
import { getAuthenticatedUser } from "@/app/actions/auth";

export default async function Page() {
  const userId = await getAuthenticatedUser();
  const [projects, taskCounts] = await Promise.all([
    getProjects(userId),

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
