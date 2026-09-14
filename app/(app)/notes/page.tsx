import AllNotes from "@/components/notes/all-notes";
import { getAllNotes } from "@/lib/notes";
import { getAuthenticatedUser } from "@/app/actions/auth";

export default async function Home() {
  const userId = await getAuthenticatedUser();
  const notes = await getAllNotes(userId);

  return <AllNotes notes={notes} />;
}
