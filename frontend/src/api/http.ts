const API_PREFIX = import.meta.env.VITE_API_PREFIX ?? "/service";

export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${API_PREFIX}${path}`);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return (await res.json()) as T;
}

export async function apiPost(
    path: string,
    params?: URLSearchParams | Record<string, string>
): Promise<void> {
    const queryString = params
        ? `?${params instanceof URLSearchParams ? params.toString() : new URLSearchParams(params).toString()}`
        : "";
    const url = `${API_PREFIX}${path}${queryString}`;
    const res = await fetch(url, {
        method: "POST",
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(`POST ${path} failed: ${res.status} ${errorText}`);
    }
}