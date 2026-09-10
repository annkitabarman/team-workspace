import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import TaskDetails from "@/components/tasks/task-details";
import { notFound } from "next/navigation";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const [task, currentUser] = await Promise.all([
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
  ]);

  if (!task) {
    notFound();
  }

  const canEdit = task.assigneeId === currentUser?.id;

  return <TaskDetails task={task} canEdit={canEdit} />;
}
