import NoteCard from "./note-card";

type Note = {
  id: number;
  title: string;
  description: string;
  updatedAt: string;
};

type NotesSectionProps = {
  notes: Note[];
};

export default function DashboardNotes({ notes }: NotesSectionProps) {
  return (
    <div className="mt-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Recent Notes</h2>

        <button className="text-sm font-medium text-violet-500 transition hover:text-violet-400 hover:cursor-pointer hover:cursor-pointer">
          View All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            title={note.title}
            description={note.description}
            updatedAt={note.updatedAt}
          />
        ))}
      </div>
    </div>
  );
}
