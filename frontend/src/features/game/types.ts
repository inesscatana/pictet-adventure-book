import type { Difficulty } from "../books/types";

export type Consequence = {
    type: string;
    value: string;
    text?: string;
};

export type Option = {
    description: string;
    gotoId: string;
    consequence?: Consequence;
};

export type Section = {
    id: string;
    text: string;
    type: string;
    options?: Option[];
};

export type Book = {
    title: string;
    author: string;
    difficulty: Difficulty;
    type: string;
    sections: Section[];
};

export type SavedProgress = {
    book: string;
    sectionId: string;
    health: number;
    timestamp: number;
};
