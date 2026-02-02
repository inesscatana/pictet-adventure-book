import { apiGet } from "../../api/http";
import type { Book } from "./types";

export function getBook(path: string) {
    return apiGet<Book>(`/books/${encodeURIComponent(path)}`);
}