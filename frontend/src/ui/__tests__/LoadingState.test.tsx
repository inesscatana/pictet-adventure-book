import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
    it('should display default message', () => {
        render(<LoadingState />);
        expect(screen.getByText('Loading…')).toBeInTheDocument();
    });

    it('should display custom message', () => {
        render(<LoadingState message="Loading books..." />);
        expect(screen.getByText('Loading books...')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
        const { container } = render(<LoadingState />);
        const status = container.querySelector('[role="status"]');
        expect(status).toBeInTheDocument();
        expect(status).toHaveAttribute('aria-live', 'polite');
        expect(status).toHaveAttribute('aria-atomic', 'true');
    });
});
