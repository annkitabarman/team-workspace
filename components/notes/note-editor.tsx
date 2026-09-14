"use client";

import {
  ArrowLeft,
  Bold,
  Check,
  ChevronDown,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useState } from "react";

type Project = {
  id: string;
  projectName: string;
};

type Note = {
  id: string;
  title: string;
  content: string;
  projectId: string | null;
};

type NoteEditorProps = {
  mode: "create" | "edit";
  note?: Note;
  projects: Project[];
};

export default function NoteEditor({ mode, note, projects }: NoteEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(note?.title ?? "");
  const [projectId, setProjectId] = useState(note?.projectId ?? "");
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
      }),
    ],

    content: note?.content ?? "",

    editorProps: {
      attributes: {
        class:
          "min-h-[550px] px-1 pb-20 text-[15px] leading-7 text-foreground outline-none",
      },
    },

    onUpdate: () => {
      setSaved(false);
    },
  });

  const selectedProject = projects.find((project) => project.id === projectId);

  const handleSave = async () => {
    if (!editor) return;

    if (!title.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      const content = editor.getHTML();

      console.log({
        title: title.trim(),
        content,
        projectId: projectId || undefined,
      });

      // TODO:
      // createNoteAction(...)
      // updateNoteAction(...)

      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  const addLink = () => {
    if (!editor) return;

    const currentUrl = editor.getAttributes("link").href;

    const url = window.prompt("Enter URL", currentUrl ?? "https://");

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
        target: "_blank",
      })
      .run();
  };

  const addImage = () => {
    if (!editor) return;

    const url = window.prompt("Enter image URL");

    if (!url) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: url,
      })
      .run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-full bg-background">
      {/* Top navigation */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-8">
          <button
            type="button"
            onClick={() => router.push("/notes")}
            className="group flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Notes
          </button>

          <div className="flex items-center gap-3">
            {saved && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Saved
              </div>
            )}

            <button
              type="button"
              onClick={() => router.push("/notes")}
              className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-foreground"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving || !title.trim()}
              onClick={handleSave}
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Save Note"}
            </button>
          </div>
        </div>
      </header>

      {/* Editor container */}
      <main className="mx-auto max-w-5xl px-8 pb-20 pt-14">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setSaved(false);
          }}
          placeholder="Untitled"
          className="w-full bg-transparent text-4xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted/60"
        />

        {/* Project selector */}
        <div className="relative mt-5">
          <button
            type="button"
            onClick={() => setIsProjectOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-hover hover:text-foreground"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                selectedProject ? "bg-violet-500" : "bg-muted/40"
              }`}
            />

            {selectedProject?.projectName ?? "No project"}

            <ChevronDown
              className={`h-3.5 w-3.5 transition ${
                isProjectOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProjectOpen && (
            <div className="absolute left-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setProjectId("");
                  setIsProjectOpen(false);
                  setSaved(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-muted transition hover:bg-surface-hover hover:text-foreground"
              >
                No project
                {!projectId && <Check className="h-4 w-4 text-violet-500" />}
              </button>

              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    setProjectId(project.id);
                    setIsProjectOpen(false);
                    setSaved(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-muted transition hover:bg-surface-hover hover:text-foreground"
                >
                  {project.projectName}

                  {projectId === project.id && (
                    <Check className="h-4 w-4 text-violet-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mt-8 border-b border-border" />

        {/* Editor */}
        <div className="relative mt-6">
          <EditorContent editor={editor} />

          {/* Floating formatting toolbar */}
          <div className="sticky bottom-6 z-10 mx-auto flex w-fit items-center gap-0.5 rounded-xl border border-border bg-surface/95 p-1.5 shadow-2xl shadow-black/20 backdrop-blur">
            <ToolbarButton
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              active={editor.isActive("heading", { level: 1 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              active={editor.isActive("heading", { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet list"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered list"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              active={editor.isActive("link")}
              onClick={addLink}
              title="Add link"
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton onClick={addImage} title="Add image">
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      </main>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg p-2 transition ${
        active
          ? "bg-violet-500/15 text-violet-500"
          : "text-muted hover:bg-surface-hover hover:text-foreground"
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-border" />;
}
