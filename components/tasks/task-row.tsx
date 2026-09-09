"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Task } from "./all-tasks";
import {
  CheckCircle2,
  Circle,
  Bug,
  Sparkles,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import clsx from "clsx";
import DeleteItemModal from "../modal-popup/delete-item-popup";
import { deleteTaskAction } from "@/app/actions/tasks";

export default function TaskRow({ task }: { task: Task }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="group grid grid-cols-[1fr_180px_140px_120px_40px] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 transition hover:bg-surface-hover">
        {/* Task */}
        <div className="flex min-w-0 items-start gap-3">
          <button className="mt-0.5 text-muted transition hover:text-violet-500">
            {task.status === "COMPLETED" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {task.type === "BUG" ? (
                <Bug className="h-4 w-4 shrink-0 text-red-400" />
              ) : (
                <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
              )}

              <p
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/tasks/${task.id}`);
                }}
                className={clsx(
                  "cursor-pointer truncate text-sm font-medium hover:text-violet-400",
                  task.status === "COMPLETED"
                    ? "text-muted line-through"
                    : "text-foreground",
                )}
              >
                {task.taskName}
              </p>
            </div>

            <p className="mt-1 truncate text-xs text-muted">
              {task.description}
            </p>
          </div>
        </div>

        {/* Project */}
        <span className="truncate text-xs text-muted">
          {task.project?.projectName ?? "No Project"}
        </span>

        {/* Priority */}
        <span
          className={clsx(
            "w-fit rounded-full border px-3 py-1 text-xs font-medium",
            task.priority === "HIGH" &&
              "border-red-500/30 bg-red-500/10 text-red-400",
            task.priority === "MEDIUM" &&
              "border-amber-500/30 bg-amber-500/10 text-amber-400",
            task.priority === "LOW" &&
              "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
          )}
        >
          {task.priority}
        </span>

        {/* Due date */}
        <div className="flex items-center gap-2 text-xs text-muted">
          <Calendar className="h-4 w-4" />
          {formatDate(task.dueDate)}
        </div>

        {/* More */}
        <div ref={menuRef} className="relative flex justify-end">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={clsx(
              "rounded-lg p-1.5 text-muted transition hover:bg-surface-hover hover:text-foreground hover:cursor-pointer",
              isMenuOpen
                ? "bg-surface-hover text-foreground"
                : "opacity-0 group-hover:opacity-100",
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 bottom-9 overflow-hidden z-50 w-40 rounded-xl border border-border bg-background p-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push(`/tasks/${task.id}`);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-surface-hover hover:cursor-pointer"
              >
                Open
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: open edit modal
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-surface-hover hover:cursor-pointer"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  // TODO: toggle task status
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-surface-hover hover:cursor-pointer"
              >
                {task.status === "COMPLETED"
                  ? "Mark as incomplete"
                  : "Mark as completed"}
              </button>

              <div className="my-1 border-t border-border" />

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setDeleteModalOpen(true);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <DeleteItemModal
        isOpen={deleteModalOpen}
        itemName={task.taskName}
        itemType="Task"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          await deleteTaskAction(task.id);
          setDeleteModalOpen(false);
        }}
      />
    </>
  );
}

function formatDate(date: Date | null) {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
