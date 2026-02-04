export function HealthChip({ hp }: { hp: number }) {
    const clampedHp = Math.max(0, Math.min(100, hp));
    const danger = clampedHp <= 25;
    const mid = clampedHp > 25 && clampedHp <= 60;

    const borderCls = danger
        ? "border-red-300"
        : mid
        ? "border-orange-300"
        : "border-emerald-300";

    const bgCls = danger
        ? "bg-red-100"
        : mid
        ? "bg-orange-100"
        : "bg-emerald-100";

    const textCls = danger
        ? "text-red-700"
        : mid
        ? "text-orange-700"
        : "text-emerald-700";

    const barCls = danger
        ? "bg-red-500"
        : mid
        ? "bg-orange-500"
        : "bg-emerald-500";

    return (
        <div
            className={`px-4 py-2 rounded-full border ${borderCls} ${bgCls} text-sm font-semibold inline-flex items-center gap-2 min-w-[120px] relative overflow-hidden transition-colors duration-300`}
            role="status"
            aria-live="polite"
            aria-label={`Health: ${clampedHp} out of 100`}
        >
            {/* Background health bar */}
            <div
                className={`absolute inset-0 ${barCls} opacity-20 transition-all duration-500 ease-out`}
                style={{ width: `${clampedHp}%` }}
            />

            {/* Content */}
            <span className="relative z-10" aria-hidden="true">❤️</span>
            <span className={`relative z-10 ${textCls}`}>{clampedHp} HP</span>
        </div>
    );
}