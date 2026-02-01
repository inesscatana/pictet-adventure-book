
import { apiGet } from "../../api/http";
import type { BookSummary } from "./types";

export function getBooks() {
    return apiGet<BookSummary[]>("/books");
}
