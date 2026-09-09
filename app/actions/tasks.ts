"use server";

import {
  createTask,
  CreateTaskData,
  getManyTasks,
  deleteTask,
} from "@/lib/tasks";
import { getAuthenticatedUser } from "./auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTaskAction(data: CreateTaskData) {
  const userId = await getAuthenticatedUser();
  if (data.projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        clerkUserId: userId,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }
  }

  revalidatePath("/tasks");
  return createTask({ ...data, clerkUserId: userId });
}

export async function getManyTasksAction() {
  const userId = await getAuthenticatedUser();

  return getManyTasks(userId);
}

export async function deleteTaskAction(taskId: string) {
  const userId = await getAuthenticatedUser();

  await deleteTask(taskId, userId);
  revalidatePath("/tasks");
}
