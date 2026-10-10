import type { ReactNode } from "react";

export function StatusMessage({ children }: { children: ReactNode }) {
  return <p className="py-20 text-center text-slate-600">{children}</p>;
}