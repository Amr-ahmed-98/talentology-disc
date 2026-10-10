"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AssessmentForm } from "@/components/assessment/AssessmentForm";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { AssessmentData } from "@/lib/types";
import { useApiData } from "@/lib/use-api-data";

function AssessmentContent() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { data, error, loading } = useApiData<AssessmentData>(`/assessment/${token}`);

  useEffect(() => {
    if (data?.completed) router.replace(`/results/${token}`);
  }, [data, router, token]);

  if (loading) return <StatusMessage>Loading assessment...</StatusMessage>;
  if (error || !data) return <StatusMessage>{error ?? "Could not load the assessment"}</StatusMessage>;
  if (data.completed) return <StatusMessage>Opening your results...</StatusMessage>;

  return (
    <AssessmentForm token={token} participantName={data.participantName} groups={data.groups} />
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<StatusMessage>Loading assessment...</StatusMessage>}>
      <AssessmentContent />
    </Suspense>
  );
}