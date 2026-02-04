import { describe, it, expect } from 'vitest';
import {
    processConsequence,
    calculateProgress,
    isEndSection,
    getInitialSection,
    getInitialSectionId,
    getHealthColor,
    getHealthStatus,
    INITIAL_HEALTH,
    MIN_HEALTH,
    MAX_HEALTH,
} from './utils';
import type { Consequence, Section, Book } from './types';

describe('processConsequence', () => {
    it('should decrease health for LOSE_HEALTH', () => {
        const consequence: Consequence = {
            type: 'LOSE_HEALTH',
            value: '10',
            text: 'You lose health',
        };
        const result = processConsequence(consequence, 100);
        expect(result.newHealth).toBe(90);
        expect(result.message).toBe('You lose health');
    });

    it('should increase health for GAIN_HEALTH', () => {
        const consequence: Consequence = {
            type: 'GAIN_HEALTH',
            value: '5',
            text: 'You gain health',
        };
        const result = processConsequence(consequence, 50);
        expect(result.newHealth).toBe(55);
    });

    it('should generate default message for LOSE_HEALTH when text is missing', () => {
        const consequence: Consequence = {
            type: 'LOSE_HEALTH',
            value: '10',
        };
        const result = processConsequence(consequence, 100);
        expect(result.newHealth).toBe(90);
        expect(result.message).toBe('You lost 10 health points.');
    });

    it('should generate default message for GAIN_HEALTH when text is missing', () => {
        const consequence: Consequence = {
            type: 'GAIN_HEALTH',
            value: '5',
        };
        const result = processConsequence(consequence, 50);
        expect(result.newHealth).toBe(55);
        expect(result.message).toBe('You gained 5 health points.');
    });

    it('should not go below MIN_HEALTH', () => {
        const consequence: Consequence = {
            type: 'LOSE_HEALTH',
            value: '150',
        };
        const result = processConsequence(consequence, 100);
        expect(result.newHealth).toBe(MIN_HEALTH);
    });

    it('should not exceed MAX_HEALTH', () => {
        const consequence: Consequence = {
            type: 'GAIN_HEALTH',
            value: '50',
        };
        const result = processConsequence(consequence, 80);
        expect(result.newHealth).toBe(MAX_HEALTH);
    });

    it('should handle case-insensitive consequence types', () => {
        const consequence: Consequence = {
            type: 'lose_health',
            value: '10',
        };
        const result = processConsequence(consequence, 100);
        expect(result.newHealth).toBe(90);
    });

    it('should handle unknown consequence types', () => {
        const consequence: Consequence = {
            type: 'UNKNOWN',
            value: '10',
            text: 'Something happened',
        };
        const result = processConsequence(consequence, 100);
        expect(result.newHealth).toBe(100);
        expect(result.message).toBe('Something happened');
    });
});

describe('isEndSection', () => {
    it('should return true for END type', () => {
        const section: Section = {
            id: '1',
            text: 'The end',
            type: 'END',
            options: [],
        };
        expect(isEndSection(section)).toBe(true);
    });

    it('should return true for end type (case-insensitive)', () => {
        const section: Section = {
            id: '1',
            text: 'The end',
            type: 'end',
            options: [],
        };
        expect(isEndSection(section)).toBe(true);
    });

    it('should return true for sections with no options', () => {
        const section: Section = {
            id: '1',
            text: 'Dead end',
            type: 'NODE',
            options: [],
        };
        expect(isEndSection(section)).toBe(true);
    });

    it('should return true for sections with undefined options', () => {
        const section: Section = {
            id: '1',
            text: 'Dead end',
            type: 'NODE',
        };
        expect(isEndSection(section)).toBe(true);
    });

    it('should return false for sections with options', () => {
        const section: Section = {
            id: '1',
            text: 'Choose',
            type: 'NODE',
            options: [{ description: 'Option 1', gotoId: '2' }],
        };
        expect(isEndSection(section)).toBe(false);
    });

    it('should return false for null section', () => {
        expect(isEndSection(null)).toBe(false);
    });
});

describe('getInitialSection', () => {
    it('should return section with BEGIN type', () => {
        const sections: Section[] = [
            { id: '1', text: 'Section 1', type: 'NODE' },
            { id: '2', text: 'Section 2', type: 'BEGIN' },
            { id: '3', text: 'Section 3', type: 'NODE' },
        ];
        const result = getInitialSection(sections);
        expect(result?.id).toBe('2');
    });

    it('should return first section if no BEGIN type found', () => {
        const sections: Section[] = [
            { id: '1', text: 'Section 1', type: 'NODE' },
            { id: '2', text: 'Section 2', type: 'NODE' },
        ];
        const result = getInitialSection(sections);
        expect(result?.id).toBe('1');
    });

    it('should return undefined for empty array', () => {
        const result = getInitialSection([]);
        expect(result).toBeUndefined();
    });
});

describe('getInitialSectionId', () => {
    it('should return string ID of initial section', () => {
        const book: Book = {
            title: 'Test Book',
            author: 'Test Author',
            difficulty: 'EASY',
            type: 'Adventure',
            sections: [
                { id: '1', text: 'Section 1', type: 'BEGIN' },
                { id: '2', text: 'Section 2', type: 'NODE' },
            ],
        };
        const result = getInitialSectionId(book);
        expect(result).toBe('1');
    });

    it('should handle numeric IDs', () => {
        const book: Book = {
            title: 'Test Book',
            author: 'Test Author',
            difficulty: 'EASY',
            type: 'Adventure',
            sections: [
                { id: 100, text: 'Section 1', type: 'BEGIN' },
            ],
        };
        const result = getInitialSectionId(book);
        expect(result).toBe('100');
    });

    it('should return null if no sections', () => {
        const book: Book = {
            title: 'Test Book',
            author: 'Test Author',
            difficulty: 'EASY',
            type: 'Adventure',
            sections: [],
        };
        const result = getInitialSectionId(book);
        expect(result).toBeNull();
    });
});

describe('calculateProgress', () => {
    const mockBook: Book = {
        title: 'Test Book',
        author: 'Test Author',
        difficulty: 'EASY',
        type: 'Adventure',
        sections: [
            { id: '1', text: 'Section 1', type: 'BEGIN' },
            { id: '2', text: 'Section 2', type: 'NODE' },
            { id: '3', text: 'Section 3', type: 'NODE' },
            { id: '4', text: 'Section 4', type: 'END' },
        ],
    };

    it('should calculate progress for first section', () => {
        const currentSection: Section = {
            id: '1',
            text: 'Section 1',
            type: 'BEGIN',
        };
        const result = calculateProgress(mockBook, '1', currentSection);
        expect(result).not.toBeNull();
        expect(result?.sectionNumber).toBe(1);
        expect(result?.totalSections).toBe(4);
        expect(result?.percentage).toBe(25);
    });

    it('should calculate progress for middle section', () => {
        const currentSection: Section = {
            id: '2',
            text: 'Section 2',
            type: 'NODE',
        };
        const result = calculateProgress(mockBook, '2', currentSection);
        expect(result).not.toBeNull();
        expect(result?.sectionNumber).toBe(2);
        expect(result?.totalSections).toBe(4);
        expect(result?.percentage).toBe(50);
    });

    it('should return 100% for END section', () => {
        const currentSection: Section = {
            id: '4',
            text: 'Section 4',
            type: 'END',
        };
        const result = calculateProgress(mockBook, '4', currentSection);
        expect(result).not.toBeNull();
        expect(result?.sectionNumber).toBe(4);
        expect(result?.totalSections).toBe(4);
        expect(result?.percentage).toBe(100);
    });

    it('should show total sections as current when on END section', () => {
        const currentSection: Section = {
            id: '4',
            text: 'Section 4',
            type: 'END',
        };
        const result = calculateProgress(mockBook, '4', currentSection);
        expect(result?.sectionNumber).toBe(4);
    });

    it('should return null if book is undefined', () => {
        const result = calculateProgress(undefined, '1', null);
        expect(result).toBeNull();
    });

    it('should return null if currentSectionId is null', () => {
        const result = calculateProgress(mockBook, null, null);
        expect(result).toBeNull();
    });

    it('should return null if section not found', () => {
        const result = calculateProgress(mockBook, '999', null);
        expect(result).toBeNull();
    });

    it('should handle numeric section IDs', () => {
        const bookWithNumericIds: Book = {
            title: 'Test Book',
            author: 'Test Author',
            difficulty: 'EASY',
            type: 'Adventure',
            sections: [
                { id: 1, text: 'Section 1', type: 'BEGIN' },
                { id: 2, text: 'Section 2', type: 'NODE' },
            ],
        };
        const currentSection: Section = {
            id: 2,
            text: 'Section 2',
            type: 'NODE',
        };
        const result = calculateProgress(bookWithNumericIds, '2', currentSection);
        expect(result).not.toBeNull();
        expect(result?.sectionNumber).toBe(2);
    });
});

describe('getHealthColor', () => {
    it('should return emerald for health > 60', () => {
        expect(getHealthColor(70)).toBe('bg-emerald-500');
        expect(getHealthColor(100)).toBe('bg-emerald-500');
    });

    it('should return orange for health between 30 and 60', () => {
        expect(getHealthColor(45)).toBe('bg-orange-500');
        expect(getHealthColor(60)).toBe('bg-orange-500');
    });

    it('should return red for health <= 30', () => {
        expect(getHealthColor(25)).toBe('bg-red-500');
        expect(getHealthColor(0)).toBe('bg-red-500');
    });
});

describe('getHealthStatus', () => {
    it('should return Healthy for health > 60', () => {
        expect(getHealthStatus(70)).toBe('Healthy');
        expect(getHealthStatus(100)).toBe('Healthy');
    });

    it('should return Injured for health between 30 and 60', () => {
        expect(getHealthStatus(45)).toBe('Injured');
        expect(getHealthStatus(60)).toBe('Injured');
    });

    it('should return Critical for health between 0 and 30', () => {
        expect(getHealthStatus(25)).toBe('Critical');
        expect(getHealthStatus(1)).toBe('Critical');
    });

    it('should return Defeated for health 0', () => {
        expect(getHealthStatus(0)).toBe('Defeated');
    });
});
