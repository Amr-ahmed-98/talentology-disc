import type { ParticipantStatus } from "@/lib/types";

const STYLES: Record<ParticipantStatus, string> = {
  COMPLETED: "bg-green-50 text-green-700",
  PENDING: "bg-amber-50 text-amber-700",
};

const LABELS: Record<ParticipantStatus, string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
};

export function StatusBadge({ status }: { status: ParticipantStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}