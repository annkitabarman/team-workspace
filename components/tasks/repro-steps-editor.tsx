"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Code, ImageIcon } from "lucide-react";
import { Image } from "@tiptap/extension-image";
import { ImageUploading } from "./image-uploading";

type ReproStepsEditorProps = {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
};

export default function ReproStepsEditor({
  initialContent,
  onSave,
  onCancel,
}: ReproStepsEditorProps) {
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();

    return data.url as string;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      ImageUploading,
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-70 px-4 py-3 text-sm leading-5.5 text-foreground outline-none [&_p]:mb-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_strong]:font-semibold [&_a]:text-violet-400 [&_a]:underline [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-black/40 [&_pre]:px-4 [&_pre]:py-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-6 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
      },
    },
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive("bold") ?? false,
      isItalic: editor?.isActive("italic") ?? false,
      isBulletList: editor?.isActive("bulletList") ?? false,
      isOrderedList: editor?.isActive("orderedList") ?? false,
      isCodeBlock: editor?.isActive("codeBlock") ?? false,
    }),
  });

  const isBold = editorState?.isBold ?? false;
  const isItalic = editorState?.isItalic ?? false;
  const isBulletList = editorState?.isBulletList ?? false;
  const isOrderedList = editorState?.isOrderedList ?? false;
  const isCodeBlock = editorState?.isCodeBlock ?? false;

  if (!editor) {
    return null;
  }

  const handleSave = async () => {
    const html = editor.getHTML();

    const isEmpty = editor.getText().trim() === "" && !html.includes("<img");

    await onSave(isEmpty ? "" : html);
  };

  const handleImageUpload = async () => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];

      if (!file) {
        return;
      }

      const uploadId = crypto.randomUUID();

      const { state, view } = editor;

      // Insert loading placeholder
      const placeholder = state.schema.nodes.imageUploading.create({
        uploadId,
      });

      view.dispatch(state.tr.replaceSelectionWith(placeholder));

      try {
        const url = await uploadImage(file);

        // Find this specific placeholder
        let placeholderPos: number | null = null;

        view.state.doc.descendants((node, pos) => {
          if (
            node.type.name === "imageUploading" &&
            node.attrs.uploadId === uploadId
          ) {
            placeholderPos = pos;
            return false;
          }

          return true;
        });

        if (placeholderPos === null) {
          return;
        }

        // Create actual image
        const imageNode = view.state.schema.nodes.image.create({
          src: url,
          alt: file.name,
        });

        // Replace spinner with image
        view.dispatch(
          view.state.tr.replaceWith(
            placeholderPos,
            placeholderPos + 1,
            imageNode,
          ),
        );
      } catch (error) {
        console.error("Image upload failed:", error);

        // Remove failed placeholder
        let placeholderPos: number | null = null;

        view.state.doc.descendants((node, pos) => {
          if (
            node.type.name === "imageUploading" &&
            node.attrs.uploadId === uploadId
          ) {
            placeholderPos = pos;
            return false;
          }

          return true;
        });

        if (placeholderPos !== null) {
          view.dispatch(
            view.state.tr.delete(placeholderPos, placeholderPos + 1),
          );
        }
      }
    };

    input.click();
  };

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border px-2 py-2">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-md p-2 transition hover:cursor-pointer ${
            isBold
              ? "bg-violet-500/15 text-violet-400"
              : "text-muted hover:bg-surface-hover hover:text-foreground "
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-md p-2 transition hover:cursor-pointer ${
            isItalic
              ? "bg-violet-500/15 text-violet-400"
              : "text-muted hover:bg-surface-hover hover:text-foreground"
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Bullet list */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-md p-2 transition hover:cursor-pointer ${
            isBulletList
              ? "bg-violet-500/15 text-violet-400"
              : "text-muted hover:bg-surface-hover hover:text-foreground"
          }`}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>

        {/* Numbered list */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-md p-2 transition hover:cursor-pointer ${
            isOrderedList
              ? "bg-violet-500/15 text-violet-400"
              : "text-muted hover:bg-surface-hover hover:text-foreground"
          }`}
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          onClick={handleImageUpload}
          className="rounded-md p-2 text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer"
          title="Insert image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        {/* Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`rounded-md p-2 transition hover:cursor-pointer ${
            isCodeBlock
              ? "bg-violet-500/15 text-violet-400"
              : "text-muted hover:bg-surface-hover hover:text-foreground"
          }`}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 border-t border-border px-3 py-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-violet-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-600 hover:cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
}
