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
