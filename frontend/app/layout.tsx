import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DISC Assessment | Talentology",
  description: "DISC personality assessment prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}