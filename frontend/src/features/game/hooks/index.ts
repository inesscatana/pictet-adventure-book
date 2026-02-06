import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBook, getProgress, saveProgress } from "../api";
import type { Book, Option } from "../types";
import {
    INITIAL_HEALTH,
    getInitialSectionId,
    isEndSection,
    processConsequence,
    calculateProgress,
} from "../utils/utils";

export function useBook(path: string) {
    return useQuery({
        queryKey: ["book", path],
        queryFn: () => getBook(path),
        enabled: !!path,
    });
}

export function useGameState(
    book: Book | undefined,
    bookPath: string | null,
    startNew: boolean = false
) {
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [hp, setHp] = useState(INITIAL_HEALTH);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameWon, setIsGameWon] = useState(false);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);

    // Helper function to initialize game from beginning
    const initializeFromBeginning = useCallback((book: Book) => {
        setCurrentId(getInitialSectionId(book));
        setHp(INITIAL_HEALTH);
    }, []);

    // Load saved progress when book loads (unless startNew is true)
    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!book || !bookPath) {
                if (!cancelled) setIsLoadingProgress(false);
                return;
            }

            // reset flags for this session
            if (!cancelled) {
                setIsGameOver(false);
                setIsGameWon(false);
                setIsLoadingProgress(true);
            }

            if (startNew) {
                if (!cancelled) {
                    initializeFromBeginning(book);
                    setIsLoadingProgress(false);
                }
                return;
            }

            try {
                const saved = await getProgress(bookPath);
                if (cancelled) return;

                if (saved) {
                    setCurrentId(String(saved.sectionId));
                    setHp(saved.health);
                } else {
                    initializeFromBeginning(book);
                }
            } catch {
                if (!cancelled) {
                    initializeFromBeginning(book);
                }
            } finally {
                if (!cancelled) setIsLoadingProgress(false);
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [book, bookPath, startNew, initializeFromBeginning]);

    // Get current section
    const current = useMemo(() => {
        if (!book || !currentId) return null;
        return book.sections.find((s) => String(s.id) === String(currentId)) ?? null;
    }, [book, currentId]);

    // Calculate progress
    const progress = useMemo(() => {
        return calculateProgress(book, currentId, current);
    }, [book, currentId, current]);

    // Game end conditions as effects (side effects live here)
    useEffect(() => {
        if (hp <= 0) setIsGameOver(true);
    }, [hp]);

    useEffect(() => {
        if (current && isEndSection(current)) setIsGameWon(true);
    }, [current]);

    // Handle option selection (pure updater for hp)
    const applyOption = useCallback(
        (option: Option) => {
            if (isGameOver || isGameWon) return;

            const consequence = option.consequence;
            if (consequence) {
                const type = consequence.type.toUpperCase();
                const isHealthConsequence =
                    type === "LOSE_HEALTH" || type === "GAIN_HEALTH";

                if (isHealthConsequence) {
                    setHp((prev) => {
                        const { newHealth } = processConsequence(consequence, prev);
                        return newHealth;
                    });
                }
            }

            setCurrentId(String(option.gotoId));
        },
        [isGameOver, isGameWon]
    );

    // Save progress
    const saveGameProgress = useCallback(async () => {
        if (!book || !currentId || !bookPath) return;
        await saveProgress(bookPath, currentId, hp);
    }, [book, currentId, hp, bookPath]);

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
        progress,
        isGameOver,
        isGameWon,
        isLoadingProgress,
        applyOption,
        saveGameProgress,
        restartGame,
    };
}
