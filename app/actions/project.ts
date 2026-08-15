"use server";

import { createProject } from "@/lib/project";
import { CreateProjectData } from "@/lib/project";

export async function createProjectAction(data: CreateProjectData) {
  return await createProject(data);
}
