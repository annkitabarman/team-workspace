import AllProjects from "@/components/projects/all-projects";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const projects = await prisma.project.findMany({
    where: {
      clerkUserId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return <AllProjects projects={projects} />;
}
