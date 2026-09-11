"use server";

import {
  createTask,
  CreateTaskData,
  getManyTasks,
  deleteTask,
  updateReproSteps,
  updateTask,
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

export async function updateTaskAction(id: string, data: CreateTaskData) {
  const clerkUserId = await getAuthenticatedUser();

  const currentUser = await prisma.user.findUnique({
    where: {
      clerkUserId: clerkUserId,
    },
    select: {
      id: true,
    },
  });

  if (!currentUser) {
    throw new Error("User not found");
  }

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
    select: {
      assigneeId: true,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (currentUser.id !== task.assigneeId) {
    throw new Error("You are not allowed to edit this task");
  }

  const result = await updateTask(id, clerkUserId, {
    ...data,
    clerkUserId: clerkUserId,
  });

  if (result.count === 0) {
    throw new Error("Task could not be updated");
  }

  revalidatePath(`/tasks/${id}`);
  revalidatePath("/tasks");
  revalidatePath("/projects");

  return result;
}
