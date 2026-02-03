export function HealthChip({ hp }: { hp: number }) {
    const danger = hp <= 25;
    const mid = hp > 25 && hp <= 60;

    const cls = danger
        ? "bg-red-100 text-red-700 border-red-300"
        : mid
            ? "bg-orange-100 text-orange-700 border-orange-300"
            : "bg-emerald-100 text-emerald-700 border-emerald-300";

    return (
        <div className={`px-4 py-2 rounded-full border text-sm font-semibold inline-flex items-center gap-2 ${cls}`}>
            ❤️ {hp} HP
        </div>
    );
}