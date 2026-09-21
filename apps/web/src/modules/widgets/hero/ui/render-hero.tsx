import type { Page } from "@/payload-types";

import { HighImpactHero } from "./high-impact-hero";
import { LowImpactHero } from "./low-impact-hero";
import { MediumImpactHero } from "./medium-impact-hero";

export type HeroProps = Page["hero"];

const heroes = {
    highImpact: HighImpactHero,
    mediumImpact: MediumImpactHero,
    lowImpact: LowImpactHero,
} as const;

export const RenderHero = (props: HeroProps) => {
    const { type } = props || {};
    if (!type || type === "none") return null;

    const Hero = heroes[type];
    return Hero ? <Hero {...props} /> : null;
};
