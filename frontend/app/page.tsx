import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <h1 className="text-3xl font-semibold">DISC Assessment</h1>
      <p className="mt-4 text-slate-600">
        Open the personal invite link you received to start your assessment.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-block text-sm font-medium text-indigo-600 hover:underline"
      >
        Facilitator / HR login
      </Link>
    </div>
  );
}