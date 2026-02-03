import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBook } from "./api";
import type { Book, Option, } from "./types";
import {
    INITIAL_HEALTH,
    getInitialSectionId,
    isEndSection,
    processConsequence,
} from "./utils";

export function useBook(path: string) {
    return useQuery({
        queryKey: ["book", path],
        queryFn: () => getBook(path),
        enabled: !!path,
    });
}

export function useGameState(book: Book | undefined) {
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [hp, setHp] = useState(INITIAL_HEALTH);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameWon, setIsGameWon] = useState(false);

    // Initialize game when book loads
    useEffect(() => {
        if (!book) return;

        setCurrentId(getInitialSectionId(book));
        setHp(INITIAL_HEALTH);
        setIsGameOver(false);
        setIsGameWon(false);
    }, [book]);

    // Get current section
    const current = useMemo(() => {
        if (!book || !currentId) return null;
        return book.sections.find((s) => String(s.id) === String(currentId)) ?? null;
    }, [book, currentId]);

    // Check for win condition (END section)
    useEffect(() => {
        if (isEndSection(current)) {
            setIsGameWon(true);
        }
    }, [current]);

    // Handle option selection
    const applyOption = useCallback(
        (option: Option) => {
            if (isGameOver || isGameWon) return;

            // Apply health consequence if exists
            const consequence = option.consequence;
            if (consequence) {
                const type = consequence.type.toUpperCase();
                const isHealthConsequence =
                    type === "LOSE_HEALTH" || type === "GAIN_HEALTH";

                if (isHealthConsequence) {
                    setHp((prev) => {
                        const { newHealth } = processConsequence(consequence, prev);

                        if (newHealth <= 0) {
                            setIsGameOver(true);
                        }

                        return newHealth;
                    });
                }
            }

            setCurrentId(String(option.gotoId));
        },
        [isGameOver, isGameWon]
    );

    // Restart game
    const restartGame = useCallback(() => {
        if (!book) return;

        setHp(INITIAL_HEALTH);
        setIsGameOver(false);
        setIsGameWon(false);
        setCurrentId(getInitialSectionId(book));
    }, [book]);

    return {
        hp,
        current,
        isGameOver,
        isGameWon,
        applyOption,
        restartGame,
    };
}