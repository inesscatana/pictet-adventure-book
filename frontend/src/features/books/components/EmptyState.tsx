interface EmptyStateProps {
    hasActiveFilters: boolean;
    onClearAll: () => void;
}

export function EmptyState({ hasActiveFilters, onClearAll }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            <p className="text-[#6b5647] text-lg">
                No books found matching your criteria.
            </p>
            {hasActiveFilters && (
                <button
                    onClick={onClearAll}
                    className="mt-4 text-sm text-[#6b5647] underline"
                >
                    Clear search and filters
                </button>
            )}
        </div>
    );
}
