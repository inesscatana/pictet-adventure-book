import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from '../Chip';

describe('Chip', () => {
    it('should render children', () => {
        render(<Chip>Test Chip</Chip>);
        expect(screen.getByText('Test Chip')).toBeInTheDocument();
    });

    it('should call onClick when clicked', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Chip onClick={handleClick}>Clickable</Chip>);
        await user.click(screen.getByText('Clickable'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply active styles when active', () => {
        const { container } = render(<Chip active>Active Chip</Chip>);
        const chip = container.firstChild as HTMLElement;
        expect(chip).toHaveClass('bg-[#b47714]');
    });

    it('should apply inactive styles when not active', () => {
        const { container } = render(<Chip>Inactive Chip</Chip>);
        const chip = container.firstChild as HTMLElement;
        expect(chip).toHaveClass('bg-[#f6efe7]');
        expect(chip).not.toHaveClass('bg-[#b47714]');
    });

    it('should convert string children to title case', () => {
        render(<Chip>hello world</Chip>);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should not convert non-string children', () => {
        render(
            <Chip>
                <span>Custom Content</span>
            </Chip>
        );
        expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('should be a button element', () => {
        render(<Chip>Test</Chip>);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });
});
