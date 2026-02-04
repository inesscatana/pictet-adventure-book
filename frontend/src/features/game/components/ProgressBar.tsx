interface ProgressBarProps {
    percentage: number;
    label?: string;
}

export function ProgressBar({ percentage, label }: ProgressBarProps) {
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    return (
        <div className="w-full">
            {label && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#6b5647]">{label}</span>
                    <span className="text-xs font-bold text-[#2b1f17]">{clampedPercentage}%</span>
                </div>
            )}
            <div className="h-2 bg-[#ead8c6] rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-[#b47714] to-[#c88c1e] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${clampedPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={clampedPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progress: ${clampedPercentage}%`}
                />
            </div>
        </div>
    );
}
