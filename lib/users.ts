import { prisma } from "./prisma";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
    },
    orderBy: {
      fullName: "asc",
    },
  });
}
