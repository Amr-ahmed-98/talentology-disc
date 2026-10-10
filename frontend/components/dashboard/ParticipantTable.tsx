import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DIMENSION_ORDER } from "@/lib/dimensions";
import type { ParticipantRow } from "@/lib/types";
import { CopyLinkButton } from "./CopyLinkButton";

export function ParticipantTable({ participants }: { participants: ParticipantRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Participant</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Profile</th>
            {DIMENSION_ORDER.map((dimension) => (
              <th key={dimension} className="px-4 py-3 text-center font-medium">
                {dimension}
              </th>
            ))}
            <th className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td className="px-4 py-3">
                <p className="font-medium">{participant.name}</p>
                <p className="text-slate-500">{participant.email}</p>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={participant.status} />
              </td>
              <td className="px-4 py-3 font-semibold">{participant.profileCode ?? "—"}</td>
              {DIMENSION_ORDER.map((dimension) => (
                <td key={dimension} className="px-4 py-3 text-center">
                  {participant.scores?.[dimension] ?? "—"}
                </td>
              ))}
              <td className="space-x-4 whitespace-nowrap px-4 py-3 text-right">
                {participant.status === "COMPLETED" && (
                  <Link
                    href={`/facilitator/participants/${participant.id}`}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    View report
                  </Link>
                )}
                <CopyLinkButton path={`/assessment/${participant.inviteToken}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}