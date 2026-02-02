import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useBook } from "./hooks";
import type { Section } from "./types";

function getInitialSection(sections: Section[]) {
    return sections[0];
}

export function GamePage() {
    const { path } = useParams();
    const { data: book, isLoading, isError } = useBook(path ?? "");

    const [currentId, setCurrentId] = useState<string | null>(null);

    useEffect(() => {
        if (!book) return;
        const initial = getInitialSection(book.sections);
        setCurrentId(initial?.id ?? null);
    }, [book]);

    const current = useMemo(() => {
        if (!book || !currentId) return null;
        return book.sections.find((s) => s.id === currentId) ?? null;
    }, [book, currentId]);

    if (isLoading) return <div className="p-10">Loading...</div>;
    if (isError || !book || !current) return <div className="p-10">Book not found</div>;

    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-4xl px-4 py-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-sm hover:underline">
                        ← Back to Library
                    </Link>

                    <div className="px-4 py-2 rounded-full border border-[#ead8c6] bg-[#f6efe7] text-sm font-semibold">
                        {book.title}
                    </div>

                    <button className="px-4 py-2 border rounded-xl">
                        Save Progress
                    </button>
                </div>

                {/* Story Card */}
                <div className="mt-6 rounded-2xl border border-[#ead8c6] bg-[#fbf7f2] p-8 shadow-sm">
                    <div className="whitespace-pre-line leading-7 text-[#2b1f17]">
                        {current.text}
                    </div>

                    {current.options?.length ? (
                        <>
                            <hr className="my-8 border-[#ead8c6]" />

                            <h2 className="text-xl font-bold mb-4">
                                What do you choose?
                            </h2>

                            <div className="space-y-4 bg-[#fffaf4]">
                                {current.options.map((opt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentId(opt.gotoId)}
                                        className="w-full text-left p-5 rounded-2xl border border-[#ead8c6] hover:bg-[#fbf3ea] transition"
                                    >
                                        <div className="flex gap-4">
                                            <span className="h-7 w-7 rounded-full bg-[#2b1f17] text-white text-xs flex items-center justify-center">
                                                {index + 1}
                                            </span>

                                            <div className="font-semibold">
                                                {opt.description}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="mt-10 text-center text-[#6b5647]">
                            The End
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
