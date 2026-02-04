import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
    it('should display message', () => {
        render(<EmptyState message="No items found" actionLabel="Clear" onAction={vi.fn()} />);
        expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('should display action button when actionLabel and onAction provided', () => {
        const handleAction = vi.fn();
        render(
            <EmptyState
                message="No items"
                actionLabel="Clear filters"
                onAction={handleAction}
            />
        );
        const button = screen.getByText('Clear filters');
        expect(button).toBeInTheDocument();
    });

    it('should call onAction when button is clicked', async () => {
        const handleAction = vi.fn();
        const user = userEvent.setup();

        render(
            <EmptyState
                message="No items"
                actionLabel="Clear"
                onAction={handleAction}
            />
        );

        await user.click(screen.getByText('Clear'));
        expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it('should not display button when actionLabel is missing', () => {
        render(<EmptyState message="No items" onAction={vi.fn()} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should not display button when onAction is missing', () => {
        render(<EmptyState message="No items" actionLabel="Clear" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
