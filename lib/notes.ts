import { prisma } from "./prisma";

export type CreateNoteData = {
  title: string;
  content: string;
  projectId?: string;
};

type CreateNoteDataWithUserId = CreateNoteData & {
  clerkUserId: string;
};

export async function getAllNotes(clerkUserId: string) {
  return prisma.note.findMany({
    where: {
      clerkUserId,
    },
    include: {
      project: {
        select: {
          id: true,
          projectName: true,
        },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}

export async function createNote(data: CreateNoteDataWithUserId) {
  return prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      projectId: data.projectId || null,
      clerkUserId: data.clerkUserId,
    },
  });
}

export async function updateNote(
  id: string,
  clerkUserId: string,
  data: CreateNoteData,
) {
  return prisma.note.updateMany({
    where: {
      id,
      clerkUserId,
    },
    data: {
      title: data.title,
      content: data.content,
      projectId: data.projectId || null,
    },
  });
}
