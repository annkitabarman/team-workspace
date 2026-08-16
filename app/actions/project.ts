"use server";

import { createProject, deleteProject } from "@/lib/project";
import { CreateProjectData } from "@/lib/project";
import { revalidatePath } from "next/cache";

export async function createProjectAction(data: CreateProjectData) {
  return await createProject(data);
}

export async function deleteProjectAction(projectId: string) {
  await deleteProject(projectId);

  revalidatePath("/projects");
}
