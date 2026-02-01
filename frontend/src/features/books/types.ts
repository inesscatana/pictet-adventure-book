
export type Difficulty = "Easy" | "Medium" | "Hard";

export type BookSummary = {
    path: string;
    title: string;
    author: string;
    difficulty: Difficulty;
    type: string;
    duration: string;
    chapters: number;
    tags: string[];
    summary: string;
};