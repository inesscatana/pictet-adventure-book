import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "./api";
import { listProgress } from "../game/api";
import { FILTER_PREFERRED_ORDER, matchesFilters, matchesSearch } from "./utils";
import type { BookSummary } from "./types";

export function useBooks() {
    return useQuery({
        queryKey: ["books"],
        queryFn: getBooks,
    });
}

export function useBookFilters(books: BookSummary[]) {
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const availableFilters = useMemo(() => {
        const s = new Set<string>();
        for (const b of books) {
            if (b.type) s.add(b.type);
            if (b.difficulty) s.add(b.difficulty);
        }

        const arr = Array.from(s);
        arr.sort((a, b) => {
            const ia = FILTER_PREFERRED_ORDER.indexOf(a as typeof FILTER_PREFERRED_ORDER[number]);
            const ib = FILTER_PREFERRED_ORDER.indexOf(b as typeof FILTER_PREFERRED_ORDER[number]);
            if (ia === -1 && ib === -1) return a.localeCompare(b);
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });

        return arr;
    }, [books]);

    const filteredBooks = useMemo(() => {
        return books.filter((b) => {
            return matchesSearch(b, search) && matchesFilters(b, activeFilters);
        });
    }, [books, search, activeFilters]);

    const toggleFilter = (f: string) => {
        setActiveFilters((prev) =>
            prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
        );
    };

    const clearFilters = () => setActiveFilters([]);

    return {
        search,
        setSearch,
        activeFilters,
        availableFilters,
        filteredBooks,
        toggleFilter,
        clearFilters,
    };
}

export function useSavedProgress() {
    return useQuery({
        queryKey: ["savedProgress"],
        queryFn: listProgress,
    });
}