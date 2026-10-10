"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { GroupRanking, PublicGroup, PublicWord } from "@/lib/types";
import { RankingGroup } from "./RankingGroup";

interface AssessmentFormProps {
  token: string;
  participantName: string;
  groups: PublicGroup[];
}

export function AssessmentForm({ token, participantName, groups }: AssessmentFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [orders, setOrders] = useState<PublicWord[][]>(() => groups.map((group) => group.words));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLast = step === groups.length - 1;

  function updateOrder(words: PublicWord[]) {
    setOrders((current) => current.map((order, index) => (index === step ? words : order)));
  }

  async function submit() {
    setSubmitting(true);
    setError(null);

    const rankings: GroupRanking[] = groups.map((group, index) => ({
      groupId: group.id,
      wordIds: orders[index].map((word) => word.id),
    }));

    try {
      await api(`/assessment/${token}/submit`, { method: "POST", body: { rankings } });
      router.push(`/results/${token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your answers");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <p className="text-sm text-slate-500">Hello {participantName}</p>
      <h1 className="mt-1 text-2xl font-semibold">Rank the words</h1>
      <p className="mt-2 text-slate-600">
        Drag the words so the one that describes you most is at the top and the one that describes
        you least is at the bottom.
      </p>

      <div className="mt-6">
        <p className="text-sm text-slate-500">
          Group {step + 1} of {groups.length}
        </p>
        <div className="mt-2 h-2 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all"
            style={{ width: `${((step + 1) / groups.length) * 100}%` }}
          />
        </div>
      </div>

      <RankingGroup key={groups[step].id} words={orders[step]} onChange={updateOrder} />

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep(step - 1)}
          disabled={step === 0 || submitting}
        >
          Back
        </Button>
        {isLast ? (
          <Button onClick={submit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button onClick={() => setStep(step + 1)}>Next</Button>
        )}
      </div>
    </section>
  );
}