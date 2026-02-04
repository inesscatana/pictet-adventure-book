interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
    return (
        <div role="status" aria-live="polite" aria-atomic="true">
            <p className="text-center text-[#6b5647]">{message}</p>
        </div>
    );
}
