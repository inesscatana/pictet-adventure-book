import { Icon } from "../../../ui/Icon";

export function SearchInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="w-full max-w-lg h-11 px-4 rounded-2xl border border-[#ead8c6] bg-[#f6efe7] flex items-center gap-2">
            <Icon name="search" label="Search" className="opacity-70" />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search adventures..."
                className="w-full bg-transparent outline-none text-sm"
            />
        </div>
    );
}
