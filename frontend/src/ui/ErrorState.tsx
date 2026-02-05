import { Link } from "react-router-dom";

interface ErrorStateProps {
    message: string;
    title?: string;
    onRetry?: () => void;
    actionLabel?: string;
    actionHref?: string;
}

export function ErrorState({
    message,
    title,
    onRetry,
    actionLabel = "Retry",
    actionHref,
}: ErrorStateProps) {
    return (
        <div className="text-center py-12">
            {title && <h2 className="text-xl font-extrabold text-[#2b1f17] mb-2">{title}</h2>}
            <p className="text-[#6b5647] mb-4">{message}</p>
            {actionHref ? (
                <Link
                    to={actionHref}
                    className="inline-block px-4 py-2 rounded-xl bg-[#b47714] hover:bg-[#9b6510] transition text-white font-semibold text-sm"
                >
                    {actionLabel}
                </Link>
            ) : onRetry ? (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 rounded-lg bg-[#c88c1e] text-white hover:bg-[#b47714] transition font-semibold"
                >
                    {actionLabel}
                </button>
            ) : null}
        </div>
    );
}
