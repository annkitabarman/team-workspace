import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: {
      clerkUserId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return Response.json(projects);
}
