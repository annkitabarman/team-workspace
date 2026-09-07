import { prisma } from "./prisma";

export type CreateTaskData = {
  taskName: string;
  description?: string;
  type: "TASK" | "FEATURE" | "BUG";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  clerkUserId: string;
  projectId?: string;
};

export async function createTask(data: CreateTaskData) {
  const task = await prisma.task.create({
    data: {
      taskName: data.taskName,
      description: data.description || null,
      type: data.type,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      clerkUserId: data.clerkUserId,
      projectId: data.projectId || null,
    },
  });

  return task;
}

export async function getTasks(clerkUserId: string) {
  return prisma.task.findMany({
    where: { clerkUserId },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getTask(id: string, clerkUserId: string) {
  return prisma.task.findFirst({
    where: {
      id,
      clerkUserId,
    },
    include: {
      project: true,
    },
  });
}

export async function updateTask(
  id: string,
  clerkUserId: string,
  data: CreateTaskData,
) {
  return prisma.task.updateMany({
    where: {
      id,
      clerkUserId,
    },
    data: {
      ...data,
      dueDate:
        data.dueDate === undefined
          ? undefined
          : data.dueDate
            ? new Date(data.dueDate)
            : null,
    },
  });
}

export async function deleteTask(id: string, clerkUserId: string) {
  return prisma.task.deleteMany({
    where: {
      id,
      clerkUserId,
    },
  });
}
