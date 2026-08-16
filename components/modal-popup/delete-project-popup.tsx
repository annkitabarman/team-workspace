"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

type DeleteProjectModalProps = {
  isOpen: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteProjectModal({
  isOpen,
  projectName,
  onClose,
  onConfirm,
}: DeleteProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Delete Project
              </h2>

              <p className="mt-1 text-xs text-muted">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-muted">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{projectName}</span>
            ? All project data associated with it will be permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 hover:cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}
