import { useState, useMemo } from "react";
import { useBooks } from "./hooks";
import { Icon } from "../../ui/Icon";
import { Chip } from "./components/Chip";
import { SearchInput } from "./components/SearchInput";
import { BookCard } from "./components/BookCard";
import type { BookSummary } from "./types";


export function HomePage() {
    const { data: books = [], isLoading, isError, error } = useBooks();

    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const availableFilters = useMemo(() => {
        const s = new Set<string>();
        for (const b of books) {
            if (b.type) s.add(b.type);
            if (b.difficulty) s.add(b.difficulty);
        }

        const preferredOrder = ["Fantasy", "Adventure", "High Fantasy", "Steampunk Mystery", "Easy", "Medium", "Hard"];
        const arr = Array.from(s);
        arr.sort((a, b) => {
            const ia = preferredOrder.indexOf(a);
            const ib = preferredOrder.indexOf(b);
            if (ia === -1 && ib === -1) return a.localeCompare(b);
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });

        return arr;
    }, [books]);

    const toggleFilter = (f: string) => {
        setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
    };

    const filteredBooks = useMemo(() => {
        const q = search.trim().toLowerCase();

        return (books as BookSummary[]).filter((b) => {
            const matchesSearch =
                !q ||
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q) ||
                b.summary.toLowerCase().includes(q);

            const matchesFilters =
                activeFilters.length === 0 ||
                activeFilters.every((f) => {
                    const fl = f.toLowerCase();
                    return b.type.toLowerCase() === fl || b.difficulty.toLowerCase() === fl;
                });

            return matchesSearch && matchesFilters;
        });
    }, [books, search, activeFilters]);

    return (
        <div className="min-h-screen bg-[#fbf7f2] text-[#2b1f17]">
            {/* HERO */}
            <section className="w-full">
                <div
                    className="relative w-full py-16 md:py-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(43,31,23,.72), rgba(43,31,23,.72)), url('/hero.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="mx-auto max-w-6xl px-4 text-center text-white/95">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                            <Icon name="sparkling" label="Sparkles" className="mr-2" />
                            Adventure Awaits
                            <Icon name="sparkling" label="Sparkles" className="ml-2" />
                        </h1>

                        <p className="mt-5 max-w-3xl mx-auto text-lg md:text-xl text-white/85 leading-relaxed">
                            Embark on epic quests where every choice shapes your destiny. Explore mystical realms, solve ancient mysteries,
                            and become the hero of your own story.
                        </p>

                        <div className="mt-10 inline-flex items-center gap-4 text-white/90 font-semibold">
                            <Icon name="openBook" label="Books available" className="text-xl" />
                            <span>{books.length} Epic Adventures Available</span>
                            <Icon name="sparkling" label="Sparkles" className="text-xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* LIBRARY */}
            <section className="mx-auto max-w-6xl px-4 py-10">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold" style={{ fontFamily: "Georgia, serif" }}>
                        <Icon name="book" label="Library" className="mr-2" />
                        The Adventure Library
                    </h2>
                    <p className="mt-3 text-[#6b5647] max-w-3xl mx-auto">
                        Choose your next adventure from our collection of interactive tales. Each book offers unique paths and
                        multiple endings based on your choices.
                    </p>
                </div>

                {/* Search */}
                <div className="mt-8 flex justify-center">
                    <SearchInput value={search} onChange={setSearch} />
                </div>

                {/* Filters */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-sm text-[#6b5647] mr-2 inline-flex items-center gap-2">
                        <Icon name="filter" label="Filters" />
                        Filters:
                    </span>

                    {availableFilters.map((f) => (
                        <Chip key={f} active={activeFilters.includes(f)} onClick={() => toggleFilter(f)}>
                            {f}
                        </Chip>
                    ))}

                    {activeFilters.length > 0 ? (
                        <button onClick={() => setActiveFilters([])} className="ml-2 text-sm text-[#6b5647] underline">
                            Clear All
                        </button>
                    ) : null}
                </div>

                {/* State */}
                <div className="mt-8">
                    {isLoading ? <p className="text-center text-[#6b5647]">Loading books…</p> : null}

                    {isError ? (
                        <p className="text-center text-red-700">
                            {(error as Error)?.message ?? "Error loading books"}
                        </p>
                    ) : null}

                    {!isLoading && !isError ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredBooks.map((b) => (
                                <BookCard key={b.path} book={b} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
