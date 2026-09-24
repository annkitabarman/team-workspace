import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import NoteEditor from "@/components/notes/note-editor";
import { getProjects } from "@/lib/project";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const projects = await getProjects(userId);

  return <NoteEditor mode="create" projects={projects} />;
}
