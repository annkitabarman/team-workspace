"use server";

import {
  createTask,
  CreateTaskData,
  getManyTasks,
  deleteTask,
  updateReproSteps,
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

export async function updateReproStepsAction(
  taskId: string,
  reproSteps: string,
) {
  const clerkUserId = await getAuthenticatedUser();

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await updateReproSteps(taskId, user.id, reproSteps);

  revalidatePath(`/tasks/${taskId}`);
}
