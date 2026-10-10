"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { ResultReport } from "@/components/results/ResultReport";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { Report } from "@/lib/types";
import { useApiData } from "@/lib/use-api-data";

function ResultContent() {
  const { token } = useParams<{ token: string }>();
  const { data, error, loading } = useApiData<Report>(`/assessment/${token}/result`);

  if (loading) return <StatusMessage>Loading your results...</StatusMessage>;
  if (error || !data) return <StatusMessage>{error ?? "Could not load the results"}</StatusMessage>;

  return (
    <div className="mx-auto max-w-3xl">
      <ResultReport report={data} />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<StatusMessage>Loading your results...</StatusMessage>}>
      <ResultContent />
    </Suspense>
  );
}