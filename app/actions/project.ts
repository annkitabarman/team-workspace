"use server";

import { getAuthenticatedUser } from "./auth";
import {
  createProject,
  deleteProject,
  updateProject,
  type CreateProjectData,
} from "@/lib/project";
import { revalidatePath } from "next/cache";

export async function createProjectAction(data: CreateProjectData) {
  const userId = await getAuthenticatedUser();

  revalidatePath("/projects");
  return createProject({ ...data, clerkUserId: userId });
}

export async function deleteProjectAction(projectId: string) {
  const userId = await getAuthenticatedUser();

  await deleteProject(projectId, userId);

  revalidatePath("/projects");
}

export async function updateProjectAction(
  projectId: string,
  data: CreateProjectData,
) {
  const userId = await getAuthenticatedUser();

  const project = await updateProject(projectId, {
    ...data,
    clerkUserId: userId,
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);

  return project;
}
