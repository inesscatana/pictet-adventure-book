import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameEndScreen } from '../GameEndScreen';
import type { ProgressInfo } from '../../utils/utils';

describe('GameEndScreen', () => {
    const mockProgress: ProgressInfo = {
        currentSectionIndex: 12,
        totalSections: 13,
        percentage: 100,
        sectionNumber: 13,
    };

    it('should display victory message when won', () => {
        render(
            <GameEndScreen
                isWon={true}
                bookTitle="Test Adventure"
                progress={mockProgress}
                onRestart={vi.fn()}
            />
        );

        expect(screen.getByText('Victory!')).toBeInTheDocument();
        expect(screen.getByText(/Congratulations! You've successfully completed/)).toBeInTheDocument();
        expect(screen.getByText('Test Adventure')).toBeInTheDocument();
    });

    it('should display game over message when lost', () => {
        render(
            <GameEndScreen
                isWon={false}
                bookTitle="Test Adventure"
                progress={mockProgress}
                onRestart={vi.fn()}
            />
        );

        expect(screen.getByText('Game Over')).toBeInTheDocument();
        expect(screen.getByText(/Your health has reached zero/)).toBeInTheDocument();
    });

    it('should display progress when provided', () => {
        render(
            <GameEndScreen
                isWon={true}
                bookTitle="Test Adventure"
                progress={mockProgress}
                onRestart={vi.fn()}
            />
        );

        expect(screen.getByText('Final Progress')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText('13')).toBeInTheDocument(); // Section number
        expect(screen.getByText('13')).toBeInTheDocument(); // Total sections
    });

    it('should not display progress when not provided', () => {
        render(
            <GameEndScreen
                isWon={true}
                bookTitle="Test Adventure"
                progress={null}
                onRestart={vi.fn()}
            />
        );

        expect(screen.queryByText('Final Progress')).not.toBeInTheDocument();
    });

    it('should call onRestart when restart button is clicked', async () => {
        const handleRestart = vi.fn();
        const user = userEvent.setup();

        render(
            <GameEndScreen
                isWon={false}
                bookTitle="Test Adventure"
                progress={mockProgress}
                onRestart={handleRestart}
            />
        );

        const restartButton = screen.getByText('Restart');
        await user.click(restartButton);

        expect(handleRestart).toHaveBeenCalledTimes(1);
    });

    it('should show "Play Again" button when won', () => {
        render(
            <GameEndScreen
                isWon={true}
                bookTitle="Test Adventure"
                progress={mockProgress}
                onRestart={vi.fn()}
            />
        );

        expect(screen.getByText('Play Again')).toBeInTheDocument();
    });

    it('should show "Restart" button when lost', () => {
        render(
            <GameEndScreen
                isWon={false}
                bookTitle="Test Adventure"
                progress={mockProgress}
                onRestart={vi.fn()}
            />
        );

        expect(screen.getByText('Restart')).toBeInTheDocument();
    });

    it('should have link to library', () => {
        render(
            <GameEndScreen
                isWon={true}
                bookTitle="Test Adventure"
                progress={mockProgress}
                onRestart={vi.fn()}
            />
        );

        const libraryLink = screen.getByText('Back to Library');
        expect(libraryLink).toBeInTheDocument();
        expect(libraryLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('should display victory emoji when won', () => {
        const { container } = render(
            <GameEndScreen
                isWon={true}
                bookTitle="Test Adventure"
                progress={mockProgress}
                onRestart={vi.fn()}
            />
        );

        expect(container.textContent).toContain('🎉');
    });

    it('should display game over emoji when lost', () => {
        const { container } = render(
            <GameEndScreen
                isWon={false}
                bookTitle="Test Adventure"
                progress={mockProgress}
                onRestart={vi.fn()}
            />
        );

        expect(container.textContent).toContain('💀');
    });
});
