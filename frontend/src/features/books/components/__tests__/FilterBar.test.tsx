import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../FilterBar';

describe('FilterBar', () => {
    const mockAvailableFilters = ['Adventure', 'Fantasy', 'Easy', 'Medium'];
    const mockOnToggleFilter = vi.fn();
    const mockOnClearFilters = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render all available filters', () => {
        render(
            <FilterBar
                availableFilters={mockAvailableFilters}
                activeFilters={[]}
                onToggleFilter={mockOnToggleFilter}
                onClearFilters={mockOnClearFilters}
            />
        );

        expect(screen.getByText('Adventure')).toBeInTheDocument();
        expect(screen.getByText('Fantasy')).toBeInTheDocument();
        expect(screen.getByText('Easy')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should call onToggleFilter when filter is clicked', async () => {
        const user = userEvent.setup();

        render(
            <FilterBar
                availableFilters={mockAvailableFilters}
                activeFilters={[]}
                onToggleFilter={mockOnToggleFilter}
                onClearFilters={mockOnClearFilters}
            />
        );

        const adventureFilter = screen.getByText('Adventure');
        await user.click(adventureFilter);

        expect(mockOnToggleFilter).toHaveBeenCalledWith('Adventure');
        expect(mockOnToggleFilter).toHaveBeenCalledTimes(1);
    });

    it('should highlight active filters', () => {
        render(
            <FilterBar
                availableFilters={mockAvailableFilters}
                activeFilters={['Adventure', 'Easy']}
                onToggleFilter={mockOnToggleFilter}
                onClearFilters={mockOnClearFilters}
            />
        );

        const adventureChip = screen.getByText('Adventure').closest('button');
        const easyChip = screen.getByText('Easy').closest('button');
        const fantasyChip = screen.getByText('Fantasy').closest('button');

        expect(adventureChip).toHaveClass('bg-[#b47714]');
        expect(easyChip).toHaveClass('bg-[#b47714]');
        expect(fantasyChip).not.toHaveClass('bg-[#b47714]');
    });

    it('should display "Clear All" button when filters are active', () => {
        render(
            <FilterBar
                availableFilters={mockAvailableFilters}
                activeFilters={['Adventure']}
                onToggleFilter={mockOnToggleFilter}
                onClearFilters={mockOnClearFilters}
            />
        );

        expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should not display "Clear All" button when no filters are active', () => {
        render(
            <FilterBar
                availableFilters={mockAvailableFilters}
                activeFilters={[]}
                onToggleFilter={mockOnToggleFilter}
                onClearFilters={mockOnClearFilters}
            />
        );

        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('should call onClearFilters when "Clear All" is clicked', async () => {
        const user = userEvent.setup();

        render(
            <FilterBar
                availableFilters={mockAvailableFilters}
                activeFilters={['Adventure', 'Easy']}
                onToggleFilter={mockOnToggleFilter}
                onClearFilters={mockOnClearFilters}
            />
        );

        const clearAllButton = screen.getByText('Clear All');
        await user.click(clearAllButton);

        expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });

    it('should display filter icon', () => {
        const { container } = render(
            <FilterBar
                availableFilters={mockAvailableFilters}
                activeFilters={[]}
                onToggleFilter={mockOnToggleFilter}
                onClearFilters={mockOnClearFilters}
            />
        );

        expect(screen.getByText('Filters:')).toBeInTheDocument();
    });

    it('should handle empty available filters', () => {
        render(
            <FilterBar
                availableFilters={[]}
                activeFilters={[]}
                onToggleFilter={mockOnToggleFilter}
                onClearFilters={mockOnClearFilters}
            />
        );

        expect(screen.getByText('Filters:')).toBeInTheDocument();
        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('should have proper ARIA label on clear button', () => {
        render(
            <FilterBar
                availableFilters={mockAvailableFilters}
                activeFilters={['Adventure']}
                onToggleFilter={mockOnToggleFilter}
                onClearFilters={mockOnClearFilters}
            />
        );

        const clearButton = screen.getByLabelText('Clear all filters');
        expect(clearButton).toBeInTheDocument();
    });
});
