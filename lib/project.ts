import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

type CreateProjectData = {
  projectName: string;
  description?: string;
  githubUrl?: string;
  technologies: string[];
};

export async function createProject(data: CreateProjectData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.create({
    data: {
      projectName: data.projectName,
      description: data.description || "",
      githubUrl: data.githubUrl || null,
      technologies: data.technologies,
      clerkUserId: userId,
    },
  });

  return project;
}
