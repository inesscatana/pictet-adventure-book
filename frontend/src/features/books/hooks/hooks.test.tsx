import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookFilters } from './index';
import type { BookSummary } from '../types';

const mockBooks: BookSummary[] = [
    {
        path: 'book1.json',
        title: 'Adventure Book',
        author: 'Author 1',
        difficulty: 'Easy',
        type: 'Adventure',
        duration: '30 min',
        chapters: 5,
        tags: ['Fantasy'],
        summary: 'A great adventure',
    },
    {
        path: 'book2.json',
        title: 'Mystery Book',
        author: 'Author 2',
        difficulty: 'Hard',
        type: 'Mystery',
        duration: '60 min',
        chapters: 10,
        tags: ['Thriller'],
        summary: 'A mysterious story',
    },
    {
        path: 'book3.json',
        title: 'Fantasy Quest',
        author: 'Author 1',
        difficulty: 'Medium',
        type: 'Fantasy',
        duration: '45 min',
        chapters: 8,
        tags: ['Magic'],
        summary: 'A fantasy adventure',
    },
];

describe('useBookFilters', () => {
    it('should initialize with empty search and no filters', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));
        expect(result.current.search).toBe('');
        expect(result.current.activeFilters).toEqual([]);
    });

    it('should filter by search term', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.setSearch('Adventure');
        });

        expect(result.current.filteredBooks).toHaveLength(1);
        expect(result.current.filteredBooks[0].title).toBe('Adventure Book');
    });

    it('should filter by author in search', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.setSearch('Author 2');
        });

        expect(result.current.filteredBooks).toHaveLength(1);
        expect(result.current.filteredBooks[0].title).toBe('Mystery Book');
    });

    it('should filter by summary in search', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.setSearch('mysterious');
        });

        expect(result.current.filteredBooks).toHaveLength(1);
        expect(result.current.filteredBooks[0].title).toBe('Mystery Book');
    });

    it('should be case-insensitive in search', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.setSearch('ADVENTURE');
        });

        expect(result.current.filteredBooks).toHaveLength(1);
    });

    it('should filter by active filters', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.toggleFilter('Easy');
        });

        expect(result.current.filteredBooks).toHaveLength(1);
        expect(result.current.filteredBooks[0].difficulty).toBe('Easy');
    });

    it('should filter by type', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.toggleFilter('Adventure');
        });

        expect(result.current.filteredBooks).toHaveLength(1);
        expect(result.current.filteredBooks[0].type).toBe('Adventure');
    });

    it('should combine search and filters', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.setSearch('Author 1');
            result.current.toggleFilter('Easy');
        });

        expect(result.current.filteredBooks).toHaveLength(1);
        expect(result.current.filteredBooks[0].title).toBe('Adventure Book');
    });

    it('should return empty array when no matches', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.setSearch('NonExistent');
        });

        expect(result.current.filteredBooks).toHaveLength(0);
    });

    it('should toggle filter on and off', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.toggleFilter('Easy');
        });

        expect(result.current.activeFilters).toContain('Easy');

        act(() => {
            result.current.toggleFilter('Easy');
        });

        expect(result.current.activeFilters).not.toContain('Easy');
    });

    it('should add multiple filters', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.toggleFilter('Easy');
            result.current.toggleFilter('Adventure');
        });

        expect(result.current.activeFilters).toHaveLength(2);
        expect(result.current.activeFilters).toContain('Easy');
        expect(result.current.activeFilters).toContain('Adventure');
    });

    it('should clear all filters', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        act(() => {
            result.current.toggleFilter('Easy');
            result.current.toggleFilter('Adventure');
        });

        expect(result.current.activeFilters).toHaveLength(2);

        act(() => {
            result.current.clearFilters();
        });

        expect(result.current.activeFilters).toHaveLength(0);
    });

    it('should compute available filters from books', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        expect(result.current.availableFilters).toContain('Adventure');
        expect(result.current.availableFilters).toContain('Mystery');
        expect(result.current.availableFilters).toContain('Fantasy');
        expect(result.current.availableFilters).toContain('Easy');
        expect(result.current.availableFilters).toContain('Hard');
        expect(result.current.availableFilters).toContain('Medium');
    });

    it('should return all books when search and filters are empty', () => {
        const { result } = renderHook(() => useBookFilters(mockBooks));

        expect(result.current.filteredBooks).toHaveLength(3);
    });

    it('should handle empty books array', () => {
        const { result } = renderHook(() => useBookFilters([]));

        expect(result.current.filteredBooks).toHaveLength(0);
        expect(result.current.availableFilters).toHaveLength(0);
    });
});
