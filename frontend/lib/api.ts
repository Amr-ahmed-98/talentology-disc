const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
    constructor(
        readonly status: number,
        message: string,
    ) {
        super(message);
    }
}

interface RequestOptions {
    method?: "GET" | "POST";
    body?: unknown;
    token?: string;
}

export async function api<T>(
    path: string,
    { method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new ApiError(response.status, data?.message ?? "Something went wrong");
    }
    return data as T;
}