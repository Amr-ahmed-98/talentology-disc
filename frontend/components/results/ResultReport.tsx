import { DIMENSION_COLORS } from "@/lib/dimensions";
import type { Report } from "@/lib/types";
import { ScoreChart } from "./ScoreChart";

export function ResultReport({ report }: { report: Report }) {
  const { participant, profile, ranking, scores } = report;

  return (
    <article className="space-y-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">{participant.name}</p>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-5xl font-bold tracking-tight text-indigo-600">{profile.code}</span>
          <div>
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
            <p lang="ar" dir="rtl" className="text-slate-500">
              {profile.nameAr}
            </p>
          </div>
        </div>
        <p className="mt-4 text-slate-700">{profile.description}</p>
        {profile.keywords.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {profile.keywords.map((keyword) => (
              <li key={keyword} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                {keyword}
              </li>
            ))}
          </ul>
        )}
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold">Scores</h2>
        <ScoreChart scores={scores} />
        <ol className="mt-4 divide-y divide-slate-100">
          {ranking.map(({ dimension, label, score }, index) => (
            <li key={dimension} className="flex items-center justify-between py-2">
              <span className="flex items-center gap-3">
                <span className="w-4 text-sm text-slate-400">{index + 1}</span>
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: DIMENSION_COLORS[dimension] }}
                />
                <span className="font-medium">{dimension}</span>
                <span className="text-slate-500">{label}</span>
              </span>
              <span className="font-semibold">{score}</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}