"use client";

import { useEffect, useState } from "react";
import { api } from "./api";

interface State<T> {
    data?: T;
    error?: string;
    loading: boolean;
}

export function useApiData<T>(path: string | null, token?: string): State<T> {
    const [state, setState] = useState<State<T>>({ loading: true });

    useEffect(() => {
        if (!path) return;
        let cancelled = false;

        api<T>(path, { token })
            .then((data) => !cancelled && setState({ data, loading: false }))
            .catch((error: Error) => !cancelled && setState({ error: error.message, loading: false }));

        return () => {
            cancelled = true;
        };
    }, [path, token]);

    return state;
}