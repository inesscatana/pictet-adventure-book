import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '../ErrorState';

describe('ErrorState', () => {
    it('should display error message', () => {
        render(<ErrorState message="Something went wrong" />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should display retry button when onRetry provided', () => {
        const handleRetry = vi.fn();
        render(<ErrorState message="Error" onRetry={handleRetry} />);
        expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
        const handleRetry = vi.fn();
        const user = userEvent.setup();

        render(<ErrorState message="Error" onRetry={handleRetry} />);

        await user.click(screen.getByText('Retry'));
        expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('should not display retry button when onRetry is not provided', () => {
        render(<ErrorState message="Error" />);
        expect(screen.queryByText('Retry')).not.toBeInTheDocument();
    });
});
