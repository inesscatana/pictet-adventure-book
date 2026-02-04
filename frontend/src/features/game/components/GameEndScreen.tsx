import { Link } from "react-router-dom";
import { ProgressBar } from "../../../ui/ProgressBar";
import { SectionCounter } from "./SectionCounter";
import type { ProgressInfo } from "../utils/utils";

interface GameEndScreenProps {
    isWon: boolean;
    bookTitle: string;
    progress: ProgressInfo | null;
    onRestart: () => void;
}

export function GameEndScreen({
    isWon,
    bookTitle,
    progress,
    onRestart,
}: GameEndScreenProps) {
    return (
        <div className="min-h-screen bg-[#fbf7f2] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl">
                <div className="rounded-2xl bg-white border border-[#ead8c6] shadow-xl p-6 sm:p-12 text-center">
                    {isWon ? (
                        <>
                            <div className="text-5xl sm:text-6xl mb-4">🎉</div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2b1f17] mb-4">
                                Victory!
                            </h2>
                            <p className="text-base sm:text-lg text-[#6b5647] mb-8">
                                Congratulations! You've successfully completed <strong>{bookTitle}</strong>!
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-5xl sm:text-6xl mb-4">💀</div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2b1f17] mb-4">
                                Game Over
                            </h2>
                            <p className="text-base sm:text-lg text-[#6b5647] mb-8">
                                Your health has reached zero. The adventure ends here...
                            </p>
                        </>
                    )}

                    {/* Show progress at completion */}
                    {progress && (
                        <div className="mb-8 p-6 bg-[#f6efe7] rounded-xl border border-[#ead8c6]">
                            <div className="mb-4">
                                <ProgressBar
                                    percentage={progress.percentage}
                                    label="Final Progress"
                                />
                            </div>
                            <SectionCounter
                                current={progress.sectionNumber}
                                total={progress.totalSections}
                            />
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onRestart}
                            className="px-6 py-3 rounded-xl font-semibold text-white bg-[#c88c1e] hover:bg-[#b47714] transition"
                        >
                            {isWon ? "Play Again" : "Restart"}
                        </button>
                        <Link
                            to="/"
                            className="px-6 py-3 rounded-xl font-semibold border border-[#ead8c6] bg-[#f6efe7] text-[#2b1f17] hover:bg-[#f2e7dc] transition text-center"
                        >
                            Back to Library
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
