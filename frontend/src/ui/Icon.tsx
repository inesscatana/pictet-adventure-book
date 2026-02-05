import { Icons, type IconName } from "./icons";

type IconProps = {
    name: IconName;
    label?: string;
    className?: string;
};

export function Icon({ name, label, className }: IconProps) {
    return (
        <span
            className={className}
            role={label ? "img" : undefined}
            aria-label={label}
            {...(label ? {} : { "aria-hidden": true })}
        >
            {Icons[name]}
        </span>
    );
}