"use client";

import { MoreHorizontal, Notebook, Plus, Pin, Search } from "lucide-react";
import { useState } from "react";

type Note = {
  id: number;
  title: string;
  description: string;
  project: string;
  updatedAt: string;
  pinned: boolean;
};

const notes: Note[] = [
  {
    id: 1,
    title: "Authentication",
    description:
      "Clerk handles authentication while PostgreSQL stores application data.",
    project: "Team Workspace",
    updatedAt: "Today",
    pinned: true,
  },
  {
    id: 2,
    title: "Portfolio Ideas",
    description:
      "Ideas for improving the portfolio including animations, project pages, and case studies.",
    project: "Portfolio",
    updatedAt: "Yesterday",
    pinned: false,
  },
  {
    id: 3,
    title: "Angular Signals",
    description:
      "Notes about signals, computed values, effects, and when to use them instead of RxJS.",
    project: "Media Tracker",
    updatedAt: "3 days ago",
    pinned: false,
  },
  {
    id: 4,
    title: "Project Architecture",
    description:
      "Application structure, route groups, layouts, authentication flow, and database architecture.",
    project: "Team Workspace",
    updatedAt: "4 days ago",
    pinned: true,
  },
  {
    id: 5,
    title: "Interview Questions",
    description:
      "Frontend, React, Angular, TypeScript, and system design questions to revise.",
    project: "Career",
    updatedAt: "1 week ago",
    pinned: false,
  },
  {
    id: 6,
    title: "TMDB API",
    description:
      "Endpoints, query parameters, genre IDs, pagination, and caching strategy.",
    project: "Media Tracker",
    updatedAt: "1 week ago",
    pinned: false,
  },
];

const filters = ["All", "Recent", "Pinned"];

export default function AllNotes() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredNotes = notes.filter((note) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm) ||
      note.description.toLowerCase().includes(searchTerm) ||
      note.project.toLowerCase().includes(searchTerm);

    const matchesFilter =
      selectedFilter === "All" ||
      (selectedFilter === "Pinned" && note.pinned) ||
      (selectedFilter === "Recent" &&
        ["Today", "Yesterday"].includes(note.updatedAt));

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

        <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 hover:cursor-pointer">
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

        <button className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground">
          All Projects
        </button>
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
      {filteredNotes.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note) => (
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
  return (
    <div className="group flex min-h-[260px] cursor-pointer flex-col rounded-2xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-surface-hover hover:shadow-xl hover:shadow-violet-500/10">
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
        {note.description}
      </p>

      <div className="flex-1" />

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs font-medium text-muted">{note.project}</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Updated {note.updatedAt}
          </p>
        </div>

        <button className="text-xs font-medium text-violet-500 transition hover:text-violet-400">
          Open →
        </button>
      </div>
    </div>
  );
}
