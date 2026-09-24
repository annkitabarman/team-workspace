"use client";

import { MoreHorizontal, Notebook, Plus, Pin, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: string;
  title: string;
  content: string;
  project: {
    id: string;
    projectName: string;
  } | null;
  updatedAt: Date;
  pinned: boolean;
};

type NotesClientProp = {
  notes: Note[];
};

const filters = ["All", "Recent", "Pinned"];

export default function AllNotes({ notes }: NotesClientProp) {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const router = useRouter();

  const filteredNotes = notes?.filter((note) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm) ||
      note.project?.projectName.toLowerCase().includes(searchTerm);

    const now = new Date();

    const isRecent =
      now.getTime() - note.updatedAt.getTime() <= 2 * 24 * 60 * 60 * 1000;

    const matchesFilter =
      selectedFilter === "All" ||
      (selectedFilter === "Pinned" && note.pinned) ||
      (selectedFilter === "Recent" && isRecent);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes</h1>

          <p className="mt-2 text-sm text-muted">
            Capture ideas, decisions, and useful information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/notes/new")}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 hover:cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Search + project filter */}
      <div className="mt-8 flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="h-10 w-80 rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-violet-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex items-center gap-2 border-b border-border">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              selectedFilter === filter
                ? "border-violet-500 text-violet-500"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notes */}
      {filteredNotes?.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredNotes?.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Notebook className="h-10 w-10 text-muted" />

          <p className="mt-4 font-medium text-foreground">No notes found</p>

          <p className="mt-1 text-sm text-muted">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/notes/${note.id}`)}
      className="group flex min-h-[260px] cursor-pointer flex-col rounded-2xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-surface-hover hover:shadow-xl hover:shadow-violet-500/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-violet-500/10 p-2">
          <Notebook className="h-5 w-5 text-violet-500" />
        </div>

        <div className="flex items-center gap-2">
          {note.pinned && (
            <Pin className="h-4 w-4 fill-violet-500 text-violet-500" />
          )}

          <button className="opacity-0 transition group-hover:opacity-100">
            <MoreHorizontal className="h-5 w-5 text-muted hover:text-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <h2 className="mt-5 line-clamp-1 text-lg font-semibold text-foreground">
        {note.title}
      </h2>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
        {getTextPreview(note.content)}
      </p>

      <div className="flex-1" />

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs font-medium text-muted">
            {note.project?.projectName}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Updated {note.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function getTextPreview(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}
