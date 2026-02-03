import type { Consequence, Section } from "./types";

export const INITIAL_HEALTH = 100;
export const MIN_HEALTH = 0;
export const MAX_HEALTH = 100;

export type GameState = "playing" | "won" | "lost";

export function getInitialSection(sections: Section[]): Section | undefined {
    return sections.find((s) => s.type === "BEGIN") ?? sections[0];
}

export function getInitialSectionId(book: { sections: Section[] }): string | null {
    const initial = getInitialSection(book.sections);
    return initial?.id ? String(initial.id) : null;
}

export function isEndSection(section: Section | null): boolean {
    return section?.type === "END";
}

export function processConsequence(
    consequence: Consequence,
    currentHealth: number
): { newHealth: number; message: string } {
    const value = parseInt(consequence.value, 10);
    let newHealth = currentHealth;
    let message = consequence.text || "";

    switch (consequence.type.toUpperCase()) {
        case "LOSE_HEALTH":
            newHealth = Math.max(MIN_HEALTH, currentHealth - value);
            if (!message) {
                message = `You lost ${value} health points.`;
            }
            break;
        case "GAIN_HEALTH":
            newHealth = Math.min(MAX_HEALTH, currentHealth + value);
            if (!message) {
                message = `You gained ${value} health points.`;
            }
            break;
        default:
            message = message || "Something happened...";
    }

    return { newHealth, message };
}

export function getHealthColor(health: number): string {
    if (health > 60) return "bg-emerald-500";
    if (health > 30) return "bg-orange-500";
    return "bg-red-500";
}

export function getHealthStatus(health: number): string {
    if (health > 60) return "Healthy";
    if (health > 30) return "Injured";
    if (health > 0) return "Critical";
    return "Defeated";
}