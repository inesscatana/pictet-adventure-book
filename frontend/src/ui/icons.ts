export const Icons = {
    sparkling: "✨",
    book: "📚",
    openBook: "📖",
    search: "🔍",
    filter: "🔽",
    clock: "🕔",
    play: "▶️",
    save: "💾",
} as const;


export type IconName = keyof typeof Icons;