"use server";

import { createProject, deleteProject, updateProject } from "@/lib/project";
import { CreateProjectData } from "@/lib/project";
import { revalidatePath } from "next/cache";

export async function createProjectAction(data: CreateProjectData) {
  return await createProject(data);
}

export async function deleteProjectAction(projectId: string) {
  await deleteProject(projectId);

  revalidatePath("/projects");
}

export async function updateProjectAction(
  projectId: string,
  data: CreateProjectData,
) {
  const project = await updateProject(projectId, data);

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);

  return project;
}
