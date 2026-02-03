import type { ReactNode } from "react";
import { toTitleCase } from "../features/books/utils";

interface ChipProps {
    active?: boolean;
    children: ReactNode;
    onClick?: () => void;
}

export function Chip({ active, children, onClick }: ChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "h-7 px-3 rounded-full text-xs font-semibold border transition",
                active
                    ? "bg-[#b47714] text-white border-[#b47714]"
                    : "bg-[#f6efe7] text-[#4a352a] border-[#ead8c6] hover:bg-[#f2e7dc]",
            ].join(" ")}
        >
            {typeof children === "string" ? toTitleCase(children) : children}
        </button>
    );
}
