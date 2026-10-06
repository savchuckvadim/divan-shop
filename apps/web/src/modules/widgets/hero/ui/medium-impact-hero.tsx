import { Container } from "@workspace/ui/components/container";
import { Text } from "@workspace/ui/components/text";
import { cn } from "@workspace/ui/lib/utils";

import type { Locale } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { CmsLink, Media, RichText } from "@/modules/shared/ui";
import type { Page } from "@/payload-types";

import { HERO_PROSE } from "../lib/hero-prose";

type MediumImpactHeroProps = Page["hero"] & { locale: Locale };

export const MediumImpactHero = ({ links, media, richText, locale }: MediumImpactHeroProps) => {
    const { common } = getDictionary(locale);
    const mediaDoc = typeof media === "object" && media ? media : null;

    return (
        <section className="relative overflow-hidden bg-hero">
            <Container
                className={cn(
                    "grid gap-10 py-16 md:py-24",
                    mediaDoc && "lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16"
                )}
            >
                <div className="flex max-w-[40rem] flex-col items-start gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-soft fill-mode-both">
                    <Text as="span" eyebrow className="text-primary">
                        {common.cityLine}
                    </Text>
                    {richText && (
                        <RichText className={HERO_PROSE} data={richText} enableGutter={false} />
                    )}
                    {Array.isArray(links) && links.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-3">
                            {links.map(({ link }, index) => (
                                <li key={index}>
                                    <CmsLink {...link} size="lg" />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {mediaDoc && (
                    <div className="relative">
                        <div
                            aria-hidden
                            className="absolute -inset-x-3 -bottom-3 top-8 -z-10 rounded-3xl bg-secondary"
                        />
                        <Media
                            priority
                            resource={mediaDoc}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            imgClassName="w-full rounded-2xl object-cover shadow-lift"
                        />
                    </div>
                )}
            </Container>
            <div aria-hidden className="h-px bg-horizon" />
        </section>
    );
};
