import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon } from '../Icon';

describe('Icon', () => {
    it('should render icon emoji', () => {
        const { container } = render(<Icon name="sparkling" />);
        expect(container.textContent).toBe('✨');
    });

    it('should render different icons', () => {
        const { container: container1 } = render(<Icon name="book" />);
        expect(container1.textContent).toBe('📚');

        const { container: container2 } = render(<Icon name="play" />);
        expect(container2.textContent).toBe('▶️');

        const { container: container3 } = render(<Icon name="save" />);
        expect(container3.textContent).toBe('💾');
    });

    it('should have ARIA label when label prop is provided', () => {
        const { container } = render(<Icon name="sparkling" label="Sparkles" />);
        const icon = container.firstChild as HTMLElement;

        expect(icon).toHaveAttribute('aria-label', 'Sparkles');
        expect(icon).toHaveAttribute('role', 'img');
        expect(icon).not.toHaveAttribute('aria-hidden');
    });

    it('should have aria-hidden when no label is provided', () => {
        const { container } = render(<Icon name="sparkling" />);
        const icon = container.firstChild as HTMLElement;

        expect(icon).toHaveAttribute('aria-hidden', 'true');
        expect(icon).not.toHaveAttribute('role');
    });

    it('should apply custom className', () => {
        const { container } = render(<Icon name="sparkling" className="custom-class" />);
        const icon = container.firstChild as HTMLElement;

        expect(icon).toHaveClass('custom-class');
    });

    it('should render all available icons', () => {
        const icons = ['sparkling', 'book', 'openBook', 'search', 'filter', 'clock', 'play', 'save'] as const;

        icons.forEach((iconName) => {
            const { container } = render(<Icon name={iconName} />);
            expect(container.textContent).toBeTruthy();
        });
    });
});
