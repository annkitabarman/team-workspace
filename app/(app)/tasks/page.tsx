import AllTasks from "@/components/tasks/all-tasks";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getAllUsers } from "@/lib/users";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) return null;

  const [allTasks, projects, users] = await Promise.all([
    prisma.task.findMany({
      where: {
        clerkUserId: userId,
      },
      include: {
        project: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.project.findMany({
      where: {
        clerkUserId: userId,
      },
      orderBy: {
        projectName: "asc",
      },
    }),

    getAllUsers(),
  ]);

  return <AllTasks tasks={allTasks} projects={projects} users={users} />;
}
