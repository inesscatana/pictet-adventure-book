interface EmptyStateProps {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            <p className="text-[#6b5647] text-lg">{message}</p>
            {onAction && actionLabel && (
                <button
                    onClick={onAction}
                    className="mt-4 text-sm text-[#6b5647] underline"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
