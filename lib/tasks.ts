import { prisma } from "./prisma";

export type CreateTaskData = {
  taskName: string;
  description?: string;
  type: "TASK" | "FEATURE" | "BUG";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  projectId?: string;
  assigneeId: string;
};

export type CreateTaskDataWithUserId = CreateTaskData & { clerkUserId: string };

export async function createTask(data: CreateTaskDataWithUserId) {
  const task = await prisma.task.create({
    data: {
      taskName: data.taskName,
      description: data.description || null,
      type: data.type,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      clerkUserId: data.clerkUserId,
      projectId: data.projectId || null,
    },
  });

  return task;
}

export async function getManyTasks(clerkUserId: string) {
  return prisma.task.findMany({
    where: { clerkUserId },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      project: true,
      assignee: true,
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
      assignee: true,
      project: true,
    },
  });
}

export async function updateTask(
  id: string,
  clerkUserId: string,
  data: CreateTaskDataWithUserId,
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
