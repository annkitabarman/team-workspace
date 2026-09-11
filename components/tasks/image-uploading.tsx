"use client";

import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

function ImageUploadingView() {
  return (
    <NodeViewWrapper className="my-3">
      <div className="flex h-40 w-full items-center justify-center rounded-lg border border-border bg-surface">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-violet-400" />
      </div>
    </NodeViewWrapper>
  );
}

export const ImageUploading = Node.create({
  name: "imageUploading",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      uploadId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-image-uploading]",
      },
    ];
  },

  renderHTML() {
    return [
      "div",
      {
        "data-image-uploading": "",
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadingView);
  },
});
