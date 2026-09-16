"use server";

import { getAuthenticatedUser } from "./auth";
import { createNote, CreateNoteData, updateNote } from "@/lib/notes";
import { revalidatePath } from "next/cache";

export async function createNoteAction(data: CreateNoteData) {
  const userId = await getAuthenticatedUser();
  const note = await createNote({ ...data, clerkUserId: userId });
  revalidatePath("/notes");
  return note;
}

export async function updateNoteAction(id: string, data: CreateNoteData) {
  const userId = await getAuthenticatedUser();
  await updateNote(id, userId, data);
  revalidatePath(`/notes/${id}`);
  revalidatePath("/notes");
}
