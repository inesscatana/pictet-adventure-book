import { Icon } from "../../../ui/Icon";
import { Chip } from "../../../ui/Chip";

interface FilterBarProps {
    availableFilters: string[];
    activeFilters: string[];
    onToggleFilter: (filter: string) => void;
    onClearFilters: () => void;
}

export function FilterBar({
    availableFilters,
    activeFilters,
    onToggleFilter,
    onClearFilters,
}: FilterBarProps) {
    return (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-[#6b5647] mr-2 inline-flex items-center gap-2">
                <Icon name="filter" label="Filters" />
                Filters:
            </span>

            {availableFilters.map((f) => (
                <Chip key={f} active={activeFilters.includes(f)} onClick={() => onToggleFilter(f)}>
                    {f}
                </Chip>
            ))}

            {activeFilters.length > 0 && (
                <button
                    onClick={onClearFilters}
                    className="ml-2 text-sm text-[#6b5647] underline"
                    aria-label="Clear all filters"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}
