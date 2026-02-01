const API_PREFIX = import.meta.env.VITE_API_PREFIX ?? "/service";

export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${API_PREFIX}${path}`);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return (await res.json()) as T;
}