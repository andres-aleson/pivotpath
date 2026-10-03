"use client";

import type { MilestoneStatus } from "@/lib/roadmap/schema";

export function MilestoneStatusControl({
  status,
  onChange,
}: {
  status: MilestoneStatus;
  onChange: (next: MilestoneStatus) => void;
}) {
  if (status === "done") {
    return (
      <button
        onClick={() => onChange("todo")}
        className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline"
      >
        Reopen
      </button>
    );
  }

  if (status === "in_progress") {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange("todo")}
          className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline"
        >
          Back to To Do
        </button>
        <button
          onClick={() => onChange("done")}
          className="px-6 py-2 bg-secondary text-on-secondary rounded-lg text-label-md font-bold hover:brightness-110 transition-all outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
        >
          Mark Complete
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => onChange("in_progress")}
      className="px-6 py-2 border border-secondary text-secondary rounded-lg text-label-md font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-all outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
    >
      Start
    </button>
  );
}
