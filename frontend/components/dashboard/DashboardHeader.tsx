"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { clearSession } from "@/lib/auth";
import type { Session } from "@/lib/types";

export function DashboardHeader({ title, session }: { title: string; session: Session }) {
  const router = useRouter();

  function signOut() {
    clearSession();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-slate-500">{session.user.name}</p>
      </div>
      <Button variant="secondary" onClick={signOut}>
        Sign out
      </Button>
    </header>
  );
}