import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useBook, useGameState } from "./hooks";
import { HealthChip } from "./components/HealthChip";
import { GameEndScreen } from "./components/GameEndScreen";
import { ProgressBar } from "../../ui/ProgressBar";
import { SectionCounter } from "./components/SectionCounter";
import { Icon } from "../../ui/Icon";

export function GamePage() {
    const { path } = useParams();
    const [searchParams] = useSearchParams();
    const bookPath = path ?? "";
    const startNew = searchParams.get("new") === "true";

    const { data: book, isLoading, isError } = useBook(bookPath);
    const {
        hp,
        current,
        progress,
        isGameOver,
        isGameWon,
        isLoadingProgress,
        applyOption,
        saveGameProgress,
        restartGame,
    } = useGameState(book, bookPath, startNew);

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);
        try {
            await saveGameProgress();
            setSaveMessage("Progress saved!");
            setTimeout(() => setSaveMessage(null), 2000);
        } catch (error) {
            setSaveMessage("Failed to save progress");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || isLoadingProgress) {
        return (
            <div className="min-h-screen bg-[#fbf7f2] p-10 text-center">
                Loading...
            </div>
        );
    }

    if (isError || !book || !current) {
        return (
            <div className="min-h-screen bg-[#fbf7f2] flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl border border-[#ead8c6] text-center max-w-md shadow-sm">
                    <h2 className="text-xl font-extrabold text-[#2b1f17]">
                        Book unavailable
                    </h2>

                    <p className="mt-2 text-sm text-[#6b5647]">
                        This book could not be loaded. It may not exist on the server.
                    </p>

                    <Link
                        to="/"
                        className="mt-5 inline-block px-4 py-2 rounded-xl bg-[#b47714] hover:bg-[#9b6510] transition text-white font-semibold text-sm"
                    >
                        Back to Library
                    </Link>
                </div>
            </div>
        );
    }

    // Show full-screen end screen when game is over or won
    if (isGameOver || isGameWon) {
        return (
            <GameEndScreen
                isWon={isGameWon}
                bookTitle={book.title}
                progress={progress}
                onRestart={restartGame}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#fbf7f2]">
            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <Link to="/" className="text-sm hover:underline whitespace-nowrap">
                            ← Back to Library
                        </Link>

                        <div className="px-4 py-2 rounded-full border border-[#ead8c6] bg-[#f6efe7] text-sm font-semibold inline-flex items-center gap-2 max-w-full sm:max-w-none truncate sm:truncate-none">
                            <span className="hidden sm:inline">📖</span>
                            <span className="truncate">{book.title}</span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <HealthChip hp={hp} />

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving || isGameOver || isGameWon}
                                className="px-3 sm:px-4 py-2 rounded-xl border border-[#ead8c6] bg-[#fffaf4] hover:bg-[#fbf3ea] transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                            >
                                <Icon name="save" label="Save" />
                                <span className="hidden sm:inline">
                                    {isSaving ? "Saving..." : saveMessage || "Save Progress"}
                                </span>
                                <span className="sm:hidden">
                                    {isSaving ? "Saving..." : "Save"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Progress Section */}
                    {progress && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[#ead8c6]">
                            <div className="flex-1 w-full sm:w-auto">
                                <ProgressBar
                                    percentage={progress.percentage}
                                    label="Adventure Progress"
                                />
                            </div>
                            <SectionCounter
                                current={progress.sectionNumber}
                                total={progress.totalSections}
                            />
                        </div>
                    )}
                </div>

                {/* Story Card */}
                <div className="mt-6 rounded-2xl border border-[#ead8c6] bg-white p-6 sm:p-10 shadow-sm">
                    <div className="whitespace-pre-line leading-7 sm:leading-8 text-[#2b1f17] text-base sm:text-[17px]">
                        {current.text}
                    </div>

                    {current.options?.length ? (
                        <>
                            <hr className="my-10 border-t border-[#ead8c6]" />

                            <h2
                                className="text-xl font-extrabold"
                            >
                                What do you choose?
                            </h2>

                            <div className="mt-6 space-y-4">
                                {current.options.map((opt, index) => (
                                    <button
                                        key={`${current.id}-${index}`}
                                        type="button"
                                        onClick={() => applyOption(opt)}
                                        disabled={isGameOver || isGameWon}
                                        className={[
                                            "w-full text-left p-4 sm:p-6 rounded-2xl border border-[#ead8c6] bg-[#fffaf4] transition-all duration-200",
                                            isGameOver || isGameWon
                                                ? "opacity-60 cursor-not-allowed"
                                                : "hover:bg-[#fbf3ea] hover:shadow-md",
                                        ].join(" ")}
                                    >
                                        <div className="flex gap-3 sm:gap-4">
                                            <span className="h-8 w-8 sm:h-7 sm:w-7 rounded-full bg-[#2b1f17] text-white text-xs sm:text-xs flex items-center justify-center flex-shrink-0">
                                                {index + 1}
                                            </span>

                                            <div className="font-semibold text-[#2b1f17]">
                                                {opt.description}
                                            </div>
                                        </div>

                                        {opt.consequence &&
                                            (opt.consequence.type.toUpperCase() ===
                                                "LOSE_HEALTH" ||
                                                opt.consequence.type.toUpperCase() ===
                                                "GAIN_HEALTH") ? (
                                            <div className="mt-2 text-sm text-[#6b5647] italic">
                                                {opt.consequence.text ??
                                                    `Health ${opt.consequence.type.toUpperCase() === "LOSE_HEALTH" ? "-" : "+"}${opt.consequence.value}`}
                                            </div>
                                        ) : null}
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
