import { prisma } from "./prisma";

export type CreateProjectData = {
  projectName: string;
  description?: string;
  githubUrl?: string;
  technologies: string[];
};

export type CreateProjectWithUserData = CreateProjectData & {
  clerkUserId: string;
};

export async function searchProject(query: string) {
  console.log(query);
  return null;
}

export async function createProject(data: CreateProjectWithUserData) {
  const project = await prisma.project.create({
    data: {
      projectName: data.projectName,
      description: data.description || "",
      githubUrl: data.githubUrl || undefined,
      technologies: data.technologies,
      clerkUserId: data.clerkUserId,
    },
  });

  return project;
}

export async function deleteProject(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      clerkUserId: userId,
    },
  });

  if (!project) throw new Error("No project found");

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}

export async function updateProject(
  projectId: string,
  data: CreateProjectWithUserData,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      clerkUserId: data.clerkUserId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      projectName: data.projectName,
      description: data.description || "",
      githubUrl: data.githubUrl || null,
      technologies: data.technologies,
    },
  });
}
