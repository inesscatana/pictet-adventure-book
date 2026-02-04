import { useBooks, useBookFilters, useSavedProgress } from "./hooks";
import { HeroSection } from "./components/HeroSection";
import { LibrarySection } from "./components/LibrarySection";
import type { BookSummary } from "./types";

export function HomePage() {
    const { data: books = [], isLoading, isError, error, refetch } = useBooks();
    const { data: savedProgress = [] } = useSavedProgress();

    const {
        search,
        setSearch,
        activeFilters,
        availableFilters,
        filteredBooks,
        toggleFilter,
        clearFilters,
    } = useBookFilters(books as BookSummary[]);

    const hasActiveFilters = search.trim().length > 0 || activeFilters.length > 0;

    const handleClearAll = () => {
        setSearch("");
        clearFilters();
    };

    const errorMessage = (error as Error)?.message ?? "Error loading books";

    return (
        <div className="min-h-screen text-[#2b1f17]">
            <HeroSection bookCount={books.length} />
            <LibrarySection
                search={search}
                onSearchChange={setSearch}
                availableFilters={availableFilters}
                activeFilters={activeFilters}
                onToggleFilter={toggleFilter}
                onClearFilters={clearFilters}
                onClearAll={handleClearAll}
                isLoading={isLoading}
                isError={isError}
                errorMessage={errorMessage}
                filteredBooks={filteredBooks}
                hasActiveFilters={hasActiveFilters}
                onRetry={refetch}
                savedProgress={savedProgress}
            />
        </div>
    );
}