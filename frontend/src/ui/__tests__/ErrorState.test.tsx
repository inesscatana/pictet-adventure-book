import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { ErrorState } from '../ErrorState';

const renderWithRouter = (ui: ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ErrorState', () => {
    it('should display error message', () => {
        renderWithRouter(<ErrorState message="Something went wrong" />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should display title when provided', () => {
        renderWithRouter(<ErrorState message="Error" title="Book unavailable" />);
        expect(screen.getByText('Book unavailable')).toBeInTheDocument();
    });

    it('should display retry button when onRetry provided', () => {
        const handleRetry = vi.fn();
        renderWithRouter(<ErrorState message="Error" onRetry={handleRetry} />);
        expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
        const handleRetry = vi.fn();
        const user = userEvent.setup();

        renderWithRouter(<ErrorState message="Error" onRetry={handleRetry} />);

        await user.click(screen.getByText('Retry'));
        expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('should not display retry button when onRetry is not provided', () => {
        renderWithRouter(<ErrorState message="Error" />);
        expect(screen.queryByText('Retry')).not.toBeInTheDocument();
    });

    it('should display link when actionHref is provided', () => {
        renderWithRouter(
            <ErrorState message="Error" actionHref="/" actionLabel="Back to Library" />
        );
        const link = screen.getByText('Back to Library');
        expect(link).toBeInTheDocument();
        expect(link.closest('a')).toHaveAttribute('href', '/');
    });

    it('should use custom actionLabel for button', () => {
        const handleRetry = vi.fn();
        renderWithRouter(<ErrorState message="Error" onRetry={handleRetry} actionLabel="Try Again" />);
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should prioritize actionHref over onRetry', () => {
        const handleRetry = vi.fn();
        renderWithRouter(
            <ErrorState
                message="Error"
                onRetry={handleRetry}
                actionHref="/"
                actionLabel="Go Back"
            />
        );
        const link = screen.getByText('Go Back');
        expect(link).toBeInTheDocument();
        expect(link.closest('a')).toHaveAttribute('href', '/');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
