import { apiGet, apiPost } from "../../api/http";
import type { Book, SavedProgress } from "./types";

export function getBook(path: string) {
    return apiGet<Book>(`/books/${encodeURIComponent(path)}`);
}

export async function saveProgress(
    bookPath: string,
    sectionId: string,
    health: number
): Promise<void> {
    await apiPost("/books/progress/save", {
        book: bookPath,
        sectionId: sectionId,
        health: health.toString(),
    });
}

export async function getProgress(bookPath: string): Promise<SavedProgress | null> {
    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_PREFIX ?? "/service"}/books/progress/${encodeURIComponent(bookPath)}`
        );
        if (res.status === 404) {
            // No saved progress found - this is expected, not an error
            return null;
        }
        if (!res.ok) {
            throw new Error(`Failed to get progress: ${res.status}`);
        }
        return (await res.json()) as SavedProgress;
    } catch (error) {
        // If it's a 404, return null (no saved progress)
        if (error instanceof Error && error.message.includes("404")) {
            return null;
        }
        throw error;
    }
}

export function listProgress(): Promise<SavedProgress[]> {
    return apiGet<SavedProgress[]>("/books/progress");
}