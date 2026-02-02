import type { BookSummary } from "../types";
import { BookCard } from "./BookCard";

interface BookGridProps {
    books: BookSummary[];
}

export function BookGrid({ books }: BookGridProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
                <BookCard key={book.path} book={book} />
            ))}
        </div>
    );
}
