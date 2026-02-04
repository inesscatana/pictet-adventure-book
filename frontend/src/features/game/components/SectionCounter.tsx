interface SectionCounterProps {
    current: number;
    total: number;
}

export function SectionCounter({ current, total }: SectionCounterProps) {
    return (
        <div
            className="flex items-center gap-2 text-sm text-[#6b5647]"
            role="status"
            aria-label={`Section ${current} of ${total}`}
        >
            <span className="font-semibold">Section</span>
            <span className="font-extrabold text-[#2b1f17]">{current}</span>
            <span className="font-semibold">of</span>
            <span className="font-extrabold text-[#2b1f17]">{total}</span>
        </div>
    );
}
