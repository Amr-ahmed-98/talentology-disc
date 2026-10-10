"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ResultReport } from "@/components/results/ResultReport";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { Report } from "@/lib/types";
import { useApiData } from "@/lib/use-api-data";
import { useRequiredSession } from "@/lib/use-session";

function ReportContent({ data, error }: { data?: Report; error?: string }) {
  if (error) return <StatusMessage>{error}</StatusMessage>;
  if (!data) return <StatusMessage>Loading report...</StatusMessage>;
  return <ResultReport report={data} />;
}

function ParticipantReportContent() {
  const { id } = useParams<{ id: string }>();
  const session = useRequiredSession("FACILITATOR");
  const { data, error } = useApiData<Report>(
    session ? `/facilitator/participants/${id}/report` : null,
    session?.token,
  );

  if (!session) return <StatusMessage>Loading...</StatusMessage>;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/facilitator"
        className="mb-6 inline-block text-sm font-medium text-indigo-600 hover:underline"
      >
        ← Back to participants
      </Link>
      <ReportContent data={data} error={error} />
    </div>
  );
}

export default function ParticipantReportPage() {
  return (
    <Suspense fallback={<StatusMessage>Loading...</StatusMessage>}>
      <ParticipantReportContent />
    </Suspense>
  );
}