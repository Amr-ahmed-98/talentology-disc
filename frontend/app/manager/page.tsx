"use client";

import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ParticipantStatusList } from "@/components/dashboard/ParticipantStatusList";
import { ProfileDistributionChart } from "@/components/dashboard/ProfileDistributionChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { ScoreChart } from "@/components/results/ScoreChart";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { DashboardSummary } from "@/lib/types";
import { useApiData } from "@/lib/use-api-data";
import { useRequiredSession } from "@/lib/use-session";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Summary({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Invited" value={summary.totalInvited} />
        <StatCard label="Completed" value={summary.completed} />
        <StatCard label="Pending" value={summary.pending} />
        <StatCard label="Completion" value={`${summary.completionPercentage}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Profile distribution">
          <ProfileDistributionChart distribution={summary.profileDistribution} />
        </Section>
        <Section title="Group average scores">
          <ScoreChart scores={summary.averageScores} />
        </Section>
      </div>

      <Section title="Participant status">
        <ParticipantStatusList participants={summary.participants} />
      </Section>
    </div>
  );
}

export default function ManagerPage() {
  const session = useRequiredSession("MANAGER");
  const { data, error } = useApiData<DashboardSummary>(
    session ? "/manager/dashboard" : null,
    session?.token,
  );

  if (!session) return <StatusMessage>Loading...</StatusMessage>;

  return (
    <>
      <DashboardHeader title="HR Dashboard" session={session} />
      {error && <StatusMessage>{error}</StatusMessage>}
      {!error && !data && <StatusMessage>Loading dashboard...</StatusMessage>}
      {data && <Summary summary={data} />}
    </>
  );
}