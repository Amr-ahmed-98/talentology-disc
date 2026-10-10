"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ParticipantTable } from "@/components/dashboard/ParticipantTable";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { ParticipantRow } from "@/lib/types";
import { useApiData } from "@/lib/use-api-data";
import { useRequiredSession } from "@/lib/use-session";

export default function FacilitatorPage() {
  const session = useRequiredSession("FACILITATOR");
  const { data, error } = useApiData<ParticipantRow[]>(
    session ? "/facilitator/participants" : null,
    session?.token,
  );

  if (!session) return <StatusMessage>Loading...</StatusMessage>;

  return (
    <>
      <DashboardHeader title="Participants" session={session} />
      {error && <StatusMessage>{error}</StatusMessage>}
      {!error && !data && <StatusMessage>Loading participants...</StatusMessage>}
      {data && <ParticipantTable participants={data} />}
    </>
  );
}