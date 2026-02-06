import { useMemo } from "react";
import type { BookSummary } from "../types";
import type { SavedProgress } from "../../game/types";
import { BookCard } from "./BookCard";

interface BookGridProps {
    books: BookSummary[];
    savedProgress: SavedProgress[];
}

export function BookGrid({ books, savedProgress }: BookGridProps) {

    const progressMap = useMemo(() => {
        return Object.fromEntries(
            savedProgress.map(p => [p.book, p])
        );
    }, [savedProgress]);

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
                const saved = progressMap[book.path];
                return (
                    <BookCard
                        key={book.path}
                        book={book}
                        savedProgress={saved}
                    />
                );
            })}
        </div>
    );
}
