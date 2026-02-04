import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HealthChip } from '../HealthChip';

describe('HealthChip', () => {
    it('should display health value', () => {
        render(<HealthChip hp={75} />);
        expect(screen.getByText('75 HP')).toBeInTheDocument();
    });

    it('should clamp health to 0-100 range', () => {
        const { rerender } = render(<HealthChip hp={150} />);
        expect(screen.getByText('100 HP')).toBeInTheDocument();

        rerender(<HealthChip hp={-10} />);
        expect(screen.getByText('0 HP')).toBeInTheDocument();
    });

    it('should apply danger styles for health <= 25', () => {
        const { container, rerender } = render(<HealthChip hp={25} />);
        let chip = container.firstChild as HTMLElement;
        expect(chip).toHaveClass('border-red-300');
        expect(chip).toHaveClass('bg-red-100');
        expect(chip).toHaveClass('text-red-700');

        rerender(<HealthChip hp={0} />);
        chip = container.firstChild as HTMLElement;
        expect(chip).toHaveClass('border-red-300');
    });

    it('should apply mid styles for health between 25 and 60', () => {
        const { container, rerender } = render(<HealthChip hp={45} />);
        let chip = container.firstChild as HTMLElement;
        expect(chip).toHaveClass('border-orange-300');
        expect(chip).toHaveClass('bg-orange-100');
        expect(chip).toHaveClass('text-orange-700');

        rerender(<HealthChip hp={60} />);
        chip = container.firstChild as HTMLElement;
        expect(chip).toHaveClass('border-orange-300');
    });

    it('should apply healthy styles for health > 60', () => {
        const { container, rerender } = render(<HealthChip hp={75} />);
        let chip = container.firstChild as HTMLElement;
        expect(chip).toHaveClass('border-emerald-300');
        expect(chip).toHaveClass('bg-emerald-100');
        expect(chip).toHaveClass('text-emerald-700');

        rerender(<HealthChip hp={100} />);
        chip = container.firstChild as HTMLElement;
        expect(chip).toHaveClass('border-emerald-300');
    });

    it('should have proper ARIA attributes', () => {
        render(<HealthChip hp={75} />);
        const chip = screen.getByRole('status');
        expect(chip).toHaveAttribute('aria-live', 'polite');
        expect(chip).toHaveAttribute('aria-label', 'Health: 75 out of 100');
    });

    it('should display heart emoji', () => {
        const { container } = render(<HealthChip hp={50} />);
        const heart = container.querySelector('span[aria-hidden="true"]');
        expect(heart?.textContent).toBe('❤️');
    });

    it('should have health bar with correct width', () => {
        const { container } = render(<HealthChip hp={50} />);
        const bar = container.querySelector('.absolute.inset-0') as HTMLElement;
        expect(bar).toHaveStyle({ width: '50%' });
    });
});
