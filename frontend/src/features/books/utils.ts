export const difficultyLabelMap = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
} as const;

export function getDifficultyStyles(difficulty: string) {
    switch (difficulty.toLowerCase()) {
        case "easy":
            return "bg-emerald-100 text-emerald-700 border-emerald-400";
        case "medium":
            return "bg-orange-100 text-orange-700 border-orange-400";
        case "hard":
            return "bg-red-100 text-red-700 border-red-400";
        default:
            return "bg-gray-100 text-gray-600 border-gray-300";
    }
}

export function toTitleCase(value: string) {
    return value
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}