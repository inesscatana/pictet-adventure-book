import { useBooks, useBookFilters } from "./hooks";
import { HeroSection } from "./components/HeroSection";
import { LibrarySection } from "./components/LibrarySection";

export function HomePage() {
    const { data: books = [], isLoading, isError, error, refetch } = useBooks();

    const {
        search,
        setSearch,
        activeFilters,
        availableFilters,
        filteredBooks,
        toggleFilter,
        clearFilters,
    } = useBookFilters(books);

    const hasActiveFilters = search.trim().length > 0 || activeFilters.length > 0;

    const handleClearAll = () => {
        setSearch("");
        clearFilters();
    };

    const errorMessage = (error as Error)?.message ?? "Error loading books";

    return (
        <div className="min-h-screen bg-[#fbf7f2] text-[#2b1f17]">
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
            />
        </div>
    );
}