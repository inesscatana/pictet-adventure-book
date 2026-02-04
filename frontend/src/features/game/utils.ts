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
    if (!section) return false;

    // Explicit END type
    if (section.type?.toUpperCase() === "END") return true;

    // Sections with no options are also endings (dead ends or completion)
    if (!section.options || section.options.length === 0) return true;

    return false;
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

export interface ProgressInfo {
    currentSectionIndex: number;
    totalSections: number;
    percentage: number;
    sectionNumber: number;
}

export function calculateProgress(
    book: { sections: Section[] } | undefined,
    currentSectionId: string | null,
    currentSection: Section | null
): ProgressInfo | null {
    if (!book || !currentSectionId) return null;

    const sections = book.sections;
    const currentIndex = sections.findIndex(
        (s) => String(s.id) === String(currentSectionId)
    );

    if (currentIndex === -1) return null;

    const totalSections = sections.length;

    // If current section is END, show 100% completion and display total sections
    const isEndSection = currentSection?.type === "END";
    const percentage = isEndSection
        ? 100
        : Math.round(((currentIndex + 1) / totalSections) * 100);

    // When on END section, show total sections as current (e.g., "Section 13 of 13")
    // Otherwise show actual section number
    const sectionNumber = isEndSection ? totalSections : currentIndex + 1;

    return {
        currentSectionIndex: currentIndex,
        totalSections,
        percentage,
        sectionNumber,
    };
}