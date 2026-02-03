export function GameOverModal({
    open,
    isWon,
    onRestart,
    onBack,
}: {
    open: boolean;
    isWon?: boolean;
    onRestart: () => void;
    onBack: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white border border-[#ead8c6] shadow-xl p-6">
                <h2 className="text-2xl font-extrabold text-[#2b1f17]">
                    {isWon ? "🎉 Victory!" : "💀 Game Over"}
                </h2>

                <p className="mt-2 text-sm text-[#4a352a]">
                    {isWon
                        ? "Congratulations! You've successfully completed the adventure!"
                        : "You ran out of health points. Your adventure ends here."}
                </p>

                <div className="mt-6 flex gap-3 justify-end">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-xl border border-[#ead8c6] bg-[#fffaf4] hover:bg-[#fbf3ea] transition text-sm font-semibold"
                    >
                        Back to Library
                    </button>

                    <button
                        onClick={onRestart}
                        className="px-4 py-2 rounded-xl bg-[#b47714] hover:bg-[#9b6510] transition text-sm font-semibold text-white"
                    >
                        {isWon ? "Play Again" : "Restart"}
                    </button>
                </div>
            </div>
        </div>
    );
}
