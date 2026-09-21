import { Container } from "@workspace/ui/components/container";
import { Text } from "@workspace/ui/components/text";

import type { Locale } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { CmsLink, Media, RichText } from "@/modules/shared/ui";
import type { Page } from "@/payload-types";

import { HERO_PROSE } from "../lib/hero-prose";

type HighImpactHeroProps = Page["hero"] & { locale: Locale };

export const HighImpactHero = ({ links, media, richText, locale }: HighImpactHeroProps) => {
    const { common } = getDictionary(locale);
    const mediaDoc = typeof media === "object" && media ? media : null;

    return (
        <section
            data-theme="dark"
            className="relative isolate flex min-h-[82vh] items-end overflow-hidden bg-background text-foreground"
        >
            {mediaDoc && (
                <Media
                    fill
                    priority
                    resource={mediaDoc}
                    sizes="100vw"
                    imgClassName="-z-20 object-cover"
                />
            )}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-background/90 via-background/45 to-background/10"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-px bg-horizon" />
            <Container className="relative pb-16 pt-40 md:pb-24 md:pt-56">
                <div className="max-w-[46rem] animate-in fade-in slide-in-from-bottom-4 duration-700 ease-soft fill-mode-both">
                    <Text as="span" eyebrow className="text-primary">
                        {common.cityLine}
                    </Text>
                    {richText && (
                        <RichText
                            className={`mt-5 prose-invert ${HERO_PROSE} prose-p:text-foreground/80`}
                            data={richText}
                            enableGutter={false}
                        />
                    )}
                    {Array.isArray(links) && links.length > 0 && (
                        <ul className="mt-9 flex flex-wrap gap-3">
                            {links.map(({ link }, index) => (
                                <li key={index}>
                                    <CmsLink {...link} size="lg" className="rounded-full" />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Container>
        </section>
    );
};
