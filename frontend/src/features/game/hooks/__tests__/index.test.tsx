import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBook, useGameState } from '../index';
import * as api from '../../api';
import type { Book, Option, SavedProgress } from '../../types';
import React from 'react';

// Mock the API functions
vi.mock('../../api', () => ({
    getBook: vi.fn(),
    getProgress: vi.fn(),
    saveProgress: vi.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

const mockBook: Book = {
    title: 'Test Adventure',
    author: 'Test Author',
    difficulty: 'Easy',
    type: 'Adventure',
    sections: [
        { id: '1', text: 'Beginning', type: 'BEGIN', options: [{ description: 'Go forward', gotoId: '2' }] },
        { id: '2', text: 'Middle', type: 'NODE', options: [{ description: 'Continue', gotoId: '3' }] },
        { id: '3', text: 'End', type: 'END', options: [] },
    ],
};

describe('useBook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch book when path is provided', async () => {
        vi.mocked(api.getBook).mockResolvedValue(mockBook);

        const { result } = renderHook(() => useBook('test-book.json'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockBook);
        expect(api.getBook).toHaveBeenCalledWith('test-book.json');
    });

    it('should not fetch when path is empty', () => {
        const { result } = renderHook(() => useBook(''), {
            wrapper: createWrapper(),
        });

        expect(result.current.isFetching).toBe(false);
        expect(api.getBook).not.toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
        vi.mocked(api.getBook).mockRejectedValue(new Error('Book not found'));

        const { result } = renderHook(() => useBook('invalid.json'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeTruthy();
    });
});

describe('useGameState', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize from beginning when no saved progress', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        expect(result.current.current?.id).toBe('1'); // BEGIN section
        expect(result.current.hp).toBe(100);
        expect(result.current.isGameOver).toBe(false);
        expect(result.current.isGameWon).toBe(false);
    });

    it('should load saved progress when available', async () => {
        const savedProgress: SavedProgress = {
            book: 'test-book.json',
            sectionId: '2',
            health: 75,
            timestamp: Date.now(),
        };
        vi.mocked(api.getProgress).mockResolvedValue(savedProgress);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        expect(result.current.current?.id).toBe('2');
        expect(result.current.hp).toBe(75);
    });

    it('should start new game when startNew is true', async () => {
        const savedProgress: SavedProgress = {
            book: 'test-book.json',
            sectionId: '2',
            health: 50,
            timestamp: Date.now(),
        };
        vi.mocked(api.getProgress).mockResolvedValue(savedProgress);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', true),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // Should ignore saved progress and start from beginning
        expect(result.current.current?.id).toBe('1');
        expect(result.current.hp).toBe(100);
        expect(api.getProgress).not.toHaveBeenCalled();
    });

    it('should handle error loading progress gracefully', async () => {
        vi.mocked(api.getProgress).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // Should fall back to beginning on error
        expect(result.current.current?.id).toBe('1');
        expect(result.current.hp).toBe(100);
    });

    it('should not load progress when book is undefined', async () => {
        const { result } = renderHook(
            () => useGameState(undefined, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        expect(api.getProgress).not.toHaveBeenCalled();
    });

    it('should apply option and update current section', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        const option: Option = {
            description: 'Go to section 2',
            gotoId: '2',
        };

        act(() => {
            result.current.applyOption(option);
        });

        expect(result.current.current?.id).toBe('2');
    });

    it('should apply health consequence when selecting option', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        const option: Option = {
            description: 'Lose health',
            gotoId: '2',
            consequence: {
                type: 'LOSE_HEALTH',
                value: '20',
                text: 'You lost health',
            },
        };

        act(() => {
            result.current.applyOption(option);
        });

        expect(result.current.hp).toBe(80);
        expect(result.current.current?.id).toBe('2');
    });

    it('should set game over when health reaches zero', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // Set HP to low value first
        act(() => {
            const option: Option = {
                description: 'Lose health',
                gotoId: '2',
                consequence: {
                    type: 'LOSE_HEALTH',
                    value: '50',
                },
            };
            result.current.applyOption(option);
        });

        expect(result.current.hp).toBe(50);

        // Now lose enough to reach zero
        act(() => {
            const option: Option = {
                description: 'Lose more health',
                gotoId: '2',
                consequence: {
                    type: 'LOSE_HEALTH',
                    value: '60',
                },
            };
            result.current.applyOption(option);
        });

        expect(result.current.hp).toBe(0);
        expect(result.current.isGameOver).toBe(true);
    });

    it('should not apply option when game is over', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // Set game over
        act(() => {
            const option: Option = {
                description: 'Lose all health',
                gotoId: '2',
                consequence: {
                    type: 'LOSE_HEALTH',
                    value: '150',
                },
            };
            result.current.applyOption(option);
        });

        expect(result.current.isGameOver).toBe(true);
        const previousId = result.current.current?.id;

        // Try to apply another option
        act(() => {
            const option: Option = {
                description: 'Try to continue',
                gotoId: '3',
            };
            result.current.applyOption(option);
        });

        // Should not change
        expect(result.current.current?.id).toBe(previousId);
    });

    it('should detect win condition when reaching END section', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // Navigate to END section
        act(() => {
            const option: Option = {
                description: 'Go to end',
                gotoId: '3',
            };
            result.current.applyOption(option);
        });

        await waitFor(() => {
            expect(result.current.isGameWon).toBe(true);
        });

        expect(result.current.current?.id).toBe('3');
        expect(result.current.current?.type).toBe('END');
    });

    it('should save game progress', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);
        vi.mocked(api.saveProgress).mockResolvedValue(undefined);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // Navigate to a section
        act(() => {
            const option: Option = {
                description: 'Go forward',
                gotoId: '2',
            };
            result.current.applyOption(option);
        });

        // Save progress
        await act(async () => {
            await result.current.saveGameProgress();
        });

        expect(api.saveProgress).toHaveBeenCalledWith('test-book.json', '2', 100);
    });

    it('should not save when book, currentId, or bookPath is missing', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(undefined, null, false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        await act(async () => {
            await result.current.saveGameProgress();
        });

        expect(api.saveProgress).not.toHaveBeenCalled();
    });

    it('should handle save errors', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);
        vi.mocked(api.saveProgress).mockRejectedValue(new Error('Save failed'));

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        await expect(async () => {
            await act(async () => {
                await result.current.saveGameProgress();
            });
        }).rejects.toThrow('Save failed');
    });

    it('should restart game', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // Navigate and lose health
        act(() => {
            const option: Option = {
                description: 'Lose health',
                gotoId: '2',
                consequence: {
                    type: 'LOSE_HEALTH',
                    value: '30',
                },
            };
            result.current.applyOption(option);
        });

        expect(result.current.hp).toBe(70);
        expect(result.current.current?.id).toBe('2');

        // Restart
        act(() => {
            result.current.restartGame();
        });

        expect(result.current.hp).toBe(100);
        expect(result.current.current?.id).toBe('1');
        expect(result.current.isGameOver).toBe(false);
        expect(result.current.isGameWon).toBe(false);
    });

    it('should calculate progress correctly', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // At first section (1 of 3)
        expect(result.current.progress?.sectionNumber).toBe(1);
        expect(result.current.progress?.totalSections).toBe(3);
        expect(result.current.progress?.percentage).toBeGreaterThan(0);

        // Navigate to second section
        act(() => {
            const option: Option = {
                description: 'Continue',
                gotoId: '2',
            };
            result.current.applyOption(option);
        });

        expect(result.current.progress?.sectionNumber).toBe(2);
    });

    it('should handle gain health consequence', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // First lose some health
        act(() => {
            const option: Option = {
                description: 'Lose health',
                gotoId: '2',
                consequence: {
                    type: 'LOSE_HEALTH',
                    value: '30',
                },
            };
            result.current.applyOption(option);
        });

        expect(result.current.hp).toBe(70);

        // Then gain health
        act(() => {
            const option: Option = {
                description: 'Gain health',
                gotoId: '2',
                consequence: {
                    type: 'GAIN_HEALTH',
                    value: '20',
                },
            };
            result.current.applyOption(option);
        });

        expect(result.current.hp).toBe(90);
    });

    it('should cap health at maximum', async () => {
        vi.mocked(api.getProgress).mockResolvedValue(null);

        const { result } = renderHook(
            () => useGameState(mockBook, 'test-book.json', false),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isLoadingProgress).toBe(false);
        });

        // Try to gain more than max
        act(() => {
            const option: Option = {
                description: 'Gain too much health',
                gotoId: '2',
                consequence: {
                    type: 'GAIN_HEALTH',
                    value: '50',
                },
            };
            result.current.applyOption(option);
        });

        expect(result.current.hp).toBe(100); // Capped at max
    });
});
