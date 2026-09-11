import { prisma } from "@/lib/prisma";
import TaskDetails from "@/components/tasks/task-details";
import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/app/actions/auth";
import { getProjects } from "@/lib/project";

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const userId = await getAuthenticatedUser();

  const [task, currentUser, projects, users] = await Promise.all([
    prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            projectName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    }),

    prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        id: true,
      },
    }),

    getProjects(userId),

    prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
      },
      orderBy: {
        fullName: "asc",
      },
    }),
  ]);

  if (!task) {
    notFound();
  }

  const projectOptions = projects.map((project) => ({
    id: project.id,
    projectName: project.projectName,
  }));

  const canEdit = task.assigneeId === currentUser?.id;

  return (
    <TaskDetails
      task={task}
      canEdit={canEdit}
      projects={projectOptions}
      users={users}
    />
  );
}
