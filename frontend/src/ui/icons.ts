export const Icons = {
    sparkling: "✨",
    book: "📚",
    openBook: "📖",
    search: "🔍",
    filter: "🔽",
    clock: "🕔",
} as const;


export type IconName = keyof typeof Icons;