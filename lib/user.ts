import { prisma } from "./prisma";

export async function createUser(data: {
  clerkUserId: string;
  fullName: string;
  email: string;
}) {
  return prisma.user.upsert({
    where: {
      clerkUserId: data.clerkUserId,
    },
    update: {},
    create: data,
  });
}
