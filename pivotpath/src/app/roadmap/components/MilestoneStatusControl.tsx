"use client";

import { useTransition } from "react";
import { updateMilestoneStatus } from "@/app/roadmap/actions";
import type { MilestoneStatus } from "@/lib/roadmap/schema";

export function MilestoneStatusControl({
  milestoneId,
  status,
}: {
  milestoneId: string;
  status: MilestoneStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function setStatus(next: MilestoneStatus) {
    startTransition(() => {
      updateMilestoneStatus(milestoneId, next);
    });
  }

  if (status === "done") {
    return (
      <button
        onClick={() => setStatus("todo")}
        disabled={isPending}
        className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline disabled:opacity-40"
      >
        Reopen
      </button>
    );
  }

  if (status === "in_progress") {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => setStatus("todo")}
          disabled={isPending}
          className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline disabled:opacity-40"
        >
          Back to To Do
        </button>
        <button
          onClick={() => setStatus("done")}
          disabled={isPending}
          className="px-6 py-2 bg-secondary text-on-secondary rounded-lg text-label-md font-bold hover:brightness-110 transition-all disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
        >
          {isPending ? "Saving..." : "Mark Complete"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setStatus("in_progress")}
      disabled={isPending}
      className="px-6 py-2 border border-secondary text-secondary rounded-lg text-label-md font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-all disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
    >
      {isPending ? "Saving..." : "Start"}
    </button>
  );
}
