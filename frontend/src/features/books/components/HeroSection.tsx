import { Icon } from "../../../ui/Icon";

export function HeroSection({ bookCount }: { bookCount: number }) {
    return (
        <section className="w-full" aria-label="Hero section">
            <div
                className="relative w-full py-16 md:py-20"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(43,31,23,.72), rgba(43,31,23,.72)), url('/hero.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="mx-auto max-w-6xl px-4 text-center text-white/95">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                        <Icon name="sparkling" label="Sparkles" className="mr-2" />
                        Adventure Awaits
                        <Icon name="sparkling" label="Sparkles" className="ml-2" />
                    </h1>

                    <p className="mt-5 max-w-3xl mx-auto text-lg md:text-xl text-white/85 leading-relaxed">
                        Embark on epic quests where every choice shapes your destiny. Explore mystical realms, solve ancient mysteries,
                        and become the hero of your own story.
                    </p>

                    <div className="mt-10 inline-flex items-center gap-4 text-white/90 font-semibold">
                        <Icon name="openBook" label="Books available" className="text-xl" />
                        <span>{bookCount} Epic Adventures Available</span>
                        <Icon name="sparkling" label="Sparkles" className="text-xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}