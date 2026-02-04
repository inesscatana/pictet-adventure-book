import type { BookSummary } from "../types";
import type { SavedProgress } from "../../game/types";
import { SearchInput } from "./SearchInput";
import { FilterBar } from "./FilterBar";
import { LibraryHeader } from "./LibraryHeader";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { BookGrid } from "./BookGrid";

interface LibrarySectionProps {
    search: string;
    onSearchChange: (value: string) => void;
    availableFilters: string[];
    activeFilters: string[];
    onToggleFilter: (filter: string) => void;
    onClearFilters: () => void;
    onClearAll: () => void;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    filteredBooks: BookSummary[];
    hasActiveFilters: boolean;
    onRetry?: () => void;
    savedProgress: SavedProgress[];
}

export function LibrarySection({
    search,
    onSearchChange,
    availableFilters,
    activeFilters,
    onToggleFilter,
    onClearFilters,
    onClearAll,
    isLoading,
    isError,
    errorMessage,
    filteredBooks,
    hasActiveFilters,
    onRetry,
    savedProgress,
}: LibrarySectionProps) {
    return (
        <section className="mx-auto max-w-6xl px-4 py-10" aria-label="Adventure library">
            <LibraryHeader />

            <div className="mt-8 flex justify-center">
                <SearchInput value={search} onChange={onSearchChange} />
            </div>

            <FilterBar
                availableFilters={availableFilters}
                activeFilters={activeFilters}
                onToggleFilter={onToggleFilter}
                onClearFilters={onClearFilters}
            />

            <div className="mt-8">
                {isLoading && <LoadingState />}
                {isError && <ErrorState message={errorMessage} onRetry={onRetry} />}
                {!isLoading && !isError && filteredBooks.length === 0 && (
                    <EmptyState hasActiveFilters={hasActiveFilters} onClearAll={onClearAll} />
                )}
                {!isLoading && !isError && filteredBooks.length > 0 && (
                    <BookGrid books={filteredBooks} savedProgress={savedProgress} />
                )}
            </div>
        </section>
    );
}