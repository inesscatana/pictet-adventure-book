import { describe, it, expect } from 'vitest';
import {
    getDifficultyStyles,
    toTitleCase,
    matchesFilters,
    matchesSearch,
} from './utils';
import type { BookSummary } from './types';

describe('getDifficultyStyles', () => {
    it('should return emerald styles for easy', () => {
        const result = getDifficultyStyles('easy');
        expect(result).toBe('bg-emerald-100 text-emerald-700 border-emerald-400');
    });

    it('should return orange styles for medium', () => {
        const result = getDifficultyStyles('medium');
        expect(result).toBe('bg-orange-100 text-orange-700 border-orange-400');
    });

    it('should return red styles for hard', () => {
        const result = getDifficultyStyles('hard');
        expect(result).toBe('bg-red-100 text-red-700 border-red-400');
    });

    it('should handle case-insensitive input', () => {
        expect(getDifficultyStyles('EASY')).toBe('bg-emerald-100 text-emerald-700 border-emerald-400');
        expect(getDifficultyStyles('Medium')).toBe('bg-orange-100 text-orange-700 border-orange-400');
    });

    it('should return default styles for unknown difficulty', () => {
        const result = getDifficultyStyles('unknown');
        expect(result).toBe('bg-gray-100 text-gray-600 border-gray-300');
    });
});

describe('toTitleCase', () => {
    it('should convert lowercase to title case', () => {
        expect(toTitleCase('hello world')).toBe('Hello World');
    });

    it('should handle single word', () => {
        expect(toTitleCase('hello')).toBe('Hello');
    });

    it('should handle already title case', () => {
        expect(toTitleCase('Hello World')).toBe('Hello World');
    });

    it('should handle all uppercase', () => {
        expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    });

    it('should handle mixed case', () => {
        expect(toTitleCase('hElLo WoRlD')).toBe('Hello World');
    });

    it('should handle empty string', () => {
        expect(toTitleCase('')).toBe('');
    });

    it('should handle multiple spaces', () => {
        expect(toTitleCase('hello   world')).toBe('Hello   World');
    });
});

describe('matchesFilters', () => {
    const mockBook: BookSummary = {
        path: 'test.json',
        title: 'Test Book',
        author: 'Test Author',
        difficulty: 'Easy',
        type: 'Adventure',
        duration: '30 min',
        chapters: 5,
        tags: ['Fantasy'],
        summary: 'A test book',
    };

    it('should return true when no filters', () => {
        expect(matchesFilters(mockBook, [])).toBe(true);
    });

    it('should match by type', () => {
        expect(matchesFilters(mockBook, ['Adventure'])).toBe(true);
        expect(matchesFilters(mockBook, ['Mystery'])).toBe(false);
    });

    it('should match by difficulty', () => {
        expect(matchesFilters(mockBook, ['Easy'])).toBe(true);
        expect(matchesFilters(mockBook, ['Hard'])).toBe(false);
    });

    it('should match case-insensitively', () => {
        expect(matchesFilters(mockBook, ['adventure'])).toBe(true);
        expect(matchesFilters(mockBook, ['easy'])).toBe(true);
    });

    it('should require all filters to match', () => {
        expect(matchesFilters(mockBook, ['Adventure', 'EASY'])).toBe(true);
        expect(matchesFilters(mockBook, ['Adventure', 'HARD'])).toBe(false);
    });

    it('should return false if any filter does not match', () => {
        expect(matchesFilters(mockBook, ['Adventure', 'Mystery'])).toBe(false);
    });
});

describe('matchesSearch', () => {
    const mockBook: BookSummary = {
        path: 'test.json',
        title: 'The Great Adventure',
        author: 'John Doe',
        difficulty: 'Easy',
        type: 'Adventure',
        duration: '30 min',
        chapters: 5,
        tags: ['Fantasy'],
        summary: 'A thrilling adventure story about heroes and quests',
    };

    it('should return true when query is empty', () => {
        expect(matchesSearch(mockBook, '')).toBe(true);
        expect(matchesSearch(mockBook, '   ')).toBe(true);
    });

    it('should match by title', () => {
        expect(matchesSearch(mockBook, 'Great')).toBe(true);
        expect(matchesSearch(mockBook, 'Adventure')).toBe(true);
        expect(matchesSearch(mockBook, 'The Great')).toBe(true);
    });

    it('should match by author', () => {
        expect(matchesSearch(mockBook, 'John')).toBe(true);
        expect(matchesSearch(mockBook, 'Doe')).toBe(true);
        expect(matchesSearch(mockBook, 'John Doe')).toBe(true);
    });

    it('should match by summary', () => {
        expect(matchesSearch(mockBook, 'thrilling')).toBe(true);
        expect(matchesSearch(mockBook, 'heroes')).toBe(true);
        expect(matchesSearch(mockBook, 'quests')).toBe(true);
    });

    it('should be case-insensitive', () => {
        expect(matchesSearch(mockBook, 'GREAT')).toBe(true);
        expect(matchesSearch(mockBook, 'john')).toBe(true);
        expect(matchesSearch(mockBook, 'THRILLING')).toBe(true);
    });

    it('should return false when no match', () => {
        expect(matchesSearch(mockBook, 'Mystery')).toBe(false);
        expect(matchesSearch(mockBook, 'Smith')).toBe(false);
        expect(matchesSearch(mockBook, 'zombies')).toBe(false);
    });

    it('should handle partial matches', () => {
        expect(matchesSearch(mockBook, 'vent')).toBe(true); // part of "Adventure"
        expect(matchesSearch(mockBook, 'oe')).toBe(true); // part of "Doe"
    });
});
