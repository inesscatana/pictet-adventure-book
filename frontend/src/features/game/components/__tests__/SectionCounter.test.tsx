import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionCounter } from '../SectionCounter';

describe('SectionCounter', () => {
    it('should display current and total sections', () => {
        render(<SectionCounter current={5} total={17} />);
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('17')).toBeInTheDocument();
    });

    it('should have proper ARIA label', () => {
        render(<SectionCounter current={3} total={10} />);
        const counter = screen.getByRole('status');
        expect(counter).toHaveAttribute('aria-label', 'Section 3 of 10');
    });

    it('should display "Section" and "of" text', () => {
        render(<SectionCounter current={1} total={5} />);
        expect(screen.getByText('Section')).toBeInTheDocument();
        expect(screen.getByText('of')).toBeInTheDocument();
    });

    it('should handle single section', () => {
        render(<SectionCounter current={1} total={1} />);
        const ones = screen.getAllByText('1');
        expect(ones).toHaveLength(2); // Current and total both show "1"
        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Section 1 of 1');
    });

    it('should handle large numbers', () => {
        render(<SectionCounter current={100} total={200} />);
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('200')).toBeInTheDocument();
    });
});
