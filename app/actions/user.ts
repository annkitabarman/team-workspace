"use server";

import { prisma } from "@/lib/prisma";

type CreateUserInput = {
  clerkUserId: string;
  fullName: string;
  email: string;
};

export async function createUser(data: CreateUserInput) {
  return prisma.user.upsert({
    where: {
      clerkUserId: data.clerkUserId,
    },
    update: {
      fullName: data.fullName,
      email: data.email,
    },
    create: data,
  });
}
