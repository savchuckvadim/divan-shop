import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";

import type { StorefrontContent } from "@/modules/entities";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { isPopulated } from "@/modules/shared/lib";
import { Media } from "@/modules/shared/ui";

interface StorefrontHeroProps {
    content: StorefrontContent;
    locale: Locale;
}

/**
 * Home hero of a storefront: the text first in HTML, then a native scroll-snap rail of photos. No
 * carousel script: every slide is crawlable, nothing shifts, and the first slide is the LCP image.
 */
export const StorefrontHero = ({ content, locale }: StorefrontHeroProps) => {
    const { common, home, product } = getDictionary(locale);
    const hero = content.hero;
    const slides = (hero?.slides ?? []).map((slide) => slide.image).filter(isPopulated);
    const cta =
        hero?.cta === "contacts"
            ? { href: ROUTES.contacts(locale), label: common.contacts }
            : { href: ROUTES.catalog(locale), label: home.ctaCatalog };

    return (
        <section data-slot="storefront-hero" className="pb-12 pt-10 md:pb-20 md:pt-16">
            <Container className="flex flex-col gap-6 md:gap-8">
                {content.slogan && (
                    <Text as="span" eyebrow className="text-muted-foreground">
                        {content.slogan}
                    </Text>
                )}
                <Heading as="h1" size="xl" className="max-w-[18ch]">
                    {hero?.heading || content.domain}
                </Heading>
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
                    {hero?.text && (
                        <Text size="lg" muted className="max-w-[44rem]">
                            {hero.text}
                        </Text>
                    )}
                    <Button asChild size="lg" className="w-fit shrink-0">
                        <Link href={cta.href}>{cta.label}</Link>
                    </Button>
                </div>
            </Container>
            {slides.length > 0 && (
                <ul
                    aria-label={product.gallery}
                    className="mt-10 flex snap-x snap-mandatory scroll-pl-[var(--page-margin,1rem)] gap-3 overflow-x-auto px-[var(--page-margin,1rem)] pb-2 [scrollbar-width:none] md:mt-14 md:gap-5"
                >
                    {slides.map((image, index) => (
                        <li
                            key={image.id}
                            data-slot="stage"
                            className="relative aspect-[4/5] w-[86%] shrink-0 snap-start overflow-hidden rounded-2xl sm:aspect-[3/2] sm:w-[72%] lg:w-[58%]"
                        >
                            <Media
                                resource={image}
                                fill
                                priority={index === 0}
                                sizes="(max-width: 640px) 86vw, (max-width: 1024px) 72vw, 58vw"
                                imgClassName="object-cover"
                            />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};
