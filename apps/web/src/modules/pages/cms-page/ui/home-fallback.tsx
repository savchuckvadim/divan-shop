import Link from "next/link";

import { ArrowRightIcon, LanguagesIcon, MapPinIcon, TruckIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { Text } from "@workspace/ui/components/text";
import { PageHeader } from "@workspace/ui/composites/page-header";
import { Section } from "@workspace/ui/composites/section";
import { Stack } from "@workspace/ui/composites/stack";

import { getCurrency, getProducts, getSiteSettings } from "@/modules/entities";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { ProductGrid } from "@/modules/widgets";

/**
 * Rendered until an editor creates the `home` page in the CMS, so a fresh
 * install never greets visitors with a 404.
 */
export const HomeFallback = async ({ locale }: { locale: Locale }) => {
    const { common, catalog, home } = getDictionary(locale);
    const [settings, products] = await Promise.all([
        getSiteSettings(locale),
        getProducts({ locale, limit: 8 }),
    ]);

    const trust = [
        { icon: TruckIcon, ...home.trust.delivery },
        { icon: MapPinIcon, ...home.trust.showroom },
        { icon: LanguagesIcon, ...home.trust.languages },
    ];

    return (
        <>
            <section className="relative overflow-hidden bg-hero">
                <Container className="pb-14 pt-16 md:pb-20 md:pt-28">
                    <PageHeader
                        className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-soft fill-mode-both"
                        eyebrow={home.heroEyebrow}
                        title={
                            <>
                                {home.heroTitle} <em>{home.heroAccent}</em>
                            </>
                        }
                        description={home.heroText}
                    >
                        <Stack direction="row" gap="sm" wrap className="mt-4">
                            <Button asChild size="lg" shape="pill">
                                <Link href={ROUTES.catalog(locale)}>{home.ctaCatalog}</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" shape="pill">
                                <Link href={ROUTES.account(locale)}>{home.ctaVisit}</Link>
                            </Button>
                        </Stack>
                    </PageHeader>
                </Container>
                <div aria-hidden className="h-px bg-horizon" />
                <Container>
                    <ul className="grid gap-8 py-8 sm:grid-cols-3 sm:gap-6 md:py-10">
                        {trust.map(({ icon: Icon, title, text }) => (
                            <li
                                key={title}
                                className="flex gap-4 sm:border-l sm:border-border/70 sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                                    <Icon className="size-5" aria-hidden />
                                </span>
                                <div className="flex flex-col gap-1">
                                    <Text as="span" className="font-medium leading-snug">
                                        {title}
                                    </Text>
                                    <Text as="span" size="sm" muted>
                                        {text}
                                    </Text>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            <Section
                eyebrow={home.featuredEyebrow}
                title={catalog.featured}
                actions={
                    <Button asChild variant="link" className="px-0">
                        <Link href={ROUTES.catalog(locale)}>
                            {common.viewAll}
                            <ArrowRightIcon aria-hidden />
                        </Link>
                    </Button>
                }
            >
                <ProductGrid
                    products={products.docs}
                    currency={getCurrency(settings)}
                    locale={locale}
                />
            </Section>
        </>
    );
};
