interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="text-center py-12">
            <p className="text-red-700 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 rounded-lg bg-[#c88c1e] text-white hover:bg-[#b47714] transition font-semibold"
                >
                    Retry
                </button>
            )}
        </div>
    );
}
