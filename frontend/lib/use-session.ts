"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { loadSession, parseSession, readStoredSession } from "./auth";
import type { Role, Session } from "./types";

const subscribe = () => () => { };

export function useRequiredSession(role: Role): Session | null {
    const router = useRouter();
    const raw = useSyncExternalStore(subscribe, readStoredSession, () => null);
    const session = useMemo(() => parseSession(raw), [raw]);

    useEffect(() => {
        if (loadSession()?.user.role !== role) router.replace("/login");
    }, [role, router]);

    return session?.user.role === role ? session : null;
}