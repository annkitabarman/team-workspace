"use server";

import { createTask, CreateTaskData } from "@/lib/tasks";
import { getAuthenticatedUser } from "./auth";

export async function createTaskAction(data: CreateTaskData) {
  const userId = await getAuthenticatedUser();

  if (!userId) throw new Error("Unauthorized");

  return createTask({ ...data, clerkUserId: userId });
}
