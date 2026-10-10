import { StatusBadge } from "@/components/ui/StatusBadge";
import type { DashboardSummary } from "@/lib/types";

export function ParticipantStatusList({
  participants,
}: {
  participants: DashboardSummary["participants"];
}) {
  return (
    <ul className="divide-y divide-slate-100">
      {participants.map((participant) => (
        <li key={participant.id} className="flex items-center justify-between py-3">
          <span className="font-medium">{participant.name}</span>
          <span className="flex items-center gap-4">
            <span className="w-8 text-right font-semibold">{participant.profileCode ?? "—"}</span>
            <StatusBadge status={participant.status} />
          </span>
        </li>
      ))}
    </ul>
  );
}