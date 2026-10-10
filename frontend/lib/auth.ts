import type { Role, Session } from "./types";

const STORAGE_KEY = "disc-session";

export const HOME_BY_ROLE: Record<Role, string> = {
    FACILITATOR: "/facilitator",
    MANAGER: "/manager",
};

export function saveSession(session: Session): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function readStoredSession(): string | null {
    return localStorage.getItem(STORAGE_KEY);
}

export function parseSession(raw: string | null): Session | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as Session;
    } catch {
        return null;
    }
}

export function loadSession(): Session | null {
    return parseSession(readStoredSession());
}

export function clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
}