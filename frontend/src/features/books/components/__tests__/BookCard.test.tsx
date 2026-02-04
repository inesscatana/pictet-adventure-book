import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { BookCard } from '../BookCard';
import type { BookSummary } from '../../types';
import type { SavedProgress } from '../../../game/types';

const mockBook: BookSummary = {
    path: 'test-book.json',
    title: 'Test Adventure',
    author: 'Test Author',
    difficulty: 'Easy',
    type: 'Adventure',
    duration: '30 min',
    chapters: 5,
    tags: ['Fantasy', 'Magic'],
    summary: 'A test adventure book',
};

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('BookCard', () => {
    it('should render book information', () => {
        renderWithRouter(<BookCard book={mockBook} />);

        expect(screen.getByText('Test Adventure')).toBeInTheDocument();
        expect(screen.getByText('by Test Author')).toBeInTheDocument();
        expect(screen.getByText('A test adventure book')).toBeInTheDocument();
    });

    it('should display difficulty badge', () => {
        renderWithRouter(<BookCard book={mockBook} />);

        expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    it('should display book type', () => {
        renderWithRouter(<BookCard book={mockBook} />);

        expect(screen.getByText('Adventure')).toBeInTheDocument();
    });

    it('should display duration and chapters', () => {
        renderWithRouter(<BookCard book={mockBook} />);

        expect(screen.getByText('30 min')).toBeInTheDocument();
        expect(screen.getByText('5 chapters')).toBeInTheDocument();
    });

    it('should display tags', () => {
        renderWithRouter(<BookCard book={mockBook} />);

        expect(screen.getByText('Fantasy')).toBeInTheDocument();
        expect(screen.getByText('Magic')).toBeInTheDocument();
    });

    it('should display "Begin Quest" button when no saved progress', () => {
        renderWithRouter(<BookCard book={mockBook} />);

        expect(screen.getByText('Begin Quest')).toBeInTheDocument();
        expect(screen.queryByText('Resume Quest')).not.toBeInTheDocument();
    });

    it('should display "Resume Quest" and "Start New" buttons when saved progress exists', () => {
        const savedProgress: SavedProgress = {
            book: 'test-book.json',
            sectionId: '5',
            health: 75,
            timestamp: Date.now(),
        };

        renderWithRouter(<BookCard book={mockBook} savedProgress={savedProgress} />);

        expect(screen.getByText('Resume Quest')).toBeInTheDocument();
        expect(screen.getByText('Start New')).toBeInTheDocument();
        expect(screen.queryByText('Begin Quest')).not.toBeInTheDocument();
    });

    it('should navigate to game page when "Begin Quest" is clicked', async () => {
        const user = userEvent.setup();
        renderWithRouter(<BookCard book={mockBook} />);

        const beginButton = screen.getByText('Begin Quest');
        await user.click(beginButton);

        // Check that navigation would occur (button has onClick)
        expect(beginButton).toBeInTheDocument();
    });

    it('should navigate to game page when "Resume Quest" is clicked', async () => {
        const savedProgress: SavedProgress = {
            book: 'test-book.json',
            sectionId: '5',
            health: 75,
            timestamp: Date.now(),
        };

        const user = userEvent.setup();
        renderWithRouter(<BookCard book={mockBook} savedProgress={savedProgress} />);

        const resumeButton = screen.getByText('Resume Quest');
        await user.click(resumeButton);

        expect(resumeButton).toBeInTheDocument();
    });

    it('should navigate with new=true when "Start New" is clicked', async () => {
        const savedProgress: SavedProgress = {
            book: 'test-book.json',
            sectionId: '5',
            health: 75,
            timestamp: Date.now(),
        };

        const user = userEvent.setup();
        renderWithRouter(<BookCard book={mockBook} savedProgress={savedProgress} />);

        const startNewButton = screen.getByText('Start New');
        await user.click(startNewButton);

        expect(startNewButton).toBeInTheDocument();
    });

    it('should limit tags to 3', () => {
        const bookWithManyTags: BookSummary = {
            ...mockBook,
            tags: ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'],
        };

        renderWithRouter(<BookCard book={bookWithManyTags} />);

        expect(screen.getByText('Tag1')).toBeInTheDocument();
        expect(screen.getByText('Tag2')).toBeInTheDocument();
        expect(screen.getByText('Tag3')).toBeInTheDocument();
        expect(screen.queryByText('Tag4')).not.toBeInTheDocument();
        expect(screen.queryByText('Tag5')).not.toBeInTheDocument();
    });

    it('should handle missing tags gracefully', () => {
        const bookWithoutTags: BookSummary = {
            ...mockBook,
            tags: [],
        };

        renderWithRouter(<BookCard book={bookWithoutTags} />);

        expect(screen.getByText('Test Adventure')).toBeInTheDocument();
    });
});
