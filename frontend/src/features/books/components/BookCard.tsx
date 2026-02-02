import type { BookSummary } from "../types";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../ui/Icon";
import { difficultyLabelMap, getDifficultyStyles } from "../utils";

export function BookCard({ book }: { book: BookSummary }) {
    const navigate = useNavigate();

    return (
        <article className="h-full rounded-2xl border border-[#ead8c6] bg-[#fffaf4] shadow-[0_6px_18px_rgba(43,31,23,0.06)] p-7 flex flex-col">
            <div>
                <h3 className="text-2xl font-extrabold">
                    {book.title}
                </h3>
                <p className="mt-1 text-sm text-[#6b5647]">by {book.author}</p>

                <p className="mt-4 text-sm leading-relaxed text-[#4a352a] min-h-[120px] overflow-hidden">
                    {book.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                    <span
                        className={`h-6 px-3 rounded-full text-xs font-semibold border ${getDifficultyStyles(book.difficulty)} inline-flex items-center`}
                    >
                        {
                            difficultyLabelMap[
                            book.difficulty.toLowerCase() as keyof typeof difficultyLabelMap
                            ]
                        }
                    </span>
                    <span className="h-6 px-3 rounded-full text-xs font-semibold border border-[#ead8c6] bg-[#f6efe7] inline-flex items-center">
                        {book.type}
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-6 text-sm text-[#6b5647]">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <Icon name="clock" label="Duration" />
                        {book.duration}
                    </span>
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <Icon name="openBook" label="Chapters" />
                        {book.chapters} chapters
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 min-h-[32px]">
                    {(book.tags ?? []).slice(0, 3).map((t) => (
                        <span
                            key={t}
                            className="h-6 px-3 rounded-full text-xs font-semibold bg-[#e9e1d8] text-[#4a352a] inline-flex items-center"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6">
                <button
                    onClick={() => navigate(`/game/${book.path}`)}
                    className="h-11 w-full rounded-xl font-semibold text-white shadow-sm
          bg-[#c88c1e] hover:bg-[#b47714] transition
          inline-flex items-center justify-center gap-2"
                >
                    <Icon name="sparkling" label="Begin quest" />
                    Begin Quest
                </button>
            </div>
        </article>
    );
}
