import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
    it('should render progress bar', () => {
        const { container } = render(<ProgressBar percentage={50} />);
        const progressBar = container.querySelector('[role="progressbar"]');
        expect(progressBar).toBeInTheDocument();
    });

    it('should display label when provided', () => {
        render(<ProgressBar percentage={50} label="Test Progress" />);
        expect(screen.getByText('Test Progress')).toBeInTheDocument();
    });

    it('should not display label when not provided', () => {
        render(<ProgressBar percentage={50} />);
        expect(screen.queryByText('Test Progress')).not.toBeInTheDocument();
    });

    it('should display percentage', () => {
        render(<ProgressBar percentage={75} label="Progress" />);
        expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should clamp percentage to 0-100', () => {
        const { rerender, container } = render(<ProgressBar percentage={150} />);
        let progressBar = container.querySelector('[role="progressbar"]') as HTMLElement;
        expect(progressBar).toHaveAttribute('aria-valuenow', '100');
        expect(progressBar).toHaveStyle({ width: '100%' });

        rerender(<ProgressBar percentage={-10} />);
        progressBar = container.querySelector('[role="progressbar"]') as HTMLElement;
        expect(progressBar).toHaveAttribute('aria-valuenow', '0');
        expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('should have proper ARIA attributes', () => {
        render(<ProgressBar percentage={50} />);
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '50');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        expect(progressBar).toHaveAttribute('aria-label', 'Progress: 50%');
    });

    it('should set width style correctly', () => {
        const { container } = render(<ProgressBar percentage={33} />);
        const progressBar = container.querySelector('[role="progressbar"]') as HTMLElement;
        expect(progressBar).toHaveStyle({ width: '33%' });
    });
});
